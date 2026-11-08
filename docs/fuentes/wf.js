const { chromium } = require('playwright');
const [file, out] = process.argv.slice(2);
const EXE = process.env.HOME + '/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const W = { desktop: 1440, tablet: 834, mobile: 390 };
(async () => {
  const b = await chromium.launch();
  for (const [d, w] of Object.entries(W)) {
    const pg = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: d === 'mobile' ? 2 : 1 });
    for (const p of ['home', 'tienda', 'producto', 'experiencias', 'contacto']) {
      await pg.goto('file:///' + file + '?p=' + p);
      await pg.screenshot({ path: `${out}/wf-${d}-${p}.png`, fullPage: true });
    }
    await pg.close();
  }
  await b.close();
})();
