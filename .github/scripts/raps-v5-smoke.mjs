import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173/raps-no-bolso/';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readStore(page, dbName) {
  return page.evaluate(async ({ dbName }) => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('registros', 'readonly');
        const req = tx.objectStore('registros').getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } finally {
      db.close();
    }
  }, { dbName });
}

async function setChecked(page, selector) {
  await page.locator(selector).evaluate(el => {
    el.checked = true;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

async function acceptConsent(page) {
  await page.waitForSelector('#v5ConsentBackdrop');
  const accept = page.locator('#v5ConsentAccept');
  assert(await accept.isDisabled(), 'Consentimento deve exigir marcação explícita');
  await page.check('#v5ConsentCheck');
  assert(!(await accept.isDisabled()), 'Botão de consentimento não habilitou após marcação');
  await accept.click();
  await page.waitForSelector('#v5ConsentBackdrop', { state: 'detached' });
}

const browser = await chromium.launch({ headless: true });

try {
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(String(err)));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto(base + '?p=direitos', { waitUntil: 'networkidle' });
    assert(await page.locator('h1').count(), 'Conteúdo normal do app não abriu');
    assert(await page.locator('#v5ConsentBackdrop').count() === 0, 'Consentimento não pode bloquear navegação normal');

    await page.goto(base + '?p=pesquisa-participativa', { waitUntil: 'networkidle' });
    assert((await page.locator('h1').innerText()).includes('Pesquisa e participação'), 'Página V5 não abriu');
    assert(await page.locator('a[data-route="avaliacao"]').count(), 'Atalho de avaliação ausente');
    assert(await page.locator('a[data-route="participe-sus"]').count(), 'Atalho de participação ausente');
    assert(await page.locator('a[data-route="apresentacao-cientifica"]').count(), 'Atalho científico ausente');

    await page.goto(base + '?p=apresentacao-cientifica', { waitUntil: 'networkidle' });
    const scientific = await page.locator('#conteudo').innerText();
    assert(scientific.includes('IFG/UFG'), 'Página científica não identifica contexto IFG/UFG');
    assert(scientific.includes('não representa parceria'), 'Página científica precisa negar parceria não formalizada');

    await page.goto(base + '?p=avaliacao-rapida', { waitUntil: 'networkidle' });
    await page.selectOption('#quickEvalForm select[name="module"]', 'geral');
    await setChecked(page, '#quickEvalForm input[name="completed"][value="sim"]');
    await setChecked(page, '#quickEvalForm input[name="clarity"][value="5"]');
    await setChecked(page, '#quickEvalForm input[name="ease"][value="5"]');
    await setChecked(page, '#quickEvalForm input[name="nextStep"][value="sim"]');
    await page.fill('#quickEvalForm textarea[name="note"]', 'Teste V5 sem dados pessoais');
    await page.locator('#quickEvalForm button[type="submit"]').click();

    await page.waitForSelector('#v5ConsentBackdrop');
    assert(!(await page.locator('#quickEvalFeedback').innerText()).includes('salvo'), 'Avaliação foi salva antes do consentimento');
    await acceptConsent(page);
    await page.waitForFunction(() => document.querySelector('#quickEvalFeedback')?.textContent?.includes('salvo'));

    const evalRows = await readStore(page, 'raps-no-bolso-avaliacao');
    assert(evalRows.length === 1, `Esperado 1 registro de avaliação, encontrados ${evalRows.length}`);
    const evalRecord = evalRows[0];
    assert(evalRecord.consentVersion === 'v5-local-1', 'Registro de avaliação sem versão de consentimento');
    assert(evalRecord.collectionMode === 'local-voluntary', 'Registro de avaliação sem modo local-voluntary');
    assert(Boolean(evalRecord.consentAt), 'Registro de avaliação sem timestamp de consentimento');
    for (const key of ['cpf','cns','diagnostico','prontuario','latitude','longitude','lat','lng']) {
      assert(!(key in evalRecord), `Campo proibido persistido na avaliação: ${key}`);
    }

    assert(errors.length === 0, 'Erros no navegador durante avaliação V5: ' + errors.join(' | '));
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(base + '?p=participacao-sugerir', { waitUntil: 'networkidle' });

    assert(await page.locator('[data-v5-consent-note]').count(), 'Aviso de participação opcional não foi injetado');
    const forbidden = await page.locator('#suggestionForm input[name="cpf"], #suggestionForm input[name="cns"], #suggestionForm input[name="nome"], #suggestionForm input[name="diagnostico"], #suggestionForm input[name="prontuario"]').count();
    assert(forbidden === 0, 'Formulário de participação contém identificador clínico/pessoal proibido');

    await page.fill('#suggestionForm input[name="title"]', 'Melhorar sinalização');
    await page.fill('#suggestionForm textarea[name="problem"]', 'É difícil localizar a entrada correta.');
    await page.fill('#suggestionForm textarea[name="suggestion"]', 'Adicionar sinalização simples.');
    await setChecked(page, '#suggestionForm input[name="safePhoto"]');
    await page.locator('#suggestionForm button[type="submit"]').click();

    await page.waitForSelector('#v5ConsentBackdrop');
    assert(!(await page.locator('#suggestionFeedback').innerText()).includes('salva'), 'Participação foi salva antes do consentimento');
    await acceptConsent(page);
    await page.waitForFunction(() => document.querySelector('#suggestionFeedback')?.textContent?.includes('salva'));

    const rows = await readStore(page, 'raps-no-bolso-participacao');
    assert(rows.length === 1, `Esperado 1 registro de participação, encontrados ${rows.length}`);
    const record = rows[0];
    assert(record.consentVersion === 'v5-local-1', 'Registro de participação sem versão de consentimento');
    assert(record.collectionMode === 'local-voluntary', 'Registro de participação sem modo local-voluntary');
    assert(Boolean(record.consentAt), 'Registro de participação sem timestamp de consentimento');

    await context.close();
  }

  console.log('RAPS V5 consent browser smoke: PASS');
} finally {
  await browser.close();
}
