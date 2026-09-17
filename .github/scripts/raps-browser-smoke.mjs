import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/raps-no-bolso/';
const failures = [];

function check(condition, message) {
  try {
    assert.ok(condition, message);
    console.log(`PASS: ${message}`);
  } catch (error) {
    failures.push(error.message);
    console.error(`FAIL: ${error.message}`);
  }
}

function recordFailure(message, error) {
  const detail = `${message}: ${error?.message || error}`;
  failures.push(detail);
  console.error(`FAIL: ${detail}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  geolocation: { latitude: -16.6869, longitude: -49.2648 },
  permissions: ['geolocation']
});
const page = await context.newPage();
const runtimeErrors = [];

page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.message}`));
page.on('console', message => {
  if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
});

async function goto(route = '') {
  const url = route ? `${BASE}?p=${route}` : BASE;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#conteudo');
}

await goto();
await page.waitForSelector('#speakPage');

check(await page.locator('#fontDown').isVisible(), 'A− está visível no viewport mobile');
check(await page.locator('#fontUp').isVisible(), 'A+ está visível no viewport mobile');
check(await page.locator('#contrast').isVisible(), 'controle de contraste está visível');
check(await page.locator('#speakPage').isVisible(), 'controle de leitura está visível');

const brandTextDisplay = await page.locator('.brand > span:last-child').evaluate(el => getComputedStyle(el).display);
check(brandTextDisplay === 'none', 'cabeçalho mobile compacta apenas o texto visual da marca');
check(await page.locator('.brand-mark').isVisible(), 'símbolo R+ permanece visível no mobile');

const initialScale = Number(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale')));
await page.click('#fontUp');
const largerScale = Number(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale')));
check(largerScale > initialScale, 'A+ aumenta a escala do texto');
await page.click('#fontDown');
const restoredScale = Number(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale')));
check(restoredScale <= largerScale, 'A− reduz a escala do texto');

await page.click('#contrast');
check(await page.locator('body').evaluate(el => el.classList.contains('high-contrast')), 'alto contraste é ativado');
await page.click('#contrast');
check(!(await page.locator('body').evaluate(el => el.classList.contains('high-contrast'))), 'alto contraste é desativado');

await page.click('#menuButton');
check(await page.locator('#drawer').evaluate(el => el.classList.contains('open')), 'menu lateral abre');
await page.click('#closeMenu');
check(!(await page.locator('#drawer').evaluate(el => el.classList.contains('open'))), 'menu lateral fecha');

await goto('encontre-caminho');
await page.click('[data-path-key="recaida"]');
await page.waitForSelector('.path-result');
check((await page.locator('.path-result').innerText()).includes('Recaída não precisa virar afastamento do cuidado'), 'Encontre o caminho renderiza resultado de recaída');
check(await page.locator('.path-result a[data-route="ad-recaida"]').count() === 1, 'resultado de recaída aponta para ad-recaida');
await page.click('.path-result a[data-route="ad-recaida"]');
await page.waitForSelector('h1');
check((await page.locator('h1').first().innerText()).includes('Tive uma recaída'), 'navegação abre a rota canônica de recaída');

await goto('abstinencia');
await page.waitForSelector('h1');
check((await page.locator('h1').first().innerText()).includes('Estou com abstinência'), 'alias legado abstinencia continua funcional');

await goto('ad-abstinencia');
check((await page.locator('h1').first().innerText()).includes('Estou com abstinência'), 'rota canônica ad-abstinencia funciona');

await goto('direitos-atendimento');
const rightsText = await page.locator('#conteudo').innerText();
check(rightsText.includes('Não possuir ou não portar documento com o número do CPF ou CNS não é, por si só, impedimento ao atendimento.'), 'página de direitos renderiza a regra atual de CPF/CNS');
check(rightsText.includes('art. 258'), 'página de direitos renderiza a ressalva do art. 258');
check(!rightsText.includes('Portaria GM/MS nº 940/2011, art. 13'), 'página final de direitos não exibe mais a orientação antiga da Portaria 940/2011');

await goto('onde-ajuda');
const helpText = await page.locator('#conteudo').innerText();
check(helpText.includes('Sem o número do CPF/CNS?'), 'Onde buscar ajuda usa o cabeçalho atualizado de CPF/CNS');
check(helpText.includes('outro documento válido'), 'Onde buscar ajuda renderiza a regra atual de identificação');

await goto('servicos-goiania');
await page.waitForSelector('#serviceResults');
check((await page.locator('#serviceResults').innerText()).includes('UPA Chácara do Governador'), 'diretório inclui UPA Chácara do Governador');
await page.selectOption('#serviceType', 'upa');
await page.waitForTimeout(100);
check(await page.locator('#serviceResults .service-card').count() >= 4, 'filtro UPA retorna pelo menos quatro unidades verificadas');

await page.click('#useLocation');
await page.waitForFunction(() => document.getElementById('useLocation')?.textContent?.includes('Localização ativada'));
await page.waitForFunction(() => {
  const status = document.getElementById('locationStatus')?.innerText || '';
  const route = [...document.querySelectorAll('#serviceResults a')].find(a => /Traçar rota/i.test(a.textContent || ''));
  return status.includes('apenas em memória') && Boolean(route?.href?.includes('origin='));
});
check((await page.locator('#locationStatus').innerText()).includes('apenas em memória'), 'GPS informa uso apenas em memória');
const routeHref = await page.locator('#serviceResults a', { hasText: 'Traçar rota' }).first().getAttribute('href');
check(Boolean(routeHref && routeHref.includes('origin=')), 'rota externa recebe origem somente após GPS autorizado');

await goto('ubs-goiania');
await page.waitForSelector('#ubsResults');
await page.fill('#ubsSearch', 'Estrela Dalva');
await page.waitForTimeout(100);
const ubsText = await page.locator('#ubsResults').innerText();
check(ubsText.includes('Estrela Dalva'), 'busca de UBS encontra Estrela Dalva');
check((await page.locator('#ubsCount').innerText()).startsWith('1 registro'), 'filtro de UBS reduz o resultado para o registro esperado');

const addonFailures = await page.evaluate(() => window.__rapsAddonLoadFailures || []);
check(Array.isArray(addonFailures) && addonFailures.length === 0, 'nenhum addon falhou ao carregar no navegador');
check(runtimeErrors.length === 0, `nenhum erro JavaScript/console ocorreu (${runtimeErrors.join(' | ') || '0 erros'})`);

try {
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) {
    await page.reload({ waitUntil: 'networkidle' });
  }
  check(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), 'service worker controla a página antes do teste offline');
  await context.setOffline(true);
  await page.goto(`${BASE}?p=ad-abstinencia`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');
  check((await page.locator('h1').first().innerText()).includes('Estou com abstinência'), 'rota principal continua disponível offline pelo service worker');
  await context.setOffline(false);
} catch (error) {
  await context.setOffline(false).catch(() => {});
  recordFailure('PWA offline não passou no Chromium', error);
}

const deniedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
try {
  await deniedContext.clearPermissions();
  const deniedPage = await deniedContext.newPage();
  await deniedPage.goto(`${BASE}?p=servicos-goiania`, { waitUntil: 'networkidle' });
  await deniedPage.waitForSelector('#useLocation');
  await deniedPage.click('#useLocation');
  await deniedPage.waitForFunction(() => document.getElementById('locationStatus')?.dataset.state === 'error');
  const deniedText = await deniedPage.locator('#locationStatus').innerText();
  check(deniedText.includes('Permissão de localização negada'), 'GPS negado mantém o diretório utilizável e informa a recusa');
  check(await deniedPage.locator('#serviceResults .service-card').count() > 0, 'serviços continuam visíveis com GPS negado');
} catch (error) {
  recordFailure('Cenário de GPS negado não passou no Chromium', error);
} finally {
  await deniedContext.close();
}

const unavailableContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
try {
  const unavailablePage = await unavailableContext.newPage();
  await unavailablePage.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
  });
  await unavailablePage.goto(`${BASE}?p=servicos-goiania`, { waitUntil: 'networkidle' });
  await unavailablePage.waitForSelector('#useLocation');
  await unavailablePage.click('#useLocation');
  const unavailableText = await unavailablePage.locator('#locationStatus').innerText();
  check(unavailableText.includes('não oferece geolocalização'), 'navegador sem geolocalização recebe fallback explícito');
  check(await unavailablePage.locator('#serviceResults .service-card').count() > 0, 'diretório funciona sem API de geolocalização');
} catch (error) {
  recordFailure('Cenário sem API de geolocalização não passou no Chromium', error);
} finally {
  await unavailableContext.close();
}

await context.close();
await browser.close();

if (failures.length) {
  console.error('\nFalhas do smoke funcional:');
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exit(1);
}

console.log('\nRAPS no Bolso browser smoke: PASS');