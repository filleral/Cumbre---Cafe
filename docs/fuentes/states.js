// Capturas de estados interactivos
const { chromium } = require('playwright');
const out = process.argv[2]; const base = 'http://localhost:4300';
const EXE = process.env.HOME + '/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
(async () => {
  const b = await chromium.launch();
  // móvil: menú abierto
  let ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  let pg = await ctx.newPage();
  await pg.goto(base + '/', { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
  await pg.click('.burger'); await pg.waitForTimeout(700);
  await pg.screenshot({ path: out + '/st-mobile-menu.png' });
  await pg.click('.burger'); await pg.waitForTimeout(500);
  await pg.screenshot({ path: out + '/st-mobile-hero.png' });
  // móvil: carrito lateral
  await pg.goto(base + '/tienda', { waitUntil: 'networkidle' });
  await pg.locator('app-product-card .add').nth(0).click();
  await pg.locator('app-product-card .add').nth(1).click();
  await pg.waitForTimeout(400);
  await pg.screenshot({ path: out + '/st-mobile-toast.png' });
  await pg.click('button[aria-label="Abrir carrito"]'); await pg.waitForTimeout(700);
  await pg.screenshot({ path: out + '/st-mobile-drawer.png' });
  await ctx.close();
  // escritorio: drawer, validación, filtros
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  pg = await ctx.newPage();
  await pg.goto(base + '/tienda/honey-rosado', { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
  await pg.click('text=Molido para V60'); await pg.click('.buy .add'); await pg.waitForTimeout(300);
  await pg.click('button[aria-label="Abrir carrito"]'); await pg.waitForTimeout(700);
  await pg.screenshot({ path: out + '/st-desktop-drawer.png' });
  await pg.goto(base + '/contacto', { waitUntil: 'networkidle' });
  await pg.fill('#c-email', 'correo-malo'); await pg.click('button[type=submit]'); await pg.waitForTimeout(300);
  await pg.locator('form.form').screenshot({ path: out + '/st-desktop-validacion.png' });
  await pg.goto(base + '/tienda', { waitUntil: 'networkidle' });
  await pg.locator('.filters label.check').first().click(); await pg.fill('input[type=search]', 'jazm'); await pg.waitForTimeout(300);
  await pg.screenshot({ path: out + '/st-desktop-filtros.png' });
  await pg.goto(base + '/experiencias', { waitUntil: 'networkidle' });
  await pg.locator('#reserva').scrollIntoViewIfNeeded();
  await pg.selectOption('#exp', 'finca'); await pg.fill('#people', '4'); await pg.waitForTimeout(300);
  await pg.locator('#reserva').screenshot({ path: out + '/st-desktop-reserva.png' });
  // primera vista (above the fold) por dispositivo
  for (const [n, w, h, dpr] of [['desktop', 1440, 900, 1], ['tablet', 834, 1112, 1], ['mobile', 390, 844, 2]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const p = await c.newPage(); await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
    await p.screenshot({ path: `${out}/fold-${n}.png` }); await c.close();
  }
  await b.close();
})();
