import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/raps-no-bolso/';
const OUT = 'artifacts/raps-browser';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  geolocation: { latitude: -16.6869, longitude: -49.2648 },
  permissions: ['geolocation'],
  reducedMotion: 'reduce'
});
const page = await context.newPage();

async function goto(route = '') {
  const url = route ? `${BASE}?p=${route}` : BASE;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#conteudo');
  await page.waitForSelector('#speakPage');
}

async function capture(name, fullPage = true) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}/${name}`, fullPage });
}

await goto();
const homeColumns = await page.locator('.home-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
if (homeColumns !== 1 || await page.locator('.home-grid .nav-card').count() !== 4) {
  throw new Error('Home mobile deve mostrar quatro escolhas em uma coluna');
}
await capture('01-home-mobile.png');

await page.click('#menuButton');
await page.waitForSelector('#drawer.open');
await capture('02-menu-mobile.png', false);
await page.click('#closeMenu');

await page.click('#contrast');
await capture('03-high-contrast-mobile.png');
await page.click('#contrast');

await goto('direitos-atendimento');
await capture('04-direitos-cpf-cns.png');

await goto('servicos-goiania');
await page.selectOption('#serviceType', 'upa');
await page.click('#useLocation');
await page.waitForFunction(() => document.getElementById('useLocation')?.textContent?.includes('Localização ativada'));
await capture('05-servicos-upa-gps.png');

await goto('ubs-goiania');
await page.fill('#ubsSearch', 'Estrela Dalva');
await page.waitForTimeout(150);
await capture('06-ubs-estrela-dalva.png');

await goto('pesquisa-participativa');
await capture('07-v5-pesquisa-participacao.png');

await goto('avaliacao-rapida');
await page.evaluate(() => window.RAPSResearchV5?.askConsent?.(() => {}));
await page.waitForSelector('#v5ConsentBackdrop');
await capture('08-v5-consentimento.png', false);
await page.click('#v5ConsentCancel');

await goto('escuta-comunitaria');
await capture('09-v5-escuta-comunitaria.png');

await goto('pesquisa-painel-agregado');
await page.waitForFunction(() => Boolean(window.__rapsV5LastAggregate));
await capture('10-v5-sintese-agregada.png');

await goto('apresentacao-cientifica');
await capture('11-v5-apresentacao-cientifica.png');

await context.close();
await browser.close();

console.log(`Visual evidence saved in ${OUT}`);
