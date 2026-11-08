const { chromium } = require('playwright');
const [src, out] = process.argv.slice(2);
const EXE = process.env.HOME + '/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file:///' + src, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
