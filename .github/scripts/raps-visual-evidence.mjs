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

await goto();
await page.screenshot({ path: `${OUT}/01-home-mobile.png`, fullPage: true });

await page.click('#menuButton');
await page.waitForSelector('#drawer.open');
await page.screenshot({ path: `${OUT}/02-menu-mobile.png`, fullPage: false });
await page.click('#closeMenu');

await page.click('#contrast');
await page.screenshot({ path: `${OUT}/03-high-contrast-mobile.png`, fullPage: true });
await page.click('#contrast');

await goto('direitos-atendimento');
await page.screenshot({ path: `${OUT}/04-direitos-cpf-cns.png`, fullPage: true });

await goto('servicos-goiania');
await page.selectOption('#serviceType', 'upa');
await page.click('#useLocation');
await page.waitForFunction(() => document.getElementById('useLocation')?.textContent?.includes('Localização ativada'));
await page.screenshot({ path: `${OUT}/05-servicos-upa-gps.png`, fullPage: true });

await goto('ubs-goiania');
await page.fill('#ubsSearch', 'Estrela Dalva');
await page.waitForTimeout(150);
await page.screenshot({ path: `${OUT}/06-ubs-estrela-dalva.png`, fullPage: true });

await context.close();
await browser.close();

console.log(`Visual evidence saved in ${OUT}`);
