// Capturas de pantalla de todas las rutas en 3 dispositivos.
const { chromium } = require('playwright');
const out = process.argv[2]; const base = process.argv[3] || 'http://localhost:4300';
const only = process.argv[4];
const EXE = process.env.HOME + '/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const devices = { desktop: { width: 1440, height: 900, dpr: 1 }, tablet: { width: 834, height: 1112, dpr: 1 }, mobile: { width: 390, height: 844, dpr: 1.5 } };
const pages = [['inicio','/'],['tienda','/tienda'],['producto','/tienda/geisha-la-esperanza'],['experiencias','/experiencias'],['nosotros','/nosotros'],['contacto','/contacto'],['carrito','/carrito'],['404','/no-existe']];
(async () => {
  const b = await chromium.launch();
  for (const [dn, d] of Object.entries(devices)) {
    if (only && !only.split(',').includes(dn)) continue;
    const ctx = await b.newContext({ viewport: { width: d.width, height: d.height }, deviceScaleFactor: d.dpr, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    pg.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', dn, m.text()); });
    pg.on('pageerror', e => console.log('PAGEERR', dn, e.message));
    for (const [name, url] of pages) {
      if (name === 'carrito') {
        await pg.goto(base + '/');
        await pg.evaluate(() => localStorage.setItem('cumbre-cart-v1', JSON.stringify([{slug:'geisha-la-esperanza',grind:'Molido para V60',qty:1},{slug:'cumbre-clasico',grind:'Grano entero',qty:2}])));
      }
      await pg.goto(base + url, { waitUntil: 'networkidle' });
      await pg.evaluate(() => document.fonts.ready);
      await pg.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible')));
      await pg.waitForTimeout(500);
      await pg.screenshot({ path: `${out}/${dn}-${name}.png`, fullPage: true });
      if (name === 'carrito') await pg.evaluate(() => localStorage.clear());
    }
    await ctx.close();
  }
  await b.close();
})();
