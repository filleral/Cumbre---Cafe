# Cumbre · Café de Origen ☕⛰️

Prototipo web de **Cumbre**, una tostadora de café de especialidad (cliente ficticio) del Huila, Colombia.
Trabajo final (ACA Final) de **Interfaces y Diseño Web**.

🌐 **Sitio publicado:** https://filleral.github.io/Cumbre---Cafe/

- **Estudiante:** Heidy Tatiana Beltrán Ramírez
- **Docente:** Carolina González
- **Entrega:** 8 de noviembre de 2026

## Entregables

| Entregable | Ubicación |
| --- | --- |
| Documento PDF (entrega principal) | [`docs/Documentacion-Cumbre-Heidy-Beltran.pdf`](docs/Documentacion-Cumbre-Heidy-Beltran.pdf) |
| Video de recorrido (1:59, con subtítulos) | [`docs/video-recorrido.webm`](docs/video-recorrido.webm) |
| Wireframes (PC · tableta · móvil) | [`docs/imagenes/wireframes/`](docs/imagenes/wireframes/) |
| Capturas del prototipo final | [`docs/imagenes/prototipo/`](docs/imagenes/prototipo/) |
| Prototipo navegable | https://filleral.github.io/Cumbre---Cafe/ |

## Páginas del prototipo

Inicio · Tienda (con filtros y buscador) · Detalle de producto · Experiencias (con reserva) · Nosotros · Contacto · Carrito · 404

## Tecnología

- Angular 22 (componentes standalone, signals, zoneless, control de flujo `@if`/`@for`, rutas con carga diferida)
- SCSS con design tokens · Formularios reactivos · Ilustraciones e íconos SVG propios
- Tipografías: Fraunces + DM Sans (Google Fonts)

## Ejecutar en local

Requiere Node.js 22.22+ o 24.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # compila en dist/cumbre-cafe/browser
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `cumbre-cafe`) y sube este proyecto a la rama `main`.
2. En el repositorio ve a **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que compila con
   `--base-href /<nombre-del-repo>/`, crea `404.html` para las rutas de Angular y publica el sitio.
4. El sitio queda en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.
