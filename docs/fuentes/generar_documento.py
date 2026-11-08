"""
Genera el HTML del documento de entrega (ACA Final · Interfaces y Diseño Web).
Uso: python generar_documento.py <dir_capturas> <dir_wireframes> <dir_estados> <dir_salida>
Luego el HTML se imprime a PDF con Chromium (imprimir_pdf.js).
"""
import sys, os, math, html
from PIL import Image

SHOTS, WF, ST, OUT = sys.argv[1:5]
IMG = os.path.join(OUT, 'img')
os.makedirs(IMG, exist_ok=True)

AUTORA = 'Heidy Tatiana Beltrán Ramírez'
URL = 'https://filleral.github.io/Cumbre---Cafe/'
REPO = 'https://github.com/filleral/Cumbre---Cafe'
import segno
for _n, _u in (('qr-sitio', URL), ('qr-repo', REPO)):
    segno.make(_u, error='m').save(os.path.join(IMG, _n + '.svg'), scale=10, border=2, dark='#2a1810', light='#ffffff')


def qr_block(dark=False):
    c = '#f6efe4' if dark else '#2a1810'
    return f'''<div style="display:flex;gap:6mm;align-items:center">
  <div style="text-align:center"><img src="img/qr-sitio.svg" style="width:30mm;height:30mm;border-radius:2mm;background:#fff;padding:1mm"><div style="font-size:7pt;font-weight:700;letter-spacing:.12em;color:{c};margin-top:1mm">SITIO WEB</div></div>
  <div style="text-align:center"><img src="img/qr-repo.svg" style="width:30mm;height:30mm;border-radius:2mm;background:#fff;padding:1mm"><div style="font-size:7pt;font-weight:700;letter-spacing:.12em;color:{c};margin-top:1mm">REPOSITORIO</div></div>
  <div style="font-size:8.5pt;color:{c};line-height:1.6"><b>Prototipo en línea</b><br>{URL}<br><b>Código fuente (GitHub)</b><br>{REPO}</div>
</div>'''


def jpg(src, name, q=84, maxw=None):
    im = Image.open(src).convert('RGB')
    if maxw and im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    p = os.path.join(IMG, name + '.jpg')
    im.save(p, quality=q, optimize=True)
    return 'img/' + name + '.jpg'


def strips(src, name, box_w, box_h, gap=4, maxw=None):
    """Divide una captura larga en n columnas para que quepa en box_w x box_h (mm) con la mayor escala."""
    im = Image.open(src).convert('RGB')
    if maxw and im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    best = (0, 1)
    for n in range(1, 8):
        sh = math.ceil(im.height / n)
        scale = min((box_w - gap * (n - 1)) / (n * im.width), box_h / sh)
        if scale > best[0]:
            best = (scale, n)
    scale, n = best
    sh = math.ceil(im.height / n)
    parts = []
    for i in range(n):
        c = im.crop((0, i * sh, im.width, min(im.height, (i + 1) * sh)))
        p = f'{name}-{i}.jpg'
        c.save(os.path.join(IMG, p), quality=82, optimize=True)
        parts.append((f'img/{p}', c.width * scale, c.height * scale))
    return ''.join(
        f'<img class="strip" src="{p}" style="width:{w:.1f}mm;height:{h:.1f}mm">' for p, w, h in parts
    )


esc = html.escape

# ---------------------------------------------------------------- contenido
PAGES = [
    ('inicio', 'Inicio', 'home', 'Presenta la marca en 5 segundos: titular emocional, dos CTA (comprar / reservar), prueba de origen (cifras) y una ilustración que sitúa al usuario en las montañas del Huila. Luego guía en scroll por beneficios → productos → proceso → suscripción → experiencias → testimonios.'),
    ('tienda', 'Tienda (catálogo)', 'tienda', 'Catálogo con filtros por tostión, proceso y precio, buscador por nombre o nota de sabor y orden. En tablet y móvil los filtros se pliegan en un botón para dar prioridad a los productos.'),
    ('producto', 'Detalle de producto', 'producto', 'Galería con el empaque y las notas de sabor flotando, precio visible, selector de molienda, cantidad y CTA de compra. Debajo: ficha técnica, perfil de taza y guía de preparación, y productos relacionados para venta cruzada.'),
    ('experiencias', 'Experiencias', 'experiencias', 'Las tres experiencias en zig-zag (imagen-texto) con duración, cupo, lugar, qué incluye y precio. Formulario de reserva con resumen y total en tiempo real; preguntas frecuentes en acordeón.'),
    ('nosotros', 'Nosotros', None, 'Storytelling de marca: historia de origen, cifras clave, línea de tiempo 2016–2026, las familias caficultoras y el propósito. Genera confianza y justifica el precio premium.'),
    ('contacto', 'Contacto', 'contacto', 'Formulario con validación, selector visual del motivo, mapa ilustrado y datos de contacto en tarjetas.'),
    ('carrito', 'Carrito', None, 'Resumen de compra con pasos (carrito → pago → confirmación), edición de cantidades, barra de envío gratis, cupón y medios de pago locales (PSE, Nequi).'),
]

css = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'DM Sans', sans-serif; color: #1d140f; font-size: 10.5pt; line-height: 1.55; }
.page { width: 210mm; height: 297mm; padding: 20mm 18mm 18mm; position: relative; overflow: hidden; page-break-after: always; background: #fffaf3; }
.page:last-child { page-break-after: auto; }
.page .foot { position: absolute; left: 18mm; right: 18mm; bottom: 9mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: #8b7d74; border-top: 1px solid #e6dccd; padding-top: 3mm; }
h1, h2, h3, h4 { font-family: 'Fraunces', serif; letter-spacing: -.01em; margin: 0 0 3mm; line-height: 1.12; color: #2a1810; }
h1 { font-size: 30pt; } h2 { font-size: 22pt; } h3 { font-size: 13pt; margin-top: 5mm; } h4 { font-size: 10.5pt; }
p { margin: 0 0 3mm; }
.eyebrow { font-size: 7.5pt; letter-spacing: .2em; text-transform: uppercase; font-weight: 700; color: #b8412c; margin-bottom: 2mm; display: block; }
.sec-n { font-family: 'Fraunces', serif; font-style: italic; color: #d9a441; font-size: 40pt; line-height: 1; display: block; margin-bottom: 2mm; }
.lead { font-size: 11.5pt; color: #5f5149; }
.muted { color: #6e6058; }
.small { font-size: 8.5pt; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; }
.card { background: #fff; border: 1px solid #e6dccd; border-radius: 4mm; padding: 5mm; }
.card.dark { background: #2a1810; color: #f6efe4; border: none; }
.card.dark h3, .card.dark h4 { color: #f6efe4; }
.tag { display: inline-block; padding: .6mm 2.4mm; border-radius: 99px; background: #ede2d1; font-size: 7.5pt; font-weight: 700; margin: 0 1mm 1mm 0; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; }
th { text-align: left; background: #2a1810; color: #f6efe4; padding: 2mm 3mm; font-weight: 700; }
td { padding: 2mm 3mm; border-bottom: 1px solid #e6dccd; vertical-align: top; }
tr:nth-child(even) td { background: #fbf6ee; }
ul.clean { padding-left: 4.5mm; margin: 0 0 3mm; } ul.clean li { margin-bottom: 1.2mm; }
.shots { display: flex; gap: 4mm; align-items: flex-start; justify-content: center; }
.strip { display: block; border-radius: 1.5mm; box-shadow: 0 .6mm 2.5mm rgba(42,24,16,.18); border: .3mm solid #ddd; object-fit: cover; }
.figure { margin: 0; }
.figure img { width: 100%; border-radius: 3mm; display: block; box-shadow: 0 .8mm 3mm rgba(42,24,16,.15); }
.caption { font-size: 8pt; color: #6e6058; margin-top: 2mm; text-align: center; }
.device { font-size: 8pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #b8412c; text-align: center; margin-bottom: 2mm; }
.swatch { border-radius: 3mm; height: 26mm; padding: 3mm; display: flex; flex-direction: column; justify-content: flex-end; font-size: 8pt; font-weight: 700; }
.toc li { display: flex; justify-content: space-between; border-bottom: 1px dotted #cbbfae; padding: 2.2mm 0; font-size: 11pt; }
.toc { list-style: none; padding: 0; margin: 0; }
.quote { font-family: 'Fraunces', serif; font-style: italic; font-size: 11pt; color: #3d2418; border-left: 1mm solid #b8412c; padding-left: 4mm; margin: 3mm 0; }
.persona-av { width: 16mm; height: 16mm; border-radius: 50%; display: grid; place-items: center; color: #fff; font-family: 'Fraunces', serif; font-weight: 700; font-size: 15pt; float: left; margin: 0 4mm 2mm 0; }
.kpi { font-family: 'Fraunces', serif; font-size: 20pt; color: #b8412c; line-height: 1; }
"""

# ---------------------------------------------------------------- utilidades de página
page_no = [0]


SECTION_PAGES = {}


def page(body, cls='', foot=True, style=''):
    page_no[0] += 1
    import re
    m = re.search(r'<span class="sec-n">(\d+)</span>', body)
    if m:
        SECTION_PAGES[str(int(m.group(1)))] = page_no[0]
    f = f'<div class="foot"><span>Cumbre · Café de Origen — Prototipo web</span><span>{AUTORA} · Interfaces y Diseño Web</span><span>{page_no[0]}</span></div>' if foot else ''
    return f'<section class="page {cls}" style="{style}">{body}{f}</section>'


P = []

# ---------------------------------------------------------------- PORTADA
cover_img = jpg(os.path.join(ST, 'fold-desktop.png'), 'portada', maxw=1440)
cover_m = jpg(os.path.join(ST, 'fold-mobile.png'), 'portada-m', maxw=780)
P.append(page(f"""
<div style="position:absolute;inset:0;background:#2a1810"></div>
<div style="position:absolute;inset:0;background:radial-gradient(circle at 85% 10%,rgba(217,164,65,.35),transparent 45%),radial-gradient(circle at 0% 100%,rgba(184,65,44,.45),transparent 50%)"></div>
<div style="position:relative;color:#f6efe4;height:100%;display:flex;flex-direction:column">
  <div style="display:flex;align-items:center;gap:4mm">
    <svg width="14mm" height="14mm" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#f6efe4"/><path d="M10 46 L26 22 L34 33 L40 26 L54 46 Z" fill="#b8412c"/><path d="M26 22 L30 28 L27 30 L23 27 Z" fill="#2a1810"/><circle cx="46" cy="16" r="5" fill="#d9a441"/></svg>
    <div><div style="font-family:Fraunces;font-size:20pt;font-weight:700;line-height:1">Cumbre</div><div style="font-size:7pt;letter-spacing:.3em;font-weight:700;opacity:.7">CAFÉ DE ORIGEN</div></div>
  </div>
  <div style="margin-top:14mm">
    <span class="eyebrow" style="color:#d9a441">ACA Final · Interfaces y Diseño Web</span>
    <h1 style="color:#f6efe4;font-size:36pt;margin-bottom:4mm">Prototipo visual del sitio web <em style="color:#d4583f;font-weight:500">Cumbre · Café de Origen</em></h1>
    <p style="font-size:12.5pt;opacity:.8;max-width:150mm">Análisis de audiencia, arquitectura de la información, wireframes adaptativos (escritorio, tableta y celular), referencias visuales, diseño visual y prototipo funcional desarrollado en Angular 22.</p>
  </div>
  <div style="position:relative;margin-top:8mm;height:88mm">
    <img src="{cover_img}" style="position:absolute;left:0;top:0;width:150mm;border-radius:3mm;box-shadow:0 4mm 10mm rgba(0,0,0,.4)">
    <img src="{cover_m}" style="position:absolute;right:4mm;top:14mm;width:42mm;border-radius:5mm;border:1.6mm solid #111;box-shadow:0 4mm 10mm rgba(0,0,0,.5)">
  </div>
  <div style="margin-top:auto;margin-bottom:5mm">{qr_block(True)}</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;font-size:9pt;border-top:1px solid rgba(246,239,228,.2);padding-top:5mm">
    <div><div style="opacity:.6;font-size:7.5pt;letter-spacing:.15em">ESTUDIANTE</div><b style="font-size:11pt">{AUTORA}</b></div>
    <div><div style="opacity:.6;font-size:7.5pt;letter-spacing:.15em">DOCENTE</div><b style="font-size:11pt">Carolina González</b></div>
    <div><div style="opacity:.6;font-size:7.5pt;letter-spacing:.15em">FECHA DE ENTREGA</div><b style="font-size:11pt">8 de noviembre de 2026</b></div>
  </div>
</div>""", foot=False, style='padding:22mm 20mm 20mm'))

# ---------------------------------------------------------------- ÍNDICE
toc = [
    ('1', 'Introducción del proyecto: cliente, problema y objetivos'),
    ('2', 'Análisis de la audiencia y personas'),
    ('3', 'Arquitectura de la información y mapa del sitio'),
    ('4', 'Wireframes adaptativos (PC · tableta · móvil)'),
    ('5', 'Referencias visuales y análisis de inspiración'),
    ('6', 'Diseño visual: guía de estilo'),
    ('7', 'Prototipo final en alta fidelidad'),
    ('8', 'Justificación del diseño'),
    ('9', 'Guion del video (máx. 2 minutos)'),
    ('10', 'Implementación técnica y publicación'),
    ('11', 'Conclusiones y referencias'),
]
P.append(page(f"""
<span class="eyebrow">Contenido</span><h2>Índice</h2>
<ol class="toc" style="margin-top:8mm">{''.join(f'<li><span><b style="color:#b8412c;margin-right:4mm">{n}</b>{t}</span><b>@@TOC{n}@@</b></li>' for n, t in toc)}</ol>
<div class="card" style="margin-top:8mm">{qr_block()}</div>
<div class="card" style="margin-top:5mm">
  <h4>Entregables incluidos</h4>
  <ul class="clean small">
    <li><b>Este documento PDF</b> (entrega principal) con todas las imágenes de wireframes y diseño.</li>
    <li><b>Prototipo funcional</b> en Angular 22, publicado en GitHub Pages: <b>{URL}</b></li>
    <li><b>Código fuente</b> en GitHub: <b>{REPO}</b> (despliegue automático con GitHub Actions).</li>
    <li><b>Video de apoyo</b> (<i>docs/video-recorrido.webm</i>) con el recorrido del prototipo y el <b>guion</b> para la narración (sección 9).</li>
  </ul>
</div>
"""))

# ---------------------------------------------------------------- 1 INTRODUCCIÓN
P.append(page("""
<span class="sec-n">01</span><span class="eyebrow">Introducción del proyecto</span>
<h2>El cliente: Cumbre · Café de Origen</h2>
<p class="lead">Cumbre es una tostadora de café de especialidad <b>ficticia</b> con sede en Neiva (Huila, Colombia). Compra el café de forma directa a 32 familias caficultoras del sur del Huila, lo tuesta en pequeños lotes y lo vende con nombre propio: finca, variedad, proceso y altura.</p>
<div class="grid3" style="margin:5mm 0">
  <div class="card"><div class="kpi">32</div><div class="small muted">familias aliadas en Pitalito, Acevedo, San Agustín y La Plata</div></div>
  <div class="card"><div class="kpi">8</div><div class="small muted">referencias de café: lavados, honey, naturales y descafeinado</div></div>
  <div class="card"><div class="kpi">3</div><div class="small muted">experiencias: cata guiada, tour de finca y taller de métodos</div></div>
</div>
<h3>Situación actual y problema</h3>
<p>Hoy Cumbre vende por Instagram y WhatsApp. Los pedidos se toman a mano, no hay un catálogo claro con precios, la información de origen (su principal diferencial) se pierde entre publicaciones y las reservas de catas se coordinan por chat, lo que genera demoras y cupos mal gestionados.</p>
<div class="quote">“Necesitamos un sitio donde la gente entienda en segundos por qué nuestro café es diferente, pueda comprarlo sin escribirnos y reserve una experiencia sola.” — Equipo Cumbre (brief del cliente)</div>
<h3>Objetivos del negocio</h3>
<table>
<tr><th style="width:8mm">#</th><th>Objetivo (SMART)</th><th style="width:48mm">Indicador (KPI)</th></tr>
<tr><td>1</td><td>Aumentar las ventas en línea un <b>35 %</b> en los primeros 12 meses.</td><td>Tasa de conversión ≥ 2,5 %; valor promedio de pedido.</td></tr>
<tr><td>2</td><td>Conseguir <b>500 suscriptores</b> del Club Cumbre en el primer año.</td><td>Suscripciones nuevas / mes.</td></tr>
<tr><td>3</td><td>Lograr <b>150 reservas</b> de experiencias por trimestre sin intervención manual.</td><td>Formularios de reserva enviados.</td></tr>
<tr><td>4</td><td>Posicionar la marca como referente de <b>café trazable</b> del Huila.</td><td>Tiempo en página “Nosotros”, suscriptores al boletín.</td></tr>
</table>
<h3>Objetivos del sitio web</h3>
<div class="grid2 small">
<ul class="clean"><li>Comunicar la propuesta de valor (origen, frescura, precio justo) en la primera pantalla.</li><li>Facilitar la compra en máximo 3 clics desde el inicio.</li><li>Permitir filtrar el café por gustos (tostión, proceso, notas).</li></ul>
<ul class="clean"><li>Automatizar la reserva de experiencias con un formulario claro.</li><li>Contar la historia de las familias para generar confianza.</li><li>Funcionar perfectamente en celular, donde llega el 70 % del tráfico de redes.</li></ul>
</div>
"""))

# ---------------------------------------------------------------- 2 AUDIENCIA
personas = [
    ('LR', '#b8412c', 'Laura Restrepo', '29 años · Diseñadora · Medellín', 'La exploradora de sabores',
     'Toma café de especialidad, sigue baristas en redes y le encanta probar procesos nuevos. Compra regalos con frecuencia.',
     ['Filtrar por notas de sabor y proceso', 'Ver la historia de la finca', 'Opciones para regalar'],
     ['Sitios sin información de origen', 'Fotos genéricas y precios ocultos'], 'Celular (Instagram → sitio)'),
    ('AP', '#2f4a3a', 'Andrés Pinzón', '41 años · Ingeniero · Bogotá', 'El práctico de todos los días',
     'Toma 3 tazas al día. No quiere pensar: quiere que el café llegue antes de que se acabe y pagar rápido.',
     ['Suscripción con descuento', 'Pago con PSE o Nequi', 'Envío rápido y seguimiento'],
     ['Procesos de pago largos', 'Quedarse sin café'], 'Computador en la oficina'),
    ('CT', '#d9a441', 'Camila y Tomás', '26 y 31 años · Pareja viajera · Cali', 'Los turistas cafeteros',
     'Planean un viaje al sur del Huila (San Agustín) y buscan experiencias auténticas para incluir en su itinerario.',
     ['Ver duración, precio y qué incluye', 'Reservar en pocos pasos', 'Resolver dudas (lluvia, cancelación)'],
     ['Tener que escribir por chat y esperar', 'No saber el precio total'], 'Celular y tableta'),
]
pcards = ''.join(f"""
<div class="card" style="margin-bottom:4mm">
  <div class="persona-av" style="background:{c}">{i}</div>
  <h3 style="margin:0">{n}</h3><div class="small muted">{d}</div>
  <span class="tag" style="margin-top:1.5mm;background:{c};color:#fff">{arq}</span>
  <p class="small" style="clear:both;margin-top:2mm">{bio}</p>
  <div class="grid3 small">
    <div><h4>Necesita</h4><ul class="clean">{''.join(f'<li>{x}</li>' for x in nec)}</ul></div>
    <div><h4>Le frustra</h4><ul class="clean">{''.join(f'<li>{x}</li>' for x in fru)}</ul></div>
    <div><h4>Dispositivo</h4><p>{dev}</p></div>
  </div>
</div>""" for i, c, n, d, arq, bio, nec, fru, dev in personas)
P.append(page(f"""
<span class="sec-n">02</span><span class="eyebrow">Análisis de audiencia</span>
<h2>¿Para quién diseñamos?</h2>
<p>El público principal son <b>adultos de 24 a 45 años</b> de ciudades colombianas (Bogotá, Medellín, Cali, Neiva), de nivel socioeconómico medio y medio-alto, que valoran la calidad y el origen de lo que consumen. Se definieron tres segmentos y una persona para cada uno:</p>
{pcards}
<p class="small muted">Segmento secundario: <b>cafeterías y tiendas (mayoristas)</b>, atendido desde la página de Contacto.</p>
"""))

P.append(page("""
<span class="eyebrow">Análisis de audiencia</span>
<h2>Necesidades → decisiones de diseño</h2>
<table>
<tr><th>Hallazgo sobre la audiencia</th><th>Decisión en el sitio</th></tr>
<tr><td>El 70 % llega desde Instagram en el celular.</td><td>Diseño <b>mobile-first</b>, menú hamburguesa a pantalla completa, botones de 46 px de alto, carrusel deslizable de productos.</td></tr>
<tr><td>Los compradores de café de especialidad eligen por sabor.</td><td>Notas de sabor visibles en cada tarjeta; buscador que entiende notas (“chocolate”); filtros por tostión y proceso.</td></tr>
<tr><td>El diferencial (origen) se pierde en redes.</td><td>Finca, municipio y proceso en cada tarjeta; ficha técnica completa; página “Nosotros” con las familias.</td></tr>
<tr><td>Usuarios como Andrés no quieren repetir la compra.</td><td>Bloque <b>Club Cumbre</b> en el inicio con selector de frecuencia y precio mensual visible.</td></tr>
<tr><td>Los turistas necesitan certeza antes de reservar.</td><td>Duración, cupo, lugar, qué incluye y precio por persona; total calculado en vivo; FAQ de lluvia y cancelación.</td></tr>
<tr><td>Desconfianza en compras en línea a marcas pequeñas.</td><td>Testimonios con calificación, medios de pago locales (PSE, Nequi, contraentrega) y datos físicos de la tostadería.</td></tr>
</table>
<h3>Recorridos principales (user flows)</h3>
<div class="grid2">
<div class="card"><h4>Flujo de compra</h4>
<svg viewBox="0 0 300 150" width="100%"><g font-family="DM Sans" font-size="9" font-weight="700" text-anchor="middle">
<rect x="0" y="10" width="80" height="30" rx="8" fill="#2a1810"/><text x="40" y="29" fill="#fff">Inicio</text>
<rect x="110" y="10" width="80" height="30" rx="8" fill="#b8412c"/><text x="150" y="29" fill="#fff">Tienda + filtros</text>
<rect x="220" y="10" width="80" height="30" rx="8" fill="#b8412c"/><text x="260" y="29" fill="#fff">Producto</text>
<rect x="220" y="100" width="80" height="30" rx="8" fill="#d9a441"/><text x="260" y="119" fill="#2a1810">Carrito lateral</text>
<rect x="110" y="100" width="80" height="30" rx="8" fill="#d9a441"/><text x="150" y="119" fill="#2a1810">Carrito</text>
<rect x="0" y="100" width="80" height="30" rx="8" fill="#2f4a3a"/><text x="40" y="119" fill="#fff">Confirmación</text>
</g><g stroke="#6e6058" stroke-width="1.5" fill="none" marker-end="url(#a)"><path d="M80 25H108"/><path d="M190 25H218"/><path d="M260 40V98"/><path d="M220 115H192"/><path d="M110 115H82"/><path d="M40 40V98" stroke-dasharray="3 3"/></g>
<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6e6058"/></marker></defs>
<text x="46" y="72" font-size="8" fill="#6e6058" font-family="DM Sans">“Agregar” directo desde Inicio</text></svg>
<p class="small muted">De Inicio a pago en 3 clics: Inicio → Agregar → Ver carrito → Finalizar.</p></div>
<div class="card"><h4>Flujo de reserva</h4>
<svg viewBox="0 0 300 150" width="100%"><g font-family="DM Sans" font-size="9" font-weight="700" text-anchor="middle">
<rect x="0" y="10" width="80" height="30" rx="8" fill="#2a1810"/><text x="40" y="29" fill="#fff">CTA “Reserva”</text>
<rect x="110" y="10" width="80" height="30" rx="8" fill="#b8412c"/><text x="150" y="29" fill="#fff">Experiencias</text>
<rect x="220" y="10" width="80" height="30" rx="8" fill="#b8412c"/><text x="260" y="29" fill="#fff">Elegir experiencia</text>
<rect x="220" y="100" width="80" height="30" rx="8" fill="#d9a441"/><text x="260" y="119" fill="#2a1810">Formulario</text>
<rect x="110" y="100" width="80" height="30" rx="8" fill="#d9a441"/><text x="150" y="119" fill="#2a1810">Total en vivo</text>
<rect x="0" y="100" width="80" height="30" rx="8" fill="#2f4a3a"/><text x="40" y="119" fill="#fff">Pre-reserva OK</text>
</g><g stroke="#6e6058" stroke-width="1.5" fill="none" marker-end="url(#b)"><path d="M80 25H108"/><path d="M190 25H218"/><path d="M260 40V98"/><path d="M220 115H192"/><path d="M110 115H82"/></g>
<defs><marker id="b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6e6058"/></marker></defs></svg>
<p class="small muted">El CTA del encabezado lleva directo al formulario (ancla #reserva) desde cualquier página.</p></div>
</div>
"""))

# ---------------------------------------------------------------- 3 ARQUITECTURA
def node(x, y, w, t, fill='#fff', tc='#2a1810', stroke='#2a1810', sub=''):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="34" rx="9" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/><text x="{x + w / 2}" y="{y + (16 if sub else 21)}" fill="{tc}" text-anchor="middle" font-weight="700" font-size="10.5">{t}</text>'
    if sub:
        s += f'<text x="{x + w / 2}" y="{y + 28}" fill="{tc}" text-anchor="middle" font-size="7.5" opacity=".75">{sub}</text>'
    return s


cols = [
    ('Tienda', '/tienda', ['Filtros y buscador', 'Detalle de producto', '  ↳ /tienda/:slug (8)', 'Productos relacionados']),
    ('Experiencias', '/experiencias', ['Cata guiada #cata', 'Tour de finca #finca', 'Taller #taller', 'Reserva #reserva', 'Preguntas frecuentes']),
    ('Nosotros', '/nosotros', ['Historia', 'Cifras', 'Línea de tiempo', 'Las fincas #fincas', 'Propósito']),
    ('Contacto', '/contacto', ['Formulario', 'Mapa', 'Datos de contacto']),
    ('Carrito', '/carrito', ['Resumen y cantidades', 'Envío y cupón', 'Confirmación']),
]
svg = ['<svg viewBox="0 0 640 470" width="100%" font-family="DM Sans">']
svg.append(node(250, 10, 140, 'Inicio', '#2a1810', '#fff', sub='/ (home)'))
svg.append('<path d="M320 44 V70 M60 70 H580" stroke="#2a1810" stroke-width="1.5" fill="none"/>')
for i, (t, r, kids) in enumerate(cols):
    x = 10 + i * 128
    svg.append(f'<path d="M{x + 50} 70 V88" stroke="#2a1810" stroke-width="1.5"/>')
    svg.append(node(x, 88, 100, t, '#b8412c', '#fff', '#b8412c', r))
    for j, k in enumerate(kids):
        y = 140 + j * 34
        svg.append(f'<path d="M{x + 10} {y - 12} V{y + 11} H{x + 18}" stroke="#c9b9a6" stroke-width="1.2" fill="none"/>')
        svg.append(f'<rect x="{x + 18}" y="{y}" width="92" height="24" rx="6" fill="#fff" stroke="#d8cbb8"/><text x="{x + 64}" y="{y + 15.5}" text-anchor="middle" font-size="8.2" fill="#3d2418">{k.strip()}</text>')
# utilitarios
svg.append('<rect x="10" y="345" width="620" height="110" rx="12" fill="#f6efe4" stroke="#d9a441" stroke-dasharray="5 4"/>')
svg.append('<text x="26" y="368" font-size="10" font-weight="700" fill="#b8412c" letter-spacing="1.5">ELEMENTOS GLOBALES (EN TODAS LAS PÁGINAS)</text>')
glob = ['Barra de anuncio', 'Menú principal', 'CTA “Reserva una cata”', 'Carrito lateral', 'Notificaciones', 'Boletín', 'Pie de página', 'Página 404']
for i, g in enumerate(glob):
    x = 26 + (i % 4) * 151; y = 380 + (i // 4) * 34
    svg.append(f'<rect x="{x}" y="{y}" width="140" height="26" rx="13" fill="#fff" stroke="#d9a441"/><text x="{x + 70}" y="{y + 17}" text-anchor="middle" font-size="9" font-weight="600" fill="#2a1810">{g}</text>')
svg.append('</svg>')
P.append(page(f"""
<span class="sec-n">03</span><span class="eyebrow">Arquitectura de la información</span>
<h2>Mapa del sitio (sitemap)</h2>
<p>La estructura es <b>plana y de máximo dos niveles</b>: cualquier contenido está a uno o dos clics del inicio. Las cinco secciones del menú responden a las tres tareas clave de la audiencia: <b>comprar</b>, <b>vivir una experiencia</b> y <b>conocer la marca</b>.</p>
<div class="card" style="padding:4mm">{''.join(svg)}</div>
<h3>Sistemas de navegación</h3>
<div class="grid3 small">
<div class="card"><h4>Principal</h4>Menú horizontal fijo (sticky) en escritorio con indicador de página activa. En tableta y móvil se convierte en menú de pantalla completa numerado.</div>
<div class="card"><h4>Utilitaria</h4>Ícono de carrito con contador, CTA permanente “Reserva una cata”, migas de pan en producto y carrito, enlace “saltar al contenido”.</div>
<div class="card"><h4>Contextual y pie</h4>Enlaces “Ver toda la tienda”, productos relacionados, anclas a cada experiencia. Pie con 4 columnas de enlaces, datos y redes.</div>
</div>
"""))

P.append(page("""
<span class="eyebrow">Arquitectura de la información</span>
<h2>Inventario de contenidos y jerarquía</h2>
<table>
<tr><th style="width:30mm">Página</th><th>Contenido (en orden de prioridad)</th><th style="width:38mm">Acción principal</th></tr>
<tr><td><b>Inicio</b></td><td>Hero con propuesta de valor y cifras · Marquesina de notas · 3 beneficios · 4 cafés destacados · Proceso en 4 pasos · Club Cumbre · 3 experiencias · Testimonios · Boletín</td><td>Comprar café / Reservar</td></tr>
<tr><td><b>Tienda</b></td><td>Encabezado · Filtros (tostión, proceso, precio) · Buscador y orden · Grilla de 8 productos · Estado vacío</td><td>Agregar al carrito</td></tr>
<tr><td><b>Producto</b></td><td>Migas de pan · Galería con notas · Nombre, origen, calificación, precio · Descripción · Molienda · Cantidad + CTA · Garantías · Ficha técnica · Perfil de taza · Preparación · Relacionados</td><td>Agregar al carrito</td></tr>
<tr><td><b>Experiencias</b></td><td>Encabezado con cifras · 3 experiencias (detalle, incluye, precio) · Formulario de reserva con resumen · FAQ</td><td>Solicitar reserva</td></tr>
<tr><td><b>Nosotros</b></td><td>Historia · 4 cifras · Línea de tiempo · Familias caficultoras · Propósito</td><td>Prueba nuestro café</td></tr>
<tr><td><b>Contacto</b></td><td>Encabezado · Formulario (nombre, correo, motivo, mensaje, consentimiento) · Mapa · Datos</td><td>Enviar mensaje</td></tr>
<tr><td><b>Carrito</b></td><td>Pasos de compra · Líneas de producto editables · Resumen, envío, cupón · Medios de pago · Confirmación</td><td>Finalizar compra</td></tr>
</table>
<h3>Criterios de organización</h3>
<ul class="clean">
<li><b>Por tarea</b> (comprar, reservar, conocer, contactar): los nombres del menú son verbos/objetos que el usuario reconoce, sin jerga interna.</li>
<li><b>Por atributos del producto</b> en la tienda: tostión, proceso y precio, que son los criterios reales de elección del café de especialidad.</li>
<li><b>Patrón de lectura en Z</b> en el hero (logo → menú → titular → CTA) y en <b>F</b> en las páginas de contenido.</li>
<li><b>Divulgación progresiva</b>: la tarjeta muestra lo esencial; el detalle técnico vive en la página de producto; las dudas en acordeones.</li>
</ul>
<h3>Puntos de quiebre (breakpoints) y retícula</h3>
<table>
<tr><th>Dispositivo</th><th>Ancho de referencia</th><th>Retícula</th><th>Comportamiento</th></tr>
<tr><td>Escritorio</td><td>1440 px (contenedor 1200 px)</td><td>12 col. · 4 productos por fila</td><td>Menú completo, filtros laterales, layouts a 2 columnas.</td></tr>
<tr><td>Tableta</td><td>834 px (≤ 960 px)</td><td>2 columnas</td><td>Menú hamburguesa, filtros plegables, hero apilado.</td></tr>
<tr><td>Celular</td><td>390 px (≤ 600 px)</td><td>1 columna · márgenes de 24 px</td><td>Carrusel deslizable, botones a todo el ancho, tipografía fluida con clamp().</td></tr>
</table>
"""))

# ---------------------------------------------------------------- 4 WIREFRAMES
P.append(page("""
<span class="sec-n">04</span><span class="eyebrow">Wireframes adaptativos</span>
<h2>De la estructura a la pantalla</h2>
<p class="lead">Los wireframes de baja fidelidad definen la ubicación de cada bloque antes de aplicar color o imágenes. Se diseñaron para las cinco páginas clave en los tres dispositivos solicitados.</p>
<div class="grid2" style="margin:6mm 0">
<div class="card"><h4>Convenciones</h4><ul class="clean small">
<li>Rectángulo con <b>X</b> = imagen o ilustración.</li>
<li>Barras grises oscuras = titulares; claras = texto.</li>
<li>Botón relleno = <b>CTA primario</b>; con borde = secundario.</li>
<li>Nota amarilla numerada = bloque de contenido y su función.</li>
</ul></div>
<div class="card"><h4>Herramienta</h4><p class="small">Los wireframes se construyeron como un prototipo HTML/CSS en escala de grises (<i>docs/fuentes/wireframes.html</i>) con las mismas reglas responsivas del sitio final, y se exportaron como imágenes a 1440, 834 y 390 px de ancho.</p></div>
</div>
<h3>Decisiones de adaptación</h3>
<table>
<tr><th>Bloque</th><th>PC</th><th>Tableta</th><th>Móvil</th></tr>
<tr><td>Menú</td><td>Horizontal + CTA</td><td>Hamburguesa</td><td>Hamburguesa a pantalla completa</td></tr>
<tr><td>Hero</td><td>Texto | Imagen</td><td>Apilado</td><td>Apilado, CTA a todo el ancho</td></tr>
<tr><td>Productos</td><td>4 columnas</td><td>2 columnas</td><td>Carrusel horizontal (inicio) / 2 col. (tienda)</td></tr>
<tr><td>Filtros</td><td>Barra lateral fija</td><td>Botón “Filtros” desplegable</td><td>Botón “Filtros” desplegable</td></tr>
<tr><td>Experiencias</td><td>Zig-zag 2 col.</td><td>Apilado</td><td>Apilado</td></tr>
<tr><td>Formularios</td><td>Campos en 2 col.</td><td>2 col.</td><td>1 columna</td></tr>
<tr><td>Pie de página</td><td>4 columnas</td><td>2 columnas</td><td>1 columna</td></tr>
</table>
"""))

wf_names = {'home': 'Inicio', 'tienda': 'Tienda', 'producto': 'Detalle de producto', 'experiencias': 'Experiencias', 'contacto': 'Contacto'}
for key, title in wf_names.items():
    # una página por wireframe: escritorio | tableta | móvil
    d = strips(os.path.join(WF, f'wf-desktop-{key}.png'), f'wf-d-{key}', 88, 222, maxw=1440)
    t = strips(os.path.join(WF, f'wf-tablet-{key}.png'), f'wf-t-{key}', 50, 222)
    m = strips(os.path.join(WF, f'wf-mobile-{key}.png'), f'wf-m-{key}', 26, 222, maxw=390)
    P.append(page(f"""
<span class="eyebrow">Wireframes adaptativos</span><h2 style="font-size:18pt">{title}</h2>
<div class="shots" style="margin-top:3mm">
  <div><div class="device">PC · 1440 px</div><div class="shots">{d}</div></div>
  <div><div class="device">Tableta · 834 px</div><div class="shots">{t}</div></div>
  <div><div class="device">Móvil · 390 px</div><div class="shots">{m}</div></div>
</div>"""))

# ---------------------------------------------------------------- 5 REFERENCIAS
refs = [
    ('Blue Bottle Coffee', 'bluebottlecoffee.com', 'Mucho espacio en blanco, fotografía de producto limpia y un tono sereno y premium.', 'Jerarquía clara y aire generoso entre secciones; tarjetas de producto simples.', 'Su paleta casi monocromática: para Cumbre buscamos calidez y color de origen.'),
    ('Onyx Coffee Lab', 'onyxcoffeelab.com', 'Fichas técnicas muy completas: variedad, proceso, altura y perfil de taza.', 'Ficha técnica y perfil de taza con barras para comparar cafés.', 'Exceso de datos en la tarjeta del catálogo (los dejamos para el detalle).'),
    ('Pergamino Café', 'pergamino.co', 'Marca colombiana que cuenta el origen y a los productores con orgullo.', 'Storytelling de familias y fincas; tono cercano y en español.', 'Navegación con muchos niveles; la nuestra es plana.'),
    ('Café Devoción', 'cafedevocion.com', 'Café colombiano “fresco de la finca”, uso de cifras y del tiempo desde la cosecha.', 'Cifras grandes como prueba (familias, altura, puntaje).', 'Imágenes muy pesadas; usamos ilustración vectorial ligera.'),
    ('Airbnb Experiencias', 'airbnb.com/experiences', 'Fichas de experiencia con duración, cupo, qué incluye y precio por persona.', 'Estructura de la ficha de experiencia y el resumen con total.', 'Proceso de reserva de varios pasos: lo reducimos a un formulario.'),
]
P.append(page(f"""
<span class="sec-n">05</span><span class="eyebrow">Referencias visuales</span>
<h2>Análisis de inspiración</h2>
<p>Se analizaron cinco sitios de referencia del sector del café de especialidad y del turismo de experiencias. De cada uno se tomó una idea concreta y se evitó otra. <span class="muted small">(Se citan como referencia de estudio; no se reproduce su contenido.)</span></p>
<table>
<tr><th style="width:32mm">Referente</th><th>Qué observamos</th><th>Qué tomamos</th><th>Qué evitamos</th></tr>
{''.join(f'<tr><td><b>{n}</b><br><span class="small muted">{u}</span></td><td>{o}</td><td>{t}</td><td>{e}</td></tr>' for n, u, o, t, e in refs)}
</table>
<h3>Tendencias aplicadas</h3>
<div class="grid3 small">
<div class="card"><h4>Serif expresiva</h4>Titulares con tipografía serif de alto contraste (Fraunces) con itálicas “suaves” que transmiten artesanía.</div>
<div class="card"><h4>Ilustración plana</h4>Ilustraciones vectoriales propias con textura de grano en lugar de fotos de banco: identidad única y carga rápida.</div>
<div class="card"><h4>Microinteracciones</h4>Tarjetas que se elevan, empaque que gira, sello rotatorio, carrito lateral y notificaciones de confirmación.</div>
</div>
"""))

# moodboard
_f = Image.open(os.path.join(ST, 'fold-desktop.png')).convert('RGB').crop((790, 175, 1290, 800))
_f.save(os.path.join(IMG, 'mood-hero.jpg'), quality=86)
hero_art = 'img/mood-hero.jpg'
im = Image.open(os.path.join(SHOTS, 'desktop-experiencias.png'))
P.append(page(f"""
<span class="eyebrow">Referencias visuales</span>
<h2>Moodboard: “la montaña al amanecer”</h2>
<p>El concepto visual nace del paisaje del sur del Huila al amanecer: cielo miel, montañas verdes y la cereza roja del café madura. El resultado es <b>cálido, artesanal y confiable</b>.</p>
<div style="display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:42mm 42mm 42mm;gap:3mm;margin:5mm 0">
  <div style="grid-row:span 2;border-radius:4mm;overflow:hidden;background:url({hero_art}) center/cover"></div>
  <div class="swatch" style="background:#2a1810;color:#f6efe4">Espresso<br>#2A1810</div>
  <div class="swatch" style="background:#b8412c;color:#fff">Cereza<br>#B8412C</div>
  <div class="swatch" style="background:#d9a441;color:#2a1810">Miel<br>#D9A441</div>
  <div class="swatch" style="background:#2f4a3a;color:#f6efe4">Montaña<br>#2F4A3A</div>
  <div style="border-radius:4mm;background:#f6efe4;border:1px solid #e6dccd;display:flex;flex-direction:column;justify-content:center;padding:4mm"><div style="font-family:Fraunces;font-size:30pt;line-height:1">Aa</div><div class="small">Fraunces<br>Titulares</div></div>
  <div style="border-radius:4mm;background:#fffaf3;border:1px solid #e6dccd;display:flex;flex-direction:column;justify-content:center;padding:4mm"><div style="font-family:'DM Sans';font-size:30pt;line-height:1;font-weight:700">Aa</div><div class="small">DM Sans<br>Textos e interfaz</div></div>
  <div style="grid-column:span 2;border-radius:4mm;background:#ede2d1;padding:5mm;display:flex;align-items:center;gap:4mm;flex-wrap:wrap">
    {''.join(f'<span class="tag" style="background:#fff;font-size:9pt">{w}</span>' for w in ['Origen', 'Calidez', 'Artesanal', 'Cercano', 'Premium sin pretensión', 'Naturaleza', 'Trazabilidad', 'Orgullo opita'])}
  </div>
</div>
<div class="grid2 small">
<div class="card"><h4>Personalidad de marca</h4><p>Cercana como una visita a la finca, experta sin ser intimidante. Habla de “tú”, con frases cortas y palabras del campo (cosecha, beneficio, tostión, opita).</p></div>
<div class="card"><h4>Fotografía e ilustración</h4><p>Ilustraciones vectoriales originales: paisaje del hero, escenas de cata/finca/taller, ramas con cerezas y un empaque parametrizable que cambia de color según el café.</p></div>
</div>
"""))

# ---------------------------------------------------------------- 6 DISEÑO VISUAL
pal = [('#2A1810', 'Espresso', 'Texto principal, fondos oscuros, botón secundario', '#f6efe4'),
       ('#B8412C', 'Cereza', 'CTA primario, enlaces, acentos', '#fff'),
       ('#D9A441', 'Miel', 'Destacados, insignias, íconos sobre oscuro', '#2a1810'),
       ('#2F4A3A', 'Montaña', 'Bloque de suscripción, éxito', '#f6efe4'),
       ('#F6EFE4', 'Crema', 'Fondo general', '#2a1810'),
       ('#FFFAF3', 'Papel', 'Tarjetas y formularios', '#2a1810')]
P.append(page(f"""
<span class="sec-n">06</span><span class="eyebrow">Diseño visual</span>
<h2>Guía de estilo</h2>
<h3>Paleta de color</h3>
<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:3mm">
{''.join(f'<div><div class="swatch" style="background:{h};color:{tc};height:22mm;border:1px solid #e6dccd">{h}</div><b class="small">{n}</b><div style="font-size:7.5pt" class="muted">{u}</div></div>' for h, n, u, tc in pal)}
</div>
<p class="small muted" style="margin-top:3mm">Contraste verificado (WCAG 2.1): Espresso sobre Crema 14,9:1 (AAA) · Papel sobre Cereza 5,3:1 (AA) · Espresso sobre Miel 7,6:1 (AAA) · Gris de texto sobre Crema 5,3:1 (AA) · Crema sobre Montaña 8,5:1 (AAA). Regla 60-30-10: 60 % cremas, 30 % espresso, 10 % cereza/miel.</p>
<h3>Tipografía</h3>
<div class="grid2">
<div class="card"><div style="font-family:Fraunces;font-size:22pt;font-weight:600;line-height:1.05">Del corazón de la montaña <i style="color:#b8412c;font-weight:500">a tu taza.</i></div>
<p class="small muted" style="margin-top:3mm"><b>Fraunces</b> (Google Fonts) · serif variable · títulos H1–H4, precios y cifras. Peso 600, itálica 500 para énfasis.</p></div>
<div class="card"><div style="font-family:'DM Sans';font-size:12pt">Tostamos en pequeños lotes el café que cultivan 32 familias del sur del Huila.</div>
<p class="small muted" style="margin-top:3mm"><b>DM Sans</b> · sans-serif geométrica muy legible en pantalla · textos, botones, formularios. Pesos 400, 600 y 700.</p></div>
</div>
<table style="margin-top:4mm">
<tr><th>Estilo</th><th>Fuente</th><th>Tamaño (fluido)</th><th>Uso</th></tr>
<tr><td>H1</td><td>Fraunces 600</td><td>40 → 76 px</td><td>Titular de cada página</td></tr>
<tr><td>H2</td><td>Fraunces 600</td><td>32 → 48 px</td><td>Título de sección</td></tr>
<tr><td>H3</td><td>Fraunces 600</td><td>20 → 24 px</td><td>Tarjetas</td></tr>
<tr><td>Eyebrow</td><td>DM Sans 700 · mayúsculas · tracking 0,18em</td><td>12,5 px</td><td>Antetítulo de sección (color Cereza)</td></tr>
<tr><td>Cuerpo / Lead</td><td>DM Sans 400</td><td>16 px / 17 → 20 px</td><td>Párrafos e introducciones</td></tr>
</table>
<p class="small" style="margin-top:3mm"><b>Espaciado, forma y elevación:</b> Escala de espacios basada en 4/8 px; secciones de 64 → 120 px de alto padding. Bordes redondeados de 10, 18 y 28 px y botones tipo píldora. Tres niveles de sombra cálida (tono espresso) para tarjetas, elementos flotantes y paneles.</p>
"""))

comp_drawer = jpg(os.path.join(ST, 'st-desktop-drawer.png'), 'comp-drawer', maxw=1440)
_v = Image.open(os.path.join(ST, 'st-desktop-validacion.png')).convert('RGB')
_v.crop((0, 0, _v.width, int(_v.height * 0.62))).save(os.path.join(IMG, 'comp-val.jpg'), quality=86)
comp_val = 'img/comp-val.jpg'
P.append(page(f"""
<span class="eyebrow">Diseño visual</span><h2>Componentes de interfaz</h2>
<div class="grid2">
<div class="card"><h4>Botones</h4>
<div style="display:flex;gap:3mm;flex-wrap:wrap;align-items:center;margin:2mm 0">
<span style="background:#b8412c;color:#fff;border-radius:99px;padding:3mm 6mm;font-weight:700;font-size:9pt">Comprar café →</span>
<span style="border:2px solid #2a1810;border-radius:99px;padding:2.5mm 6mm;font-weight:700;font-size:9pt">Reserva una cata</span>
<span style="background:#2a1810;color:#fff;border-radius:99px;padding:2mm 4mm;font-weight:700;font-size:8pt">+ Agregar</span></div>
<p class="small muted">Primario (Cereza) para la acción principal de cada vista; secundario con borde; oscuro pequeño para acciones repetidas en tarjetas. Al pasar el cursor se elevan 2 px con sombra del mismo color.</p></div>
<div class="card"><h4>Iconografía</h4>
<p class="small muted">Set propio de 30 íconos lineales (trazo 1,8 px, esquinas redondeadas, 24×24) coherente con la tipografía: carrito, montaña, llama, mano, taza, reloj, ubicación, redes, etc.</p>
<h4>Insignias y chips</h4><span class="tag" style="background:#d9a441">MÁS VENDIDO</span> <span class="tag">Panela</span> <span class="tag">Chocolate</span> <span class="tag">Naranja</span></div>
</div>
<h3>Carrito lateral, notificación y estados</h3>
<div class="figure"><img src="{comp_drawer}" style="width:72%;margin:0 auto"><div class="caption">Al agregar un producto aparece una notificación y el contador del carrito se actualiza; el carrito lateral muestra la barra de progreso hacia el envío gratis.</div></div>
<div class="grid2" style="margin-top:4mm;align-items:start">
<div class="figure"><img src="{comp_val}"><div class="caption">Validación de formularios en línea con mensajes claros en rojo Cereza.</div></div>
<div class="card small"><h4>Accesibilidad (WCAG 2.1 AA)</h4><ul class="clean">
<li>Contraste ≥ 4,5:1 en todo el texto.</li><li>Foco visible color Miel.</li><li>“Saltar al contenido” y HTML semántico.</li><li>Etiquetas en campos y <i>aria-live</i>.</li><li>Teclado: Esc cierra menú y carrito.</li><li>Respeta “reducir movimiento”.</li><li>Áreas táctiles ≥ 44 px.</li></ul></div>
</div>
"""))

# ---------------------------------------------------------------- 7 PROTOTIPO FINAL
P.append(page(f"""
<span class="sec-n">07</span><span class="eyebrow">Prototipo final</span>
<h2>Alta fidelidad en los tres dispositivos</h2>
<p class="lead">El diseño final se construyó directamente como un prototipo navegable en Angular. Las siguientes páginas muestran cada pantalla completa en PC (1440 px), tableta (834 px) y celular (390 px), divididas en columnas para leerlas de arriba hacia abajo.</p>
<div style="position:relative;height:136mm;margin-top:6mm">
<img src="{jpg(os.path.join(ST, 'fold-desktop.png'), 'fold-d', maxw=1440)}" style="position:absolute;left:0;top:0;width:150mm;border-radius:3mm;box-shadow:0 2mm 6mm rgba(0,0,0,.2)">
<img src="{jpg(os.path.join(ST, 'fold-tablet.png'), 'fold-t')}" style="position:absolute;left:96mm;top:40mm;width:62mm;border-radius:4mm;border:1.4mm solid #222;box-shadow:0 3mm 8mm rgba(0,0,0,.3)">
<img src="{jpg(os.path.join(ST, 'fold-mobile.png'), 'fold-m', maxw=780)}" style="position:absolute;right:0;top:62mm;width:38mm;border-radius:5mm;border:1.4mm solid #111;box-shadow:0 3mm 8mm rgba(0,0,0,.35)">
</div>
<div class="card" style="margin-top:6mm">{qr_block()}</div>
"""))

for key, title, _, desc in PAGES:
    d = strips(os.path.join(SHOTS, f'desktop-{key}.png'), f'p-d-{key}', 174, 228, maxw=1440)
    P.append(page(f'<span class="eyebrow">Prototipo final · PC 1440 px</span><h2 style="font-size:17pt">{title}</h2><p class="small">{desc}</p><div class="shots">{d}</div>'))
    t = strips(os.path.join(SHOTS, f'tablet-{key}.png'), f'p-t-{key}', 84, 232)
    m = strips(os.path.join(SHOTS, f'mobile-{key}.png'), f'p-m-{key}', 86, 232, maxw=585)
    P.append(page(f"""<span class="eyebrow">Prototipo final · Tableta y móvil</span><h2 style="font-size:17pt">{title}</h2>
<div class="shots" style="margin-top:3mm;justify-content:space-between">
<div><div class="device">Tableta · 834 px</div><div class="shots">{t}</div></div>
<div><div class="device">Móvil · 390 px</div><div class="shots">{m}</div></div></div>"""))

# estados móviles
mm = [jpg(os.path.join(ST, f'st-mobile-{n}.png'), f'st-m-{n}', maxw=780) for n in ['hero', 'menu', 'toast', 'drawer']]
P.append(page(f"""
<span class="eyebrow">Prototipo final</span><h2>Interacciones en el celular</h2>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:5mm">
{''.join(f'<div class="figure"><img src="{s}" style="border-radius:4mm;border:1mm solid #111"><div class="caption">{c}</div></div>' for s, c in zip(mm, ['Primera pantalla: titular, CTA a todo el ancho y cifras.', 'Menú a pantalla completa, numerado, con CTA y redes.', 'Notificación de confirmación al agregar y contador del carrito.', 'Carrito lateral con cantidades y barra de envío gratis.']))}
</div>
<div class="grid2" style="margin-top:6mm;align-items:start">
<div class="figure"><img src="{jpg(os.path.join(ST, 'st-desktop-filtros.png'), 'st-filtros', maxw=1440)}"><div class="caption">Filtro “Clara” + búsqueda “jazm”: los resultados se actualizan al instante.</div></div>
<div class="figure"><img src="{jpg(os.path.join(ST, 'st-desktop-reserva.png'), 'st-reserva', maxw=1440)}"><div class="caption">Reserva: al elegir “Un día en la finca” para 4 personas el total se recalcula.</div></div>
</div>
"""))

# ---------------------------------------------------------------- 8 JUSTIFICACIÓN
P.append(page("""
<span class="sec-n">08</span><span class="eyebrow">Justificación del diseño</span>
<h2>Por qué se ve y funciona así</h2>
<div class="grid2">
<div><h3 style="margin-top:0">Jerarquía visual</h3><ul class="clean small">
<li>Un solo <b>H1</b> por página, de gran tamaño en serif, que es lo primero que se lee.</li>
<li><b>Antetítulos</b> (eyebrow) en rojo Cereza que anuncian de qué trata cada sección antes del título.</li>
<li>Contraste de <b>tamaño, peso y color</b>: precios en serif grande, metadatos en gris pequeño.</li>
<li>Alternancia de fondos (crema, papel, espresso, verde) para separar secciones sin líneas.</li>
<li>Ley de proximidad: la información relacionada (origen + nombre + notas + precio) vive agrupada en tarjetas.</li></ul></div>
<div><h3 style="margin-top:0">Navegación</h3><ul class="clean small">
<li>Menú corto de <b>5 opciones</b> (ley de Miller / Hick) con indicador de página activa.</li>
<li>Encabezado <b>fijo</b> con efecto de vidrio: el menú y el carrito siempre a mano.</li>
<li>Migas de pan en producto y carrito para saber dónde estoy y volver.</li>
<li>En móvil, menú a pantalla completa con números grandes, fácil de tocar con el pulgar.</li>
<li>Pie de página como “mapa de rescate” con todos los enlaces.</li></ul></div>
<div><h3>Llamados a la acción (CTA)</h3><ul class="clean small">
<li><b>Un CTA primario por vista</b> en color Cereza (el más saturado de la paleta) para que destaque: “Comprar café”, “Agregar”, “Solicitar reserva”, “Finalizar compra”.</li>
<li>CTA secundario con borde, nunca compitiendo con el primario.</li>
<li>Verbos de acción claros y, cuando ayuda, el precio dentro del botón (“Agregar · $98.000”).</li>
<li>“Reserva una cata” permanece en el encabezado: es el objetivo 3 del negocio.</li>
<li>Botones “Agregar” directamente en las tarjetas para reducir pasos.</li></ul></div>
<div><h3>Diseño responsivo</h3><ul class="clean small">
<li>Enfoque <b>mobile-first</b> con CSS Grid y Flexbox; 3 puntos de quiebre (1440/834/390).</li>
<li>Tipografía y espacios fluidos con <i>clamp()</i>: crecen suavemente sin saltos.</li>
<li>Contenido priorizado en móvil: filtros plegados, carruseles deslizables, CTA a todo el ancho.</li>
<li>Ilustraciones en SVG: se ven nítidas en cualquier pantalla y pesan muy poco.</li></ul></div>
</div>
<h3>Heurísticas de usabilidad (Nielsen) aplicadas</h3>
<table class="small">
<tr><th>Heurística</th><th>Aplicación en Cumbre</th></tr>
<tr><td>Visibilidad del estado del sistema</td><td>Notificación al agregar, contador del carrito, barra de envío gratis, pasos de compra.</td></tr>
<tr><td>Relación con el mundo real</td><td>Lenguaje del café colombiano: tostión, molienda, finca, opita; precios en pesos.</td></tr>
<tr><td>Control y libertad</td><td>Quitar productos, cambiar cantidades, limpiar filtros, cerrar paneles con Esc.</td></tr>
<tr><td>Prevención de errores</td><td>Validación en línea, fecha mínima de hoy, límites de personas (1–12).</td></tr>
<tr><td>Reconocer antes que recordar</td><td>Notas de sabor y origen visibles en cada tarjeta; resumen de la reserva junto al formulario.</td></tr>
<tr><td>Diseño estético y minimalista</td><td>Información técnica solo en el detalle; acordeón para las preguntas.</td></tr>
</table>
"""))

# ---------------------------------------------------------------- 9 GUION VIDEO
guion = [
    ('0:00 – 0:12', 'Portada del sitio (Inicio, primera pantalla)', 'Hola, soy Heidy Tatiana Beltrán. Les presento el prototipo web de Cumbre, una tostadora de café de especialidad del Huila que vende café en línea y ofrece catas y tours de finca.'),
    ('0:12 – 0:30', 'Hero: titular, CTA y cifras', 'La primera pantalla responde en segundos qué es Cumbre. El titular en serif grande tiene la mayor jerarquía; debajo, dos llamados a la acción: el primario en rojo cereza, “Comprar café”, y el secundario con borde, “Reserva una cata”. Las cifras dan confianza.'),
    ('0:30 – 0:48', 'Scroll por el Inicio', 'Al bajar, el contenido sigue el recorrido del usuario: beneficios, cafés destacados con botón de agregar, el proceso del grano a la taza, la suscripción y las experiencias. Los fondos alternados separan cada sección.'),
    ('0:48 – 1:05', 'Tienda y producto', 'En la tienda puedo filtrar por tostión, proceso y precio, o buscar por notas de sabor. En el detalle, el precio y el botón de compra están siempre visibles, y la ficha técnica muestra el origen, nuestro gran diferencial.'),
    ('1:05 – 1:20', 'Carrito y notificación', 'Al agregar, una notificación confirma la acción y el carrito lateral muestra cuánto falta para el envío gratis. Así el usuario siempre sabe qué está pasando.'),
    ('1:20 – 1:35', 'Experiencias y reserva', 'Las experiencias muestran duración, cupo y precio. El formulario de reserva calcula el total en tiempo real y valida los datos para evitar errores.'),
    ('1:35 – 1:52', 'Vista en tableta y celular', 'El diseño es responsivo: en tableta y celular el menú se convierte en hamburguesa, los productos se deslizan como carrusel y los botones ocupan todo el ancho para tocarlos fácilmente.'),
    ('1:52 – 2:00', 'Cierre con el logo', 'Cumbre: del corazón de la montaña a tu taza. ¡Gracias!'),
]
P.append(page(f"""
<span class="sec-n">09</span><span class="eyebrow">Video de justificación</span>
<h2>Guion del video (2 minutos)</h2>
<p>Guion para grabar la narración del video de justificación (jerarquía, navegación y CTA). En la carpeta <i>docs/</i> del repositorio se incluye <b>video-recorrido.webm</b>, un recorrido automático del prototipo de 2 minutos con subtítulos que sigue exactamente estos tiempos: basta con grabar la voz encima (por ejemplo con Clipchamp, CapCut o el editor de fotos de Windows).</p>
<table>
<tr><th style="width:22mm">Tiempo</th><th style="width:42mm">En pantalla</th><th>Narración</th></tr>
{''.join(f'<tr><td><b>{t}</b></td><td class="small">{s}</td><td class="small">{n}</td></tr>' for t, s, n in guion)}
</table>
<div class="card" style="margin-top:5mm"><h4>Consejos de grabación</h4><ul class="clean small"><li>Graba la voz en un lugar silencioso; habla despacio (≈ 140 palabras por minuto).</li><li>Exporta en MP4 1080p y verifica que no supere los 2 minutos.</li><li>También puedes grabar tu propia pantalla navegando el sitio publicado y seguir el mismo guion.</li></ul></div>
"""))

# ---------------------------------------------------------------- 10 TÉCNICA
P.append(page(f"""
<span class="sec-n">10</span><span class="eyebrow">Implementación técnica</span>
<h2>Del prototipo al sitio publicado</h2>
<div class="grid2">
<div class="card"><h4>Tecnologías</h4><ul class="clean small">
<li><b>Angular 22</b> (última versión): componentes standalone, <i>signals</i>, nuevo control de flujo (@if, @for), modo <i>zoneless</i> y carga diferida de rutas.</li>
<li><b>SCSS</b> con variables CSS (design tokens) para la guía de estilo.</li>
<li><b>Formularios reactivos</b> con validación.</li>
<li>Ilustraciones e íconos <b>SVG</b> propios (sin imágenes externas).</li>
<li>Google Fonts: Fraunces y DM Sans.</li></ul></div>
<div class="card"><h4>Rendimiento</h4><ul class="clean small">
<li>Paquete inicial ≈ <b>104 kB</b> comprimido.</li>
<li>Cada página se carga bajo demanda (6–15 kB).</li>
<li>Sin fotografías pesadas: todo es vectorial.</li>
<li>Transiciones de vista nativas entre páginas.</li></ul></div>
</div>
<h3>Estructura del proyecto</h3>
<pre style="background:#2a1810;color:#f6efe4;border-radius:3mm;padding:4mm;font-size:8pt;line-height:1.5;margin:0">cumbre-cafe/
├─ .github/workflows/deploy.yml   ← publicación automática en GitHub Pages
├─ docs/                          ← este documento, video y fuentes (wireframes)
├─ public/favicon.svg
└─ src/
   ├─ styles.scss                 ← guía de estilo (tokens, botones, formularios)
   └─ app/
      ├─ core/     header, footer, carrito (servicio con signals), datos
      ├─ shared/   íconos, ilustraciones SVG, tarjeta de producto, animaciones
      └─ pages/    inicio, tienda, producto, experiencias, nosotros, contacto, carrito, 404</pre>
<h3>Publicación con GitHub Actions</h3>
<ol class="small" style="padding-left:5mm">
<li>Repositorio público en GitHub: <b>{REPO}</b>, rama <b>main</b>.</li>
<li>En el repositorio: <b>Settings → Pages → Source: GitHub Actions</b>.</li>
<li>Cada <i>push</i> a <b>main</b> ejecuta el flujo: instala Node 24, compila Angular con <i>--base-href /Cumbre---Cafe/</i>, crea el <i>404.html</i> para las rutas y publica en GitHub Pages.</li>
<li>El sitio queda disponible en <b>{URL}</b></li>
</ol>
<div class="card" style="margin-top:3mm">{qr_block()}</div>
"""))

# ---------------------------------------------------------------- 11 CONCLUSIONES
P.append(page("""
<span class="sec-n">11</span><span class="eyebrow">Cierre</span>
<h2>Conclusiones</h2>
<ul class="clean">
<li>Partir de la <b>audiencia y los objetivos del negocio</b> permitió tomar decisiones de diseño justificadas: cada sección del sitio responde a una necesidad concreta de una persona.</li>
<li>Una <b>arquitectura plana</b> de cinco secciones y CTA consistentes acortan el camino a la compra (3 clics) y a la reserva.</li>
<li>Diseñar los <b>wireframes en tres dispositivos</b> antes del color evitó problemas de adaptación y obligó a priorizar el contenido en móvil.</li>
<li>Una <b>identidad visual propia</b> (paleta del paisaje cafetero, serif expresiva, ilustraciones originales) diferencia a Cumbre de sitios genéricos de café y comunica origen y calidez.</li>
<li>Construir el prototipo en <b>Angular</b> y publicarlo con <b>GitHub Actions</b> convierte el diseño en una experiencia real, navegable y lista para mostrar al cliente.</li>
</ul>
<h3>Referencias</h3>
<ul class="clean small">
<li>Krug, S. (2014). <i>Don't Make Me Think, Revisited</i>. New Riders.</li>
<li>Nielsen, J. (1994). <i>10 Usability Heuristics for User Interface Design</i>. Nielsen Norman Group.</li>
<li>Rosenfeld, L., Morville, P. y Arango, J. (2015). <i>Information Architecture for the Web and Beyond</i>. O'Reilly.</li>
<li>Marcotte, E. (2011). <i>Responsive Web Design</i>. A Book Apart.</li>
<li>W3C (2018). <i>Web Content Accessibility Guidelines (WCAG) 2.1</i>.</li>
<li>Google. <i>Angular — documentación oficial</i> (angular.dev).</li>
<li>Google Fonts: Fraunces (Undercase Type) y DM Sans (Colophon Foundry).</li>
<li>Sitios de referencia analizados: Blue Bottle Coffee, Onyx Coffee Lab, Pergamino Café, Café Devoción, Airbnb Experiencias.</li>
</ul>
<div class="card dark" style="margin-top:12mm;text-align:center;padding:10mm">
<div style="font-family:Fraunces;font-size:22pt;font-style:italic">Del corazón de la montaña a tu taza.</div>
<p style="opacity:.7;margin:3mm 0 0" class="small">Cumbre · Café de Origen es un cliente ficticio creado con fines académicos.<br>Diseño y desarrollo: Heidy Tatiana Beltrán Ramírez · Interfaces y Diseño Web · 2026</p>
</div>
"""))

body_html = ''.join(P)
for k, v in SECTION_PAGES.items():
    body_html = body_html.replace(f'@@TOC{k}@@', str(v))
doc = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Cumbre · Documento de diseño</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..700&display=swap" rel="stylesheet">
<style>{css}</style></head><body>{body_html}</body></html>"""
open(os.path.join(OUT, 'documento.html'), 'w', encoding='utf-8').write(doc)
print('paginas:', page_no[0])
