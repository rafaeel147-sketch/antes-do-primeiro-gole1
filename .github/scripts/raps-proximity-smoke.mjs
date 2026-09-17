import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4173/raps-no-bolso/';
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

await page.goto(`${BASE}?p=ubs-goiania`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.__rapsProximity));
await page.waitForSelector('#ubsResults .service-card');
await page.waitForFunction(() => document.querySelector('#ubsResults .service-card a[data-route-query-strengthened="1"]'));

const cards = await page.locator('#ubsResults .service-card').evaluateAll(items => items.map(card => {
  const text = card.innerText;
  const match = text.match(/CNES:\s*(\d{7})/i);
  return { cnes: match?.[1] || null, name: card.querySelector('h3')?.textContent?.trim() || '' };
}).filter(item => item.cnes));

const unique = [];
for (const card of cards) {
  if (!unique.some(item => item.cnes === card.cnes)) unique.push(card);
  if (unique.length === 2) break;
}
assert.equal(unique.length, 2, 'precisa haver pelo menos dois CNES distintos no diretório');

const [nearCard, farCard] = unique;
await page.evaluate(({ near, far }) => {
  window.__rapsProximityTestCoordinates = {
    [near]: { lat: -16.6872, lng: -49.2651, municipio: 'GOIANIA' },
    [far]: { lat: -16.7900, lng: -49.3800, municipio: 'GOIANIA' }
  };
}, { near: nearCard.cnes, far: farCard.cnes });

const strengthenedDestination = await page.locator('#ubsResults .service-card').first().locator('a', { hasText: 'Traçar rota' }).evaluate(link => new URL(link.href).searchParams.get('destination'));
assert.ok(strengthenedDestination?.includes(nearCard.name), 'fallback textual deve incluir nome da unidade, não apenas o endereço');

await page.click('#ubsUseLocation');
await page.waitForFunction(() => document.getElementById('ubsUseLocation')?.textContent?.includes('Proximidade ativada'));
await page.waitForFunction(() => document.getElementById('ubsLocationStatus')?.textContent?.includes('ordenados por distância'));

const firstAfterRanking = await page.locator('#ubsResults .service-card').first().evaluate(card => {
  const match = card.innerText.match(/CNES:\s*(\d{7})/i);
  const link = [...card.querySelectorAll('a')].find(a => /Traçar rota/i.test(a.textContent || ''));
  const url = new URL(link.href);
  return {
    cnes: match?.[1] || null,
    distance: card.querySelector('[data-proximity-distance]')?.textContent || '',
    exact: link.dataset.proximityExact,
    origin: url.searchParams.get('origin'),
    destination: url.searchParams.get('destination')
  };
});

assert.equal(firstAfterRanking.cnes, nearCard.cnes, 'unidade simulada como mais próxima deve ficar em primeiro lugar');
assert.match(firstAfterRanking.distance, /km em linha reta/, 'distância deve ser exibida como linha reta');
assert.equal(firstAfterRanking.exact, '1', 'rota validada deve ser marcada como destino exato');
assert.ok(firstAfterRanking.origin?.startsWith('-16.6869,-49.2648'), 'origem deve usar a localização do aparelho');
assert.equal(firstAfterRanking.destination, '-16.6872,-49.2651', 'destino deve usar coordenada pública validada');

await page.fill('#ubsSearch', farCard.cnes);
await page.waitForFunction(cnes => {
  const cards = [...document.querySelectorAll('#ubsResults .service-card')];
  return cards.length === 1 && cards[0].innerText.includes(cnes) && Boolean(cards[0].querySelector('[data-proximity-distance]'));
}, farCard.cnes);

const filteredExact = await page.locator('#ubsResults .service-card a', { hasText: 'Traçar rota' }).getAttribute('data-proximity-exact');
assert.equal(filteredExact, '1', 'ranking exato deve sobreviver ao re-render dos filtros');

await page.goto(`${BASE}?p=servicos-goiania`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.__rapsProximity) && Boolean(window.__rapsServiceProximity));
await page.waitForFunction(() => document.querySelector('#serviceResults .service-card a[data-route-query-strengthened="1"]'));
const serviceRoute = await page.locator('#serviceResults .service-card').first().evaluate(card => {
  const name = card.querySelector('h3')?.textContent?.trim() || '';
  const link = [...card.querySelectorAll('a')].find(a => /Traçar rota/i.test(a.textContent || ''));
  return { name, destination: new URL(link.href).searchParams.get('destination') || '' };
});
assert.ok(serviceRoute.destination.includes(serviceRoute.name), 'rota de CAPS/UPA deve usar nome + endereço para reduzir ambiguidade');

await page.selectOption('#serviceType', 'upa');
await page.waitForFunction(() => document.querySelectorAll('#serviceResults .service-card').length === 4);
await page.evaluate(() => {
  window.__rapsServiceProximityTestCoordinates = {
    '7304188': { lat: -16.7900, lng: -49.3800, municipio: 'GOIANIA' },
    '7821379': { lat: -16.6871, lng: -49.2650, municipio: 'GOIANIA' },
    '2339552': { lat: -16.7200, lng: -49.2100, municipio: 'GOIANIA' },
    '2339528': { lat: -16.7100, lng: -49.2850, municipio: 'GOIANIA' }
  };
});

await page.click('#useLocation');
await page.waitForFunction(() => document.getElementById('useLocation')?.textContent?.includes('Proximidade ativada'));
await page.waitForFunction(() => document.getElementById('locationStatus')?.textContent?.includes('ordenadas pela distância'));

const firstUpa = await page.locator('#serviceResults .service-card').first().evaluate(card => {
  const name = card.querySelector('h3')?.textContent?.trim() || '';
  const distance = card.querySelector('[data-service-proximity-distance]')?.textContent || '';
  const link = [...card.querySelectorAll('a')].find(a => /Traçar rota/i.test(a.textContent || ''));
  const url = new URL(link.href);
  return {
    name,
    distance,
    exact: link.dataset.serviceProximityExact,
    origin: url.searchParams.get('origin'),
    destination: url.searchParams.get('destination')
  };
});

assert.match(firstUpa.name, /UPA Noroeste/i, 'UPA simulada como mais próxima deve ficar em primeiro lugar');
assert.match(firstUpa.distance, /km em linha reta/, 'UPA deve mostrar distância em linha reta');
assert.equal(firstUpa.exact, '1', 'rota da UPA deve ser marcada como destino por coordenada exata');
assert.ok(firstUpa.origin?.startsWith('-16.6869,-49.2648'), 'origem da rota da UPA deve usar localização do aparelho');
assert.equal(firstUpa.destination, '-16.6871,-49.265', 'destino da UPA deve usar coordenada pública validada');

assert.deepEqual(runtimeErrors, [], `nenhum erro JavaScript esperado: ${runtimeErrors.join(' | ')}`);

await context.close();
await browser.close();
console.log('RAPS proximity browser smoke: PASS');
