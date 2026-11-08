// Graba un recorrido de ~2 min del prototipo con subtítulos (sigue el guion del documento).
const { chromium } = require('playwright');
const out = process.argv[2];
const base = 'http://localhost:4300';
const EXE = process.env.HOME + '/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';

const overlay = () => {
  const mk = () => {
    if (document.getElementById('__cap')) return;
    const d = document.createElement('div');
    d.id = '__cap';
    d.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:99999;max-width:980px;width:max-content;padding:14px 26px;border-radius:16px;background:rgba(29,20,15,.88);color:#f6efe4;font:600 20px/1.4 "DM Sans",system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.35);pointer-events:none;transition:opacity .4s';
    const t = document.createElement('div');
    t.id = '__tag';
    t.style.cssText = 'position:fixed;left:24px;top:104px;z-index:99999;padding:8px 14px;border-radius:99px;background:#b8412c;color:#fff;font:700 13px "DM Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;pointer-events:none';
    document.documentElement.append(d, t);
    d.textContent = window.name.split('|')[0] || '';
    t.textContent = window.name.split('|')[1] || '';
    if (!d.textContent) d.style.opacity = 0;
    if (!t.textContent) t.style.opacity = 0;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mk); else mk();
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ locale: 'es-CO', viewport: { width: 1280, height: 720 }, recordVideo: { dir: out, size: { width: 1280, height: 720 } } });
  await ctx.addInitScript(overlay);
  const pg = await ctx.newPage();
  const t0 = Date.now();
  const cap = async (text, tag = '') => {
    await pg.evaluate(([x, y]) => {
      window.name = x + '|' + y;
      const d = document.getElementById('__cap'), t = document.getElementById('__tag');
      if (d) { d.textContent = x; d.style.opacity = x ? 1 : 0; }
      if (t) { t.textContent = y; t.style.opacity = y ? 1 : 0; }
    }, [text, tag]);
  };
  const until = async (sec) => { const w = sec * 1000 - (Date.now() - t0); if (w > 0) await pg.waitForTimeout(w); };
  const scrollTo = async (y, ms = 1500) => {
    await pg.evaluate(async ([y, ms]) => {
      const s = window.scrollY, d = y - s, t = performance.now();
      await new Promise((r) => { const f = (n) => { const k = Math.min(1, (n - t) / ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; window.scrollTo(0, s + d * e); k < 1 ? requestAnimationFrame(f) : r(); }; requestAnimationFrame(f); });
    }, [y, ms]);
  };
  const toSel = async (sel, ms = 1500, off = 90) => {
    const y = await pg.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + window.scrollY - o, [sel, off]);
    await scrollTo(y, ms);
  };

  // 0:00 Inicio
  await pg.goto(base + '/', { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await cap('Cumbre · Café de Origen — prototipo web de una tostadora de café de especialidad del Huila', 'Inicio');
  await until(6);
  await cap('Diseño y desarrollo: Heidy Tatiana Beltrán Ramírez · Interfaces y Diseño Web', 'Inicio');
  await until(12);
  // 0:12 Hero
  await cap('Jerarquía: el titular en serif grande es lo primero que se lee', 'Jerarquía');
  await pg.hover('h1'); await until(18);
  await cap('CTA primario en rojo cereza “Comprar café” y secundario con borde “Reserva una cata”', 'Llamados a la acción');
  await pg.hover('.hero-ctas .btn'); await until(25);
  await cap('Las cifras (familias, altura, puntaje) generan confianza', 'Jerarquía'); await until(30);
  // 0:30 Scroll inicio
  await cap('El contenido sigue el recorrido del usuario: beneficios → cafés destacados…', 'Recorrido');
  await toSel('.values', 1800); await until(34);
  await toSel('.products', 1500, 160);
  await pg.locator('app-product-card').nth(1).hover(); await until(38);
  await cap('…el proceso del grano a la taza, la suscripción y las experiencias', 'Recorrido');
  await toSel('.steps', 1500, 200); await until(42);
  await toSel('.club', 1500, 120); await until(45);
  await toSel('.exps', 1500, 180); await until(48);
  // 0:48 Tienda y producto
  await pg.click('nav.nav a[href$="/tienda"]');
  await pg.waitForTimeout(600);
  await cap('Tienda: filtros por tostión, proceso y precio, y búsqueda por notas de sabor', 'Navegación');
  await pg.locator('.filters label.check').first().click(); await pg.waitForTimeout(700);
  await pg.locator('input[type=search]').pressSequentially('jazm', { delay: 120 }); await until(55);
  await pg.locator('input[type=search]').fill(''); await pg.locator('.filters label.check').first().click();
  await pg.locator('app-product-card h3 a').nth(1).click(); await pg.waitForTimeout(600);
  await cap('Detalle: precio y botón de compra siempre visibles; la ficha técnica muestra el origen', 'Producto');
  await pg.click('text=Molido para V60'); await until(61);
  await toSel('.specs', 1500, 120); await until(65);
  await scrollTo(0, 1000);
  // 1:05 Carrito
  await cap('Al agregar, una notificación confirma la acción y el contador se actualiza', 'Estado del sistema');
  await pg.click('.buy .add'); await until(71);
  await pg.click('button[aria-label="Abrir carrito"]');
  await cap('El carrito lateral muestra cuánto falta para el envío gratis', 'Carrito'); await until(80);
  await pg.keyboard.press('Escape');
  // 1:20 Experiencias
  await pg.click('nav.nav a[href$="/experiencias"]'); await pg.waitForTimeout(500);
  await cap('Experiencias: duración, cupo, qué incluye y precio por persona', 'Experiencias');
  await toSel('#cata', 1400, 100); await until(85);
  await toSel('#reserva', 1500, 70);
  await cap('El formulario de reserva calcula el total en vivo y valida los datos', 'Reserva');
  await pg.selectOption('#exp', 'finca'); await pg.waitForTimeout(500);
  await pg.fill('#people', '4'); await pg.waitForTimeout(500);
  await pg.click('.booking-form button[type=submit]'); await until(95);

  // 1:35 Responsivo: vitrina con tableta y celular
  await pg.setContent(`<html><body style="margin:0;background:radial-gradient(circle at 80% 10%,#f3c98b,transparent 50%),#2a1810;height:720px;display:flex;align-items:center;justify-content:center;gap:56px;font-family:sans-serif">
    <div style="text-align:center;color:#f6efe4"><iframe id="t" src="${base}/" style="width:834px;height:1112px;border:0;border-radius:28px;transform:scale(.52);transform-origin:top left;background:#fff"></iframe></div>
    <div style="text-align:center;color:#f6efe4"><iframe id="m" src="${base}/tienda" style="width:390px;height:844px;border:0;border-radius:36px;transform:scale(.72);transform-origin:top left;background:#fff"></iframe></div>
  </body></html>`);
  await pg.addStyleTag({ content: 'body>div{position:relative} #t{margin-right:-400px;margin-bottom:-534px} #m{margin-right:-109px;margin-bottom:-236px} iframe{box-shadow:0 0 0 12px #111,0 30px 60px rgba(0,0,0,.5)}' });
  await pg.evaluate(overlay);
  await cap('Responsivo: en tableta y celular el menú se vuelve hamburguesa y los botones ocupan todo el ancho', 'Tableta · Celular');
  await pg.waitForTimeout(2500);
  const ft = pg.frameLocator('#t'), fm = pg.frameLocator('#m');
  await fm.locator('.burger').click(); await pg.waitForTimeout(2200);
  await fm.locator('.burger').click(); await pg.waitForTimeout(600);
  for (const f of [pg.frames()[1], pg.frames()[2]]) f && f.evaluate(() => { let y = 0; const id = setInterval(() => { y += 6; window.scrollTo(0, y); if (y > 2400) clearInterval(id); }, 16); });
  await until(112);
  // 1:52 cierre
  await pg.setContent(`<html><body style="margin:0;height:720px;display:grid;place-items:center;background:radial-gradient(circle at 80% 10%,rgba(217,164,65,.35),transparent 45%),radial-gradient(circle at 0% 100%,rgba(184,65,44,.45),transparent 50%),#2a1810;color:#f6efe4;font-family:Georgia,serif;text-align:center">
    <div><svg width="110" height="110" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#f6efe4"/><path d="M10 46 L26 22 L34 33 L40 26 L54 46 Z" fill="#b8412c"/><path d="M26 22 L30 28 L27 30 L23 27 Z" fill="#2a1810"/><circle cx="46" cy="16" r="5" fill="#d9a441"/></svg>
    <h1 style="font-size:64px;margin:20px 0 6px">Cumbre</h1><p style="font-size:28px;font-style:italic;margin:0 0 30px;color:#d4583f">Del corazón de la montaña a tu taza.</p>
    <p style="font:600 18px sans-serif;opacity:.75">Heidy Tatiana Beltrán Ramírez · Interfaces y Diseño Web · 2026</p></div></body></html>`);
  await until(116);
  const v = pg.video();
  await ctx.close();
  console.log(await v.path());
  await b.close();
})();
