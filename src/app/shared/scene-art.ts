import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Ilustraciones vectoriales originales de la marca.
 * hero: paisaje cafetero del Huila · cata · finca · taller · historia
 */
@Component({
  selector: 'app-scene-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  styles: `
    svg { width: 100%; height: 100%; }
    .steam path { animation: steam 4s ease-in-out infinite; transform-origin: bottom; opacity: .7 }
    .steam path:nth-child(2) { animation-delay: 1.2s }
    .steam path:nth-child(3) { animation-delay: 2.4s }
    .sun { animation: float 8s ease-in-out infinite }
    @keyframes steam { 0%,100% { transform: translateY(0) scaleY(1); opacity: .2 } 50% { transform: translateY(-10px) scaleY(1.1); opacity: .8 } }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
  `,
  template: `
    @switch (scene()) {
      @case ('hero') {
        <svg viewBox="0 0 600 640" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Montañas cafeteras del Huila al amanecer">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#f3c98b" />
              <stop offset="0.55" stop-color="#f6dfba" />
              <stop offset="1" stop-color="#f6efe4" />
            </linearGradient>
          </defs>
          <rect width="600" height="640" fill="url(#sky)" />
          <circle class="sun" cx="410" cy="190" r="70" fill="#d9a441" />
          <circle cx="410" cy="190" r="110" fill="#d9a441" opacity="0.18" />
          <path d="M0 330 L90 250 L170 300 L280 190 L380 280 L470 220 L600 300 L600 640 L0 640Z" fill="#b8a07a" opacity="0.55" />
          <path d="M0 380 L120 280 L220 350 L330 260 L450 360 L540 300 L600 340 L600 640 L0 640Z" fill="#6f8a6d" />
          <path d="M0 450 Q150 360 300 430 T600 410 L600 640 L0 640Z" fill="#4c6b55" />
          <!-- hileras de cafetales -->
          <g fill="#2f4a3a">
            <path d="M0 520 Q160 430 330 500 T600 480 L600 640 L0 640Z" />
          </g>
          <g fill="#3d5c48">
            @for (r of rows; track $index) {
              @for (c of cols; track $index) {
                <circle [attr.cx]="c * 46 + (r % 2) * 23 + 10" [attr.cy]="540 + r * 26 - (c * 1.5)" [attr.r]="11 + r" />
              }
            }
          </g>
          <!-- casa de finca -->
          <g transform="translate(118 404)">
            <rect x="0" y="16" width="52" height="34" fill="#f6efe4" />
            <path d="M-6 18 L26 -4 L58 18Z" fill="#b8412c" />
            <rect x="20" y="30" width="12" height="20" fill="#2a1810" />
            <rect x="6" y="26" width="9" height="9" fill="#2f4a3a" />
            <rect x="38" y="26" width="9" height="9" fill="#2f4a3a" />
          </g>
          <!-- rama de café en primer plano -->
          <g transform="translate(470 470) rotate(-18)">
            <path d="M0 0 C -30 60 -40 120 -30 200" stroke="#2a1810" stroke-width="5" fill="none" />
            <ellipse cx="-38" cy="40" rx="34" ry="13" transform="rotate(-35 -38 40)" fill="#2f4a3a" />
            <ellipse cx="22" cy="70" rx="36" ry="13" transform="rotate(30 22 70)" fill="#4c6b55" />
            <ellipse cx="-52" cy="110" rx="34" ry="12" transform="rotate(-20 -52 110)" fill="#3d5c48" />
            <circle cx="-14" cy="56" r="9" fill="#b8412c" />
            <circle cx="-2" cy="64" r="9" fill="#d4583f" />
            <circle cx="-16" cy="70" r="8" fill="#8e2f20" />
            <circle cx="-24" cy="128" r="9" fill="#b8412c" />
            <circle cx="-12" cy="136" r="8" fill="#d4583f" />
          </g>
          <!-- pájaros -->
          <g stroke="#2a1810" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6">
            <path d="M150 140 q8 -8 16 0 q8 -8 16 0" />
            <path d="M200 110 q6 -6 12 0 q6 -6 12 0" />
          </g>
        </svg>
      }
      @case ('cata') {
        <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mesa de cata con tazas">
          <rect width="400" height="280" fill="#ede2d1" />
          <circle cx="320" cy="70" r="90" fill="#d9a441" opacity="0.25" />
          <rect x="0" y="190" width="400" height="90" fill="#8f653b" />
          <rect x="0" y="190" width="400" height="10" fill="#7a5530" />
          @for (x of [70, 160, 250, 340]; track x) {
            <g [attr.transform]="'translate(' + x + ' 150)'">
              <path d="M-30 0 h60 l-6 40 a6 6 0 0 1 -6 5 h-36 a6 6 0 0 1 -6 -5Z" fill="#f6efe4" />
              <ellipse cx="0" cy="2" rx="28" ry="6" fill="#3d2418" />
              <g class="steam" stroke="#fffaf3" stroke-width="3" fill="none" stroke-linecap="round">
                <path d="M-8 -6 c-6 -10 6 -14 0 -26" />
                <path d="M6 -6 c-6 -10 6 -14 0 -26" />
                <path d="M0 -10 c-6 -10 6 -14 0 -26" />
              </g>
            </g>
          }
          <g transform="translate(115 210) rotate(-15)">
            <ellipse cx="0" cy="0" rx="16" ry="7" fill="#c0c0c0" />
            <rect x="12" y="-2" width="60" height="4" rx="2" fill="#a8a8a8" />
          </g>
          @for (b of beans; track $index) {
            <ellipse [attr.cx]="b[0]" [attr.cy]="b[1]" rx="6" ry="4" [attr.transform]="'rotate(' + b[2] + ' ' + b[0] + ' ' + b[1] + ')'" fill="#3d2418" />
          }
        </svg>
      }
      @case ('finca') {
        <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Finca cafetera">
          <rect width="400" height="280" fill="#f3d6a6" />
          <circle cx="90" cy="80" r="38" fill="#d9a441" />
          <path d="M0 170 L100 100 L190 150 L290 80 L400 150 L400 280 L0 280Z" fill="#6f8a6d" />
          <path d="M0 210 Q120 150 230 200 T400 190 L400 280 L0 280Z" fill="#4c6b55" />
          <path d="M0 240 Q140 200 260 240 T400 230 L400 280 L0 280Z" fill="#2f4a3a" />
          <g fill="#3d5c48">
            @for (c of cols; track $index) {
              <circle [attr.cx]="c * 40 + 10" [attr.cy]="215 - (c % 3) * 4" r="12" />
            }
          </g>
          <g transform="translate(250 120)">
            <rect x="0" y="16" width="60" height="38" fill="#fffaf3" />
            <path d="M-8 18 L30 -8 L68 18Z" fill="#b8412c" />
            <rect x="24" y="32" width="12" height="22" fill="#2a1810" />
            <rect x="6" y="26" width="10" height="10" fill="#2f4a3a" />
            <rect x="44" y="26" width="10" height="10" fill="#2f4a3a" />
          </g>
          <g stroke="#2a1810" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round">
            <path d="M170 60 q6 -6 12 0 q6 -6 12 0" />
          </g>
        </svg>
      }
      @case ('taller') {
        <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Preparación de café en V60">
          <rect width="400" height="280" fill="#2f4a3a" />
          <circle cx="200" cy="120" r="110" fill="#4c6b55" opacity="0.6" />
          <!-- V60 -->
          <path d="M150 70 h100 l-36 70 h-28Z" fill="#f6efe4" />
          <rect x="140" y="62" width="120" height="10" rx="5" fill="#ede2d1" />
          <path d="M160 72 h80 l-30 58 h-20Z" fill="#c49a6c" />
          <!-- jarra -->
          <path d="M160 150 h80 v70 a14 14 0 0 1 -14 14 h-52 a14 14 0 0 1 -14 -14Z" fill="#fffaf3" opacity="0.35" />
          <path d="M162 185 h76 v35 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12Z" fill="#3d2418" />
          <path d="M200 140 v40" stroke="#3d2418" stroke-width="3" stroke-dasharray="4 6" />
          <!-- tetera cuello de cisne -->
          <g transform="translate(290 40)">
            <path d="M0 40 h50 v40 a10 10 0 0 1 -10 10 h-30 a10 10 0 0 1 -10 -10Z" fill="#d9a441" />
            <path d="M0 50 C -30 40 -40 20 -60 22" stroke="#d9a441" stroke-width="6" fill="none" stroke-linecap="round" />
            <rect x="15" y="32" width="20" height="8" rx="3" fill="#b88a35" />
          </g>
          <rect x="0" y="234" width="400" height="46" fill="#2a1810" />
        </svg>
      }
      @case ('historia') {
        <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Rama de café con cerezas maduras al atardecer">
          <defs>
            <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#d4583f" />
              <stop offset="1" stop-color="#f3c98b" />
            </linearGradient>
          </defs>
          <rect width="600" height="480" fill="url(#hsky)" />
          <circle cx="430" cy="300" r="90" fill="#f6dfba" opacity="0.9" />
          <path d="M0 360 L120 290 L230 340 L340 270 L460 330 L600 280 L600 480 L0 480Z" fill="#8e2f20" opacity="0.45" />
          <path d="M0 410 Q160 350 320 400 T600 390 L600 480 L0 480Z" fill="#2a1810" opacity="0.55" />
          <!-- rama -->
          <path d="M-20 120 C 140 150 300 200 640 170" stroke="#2a1810" stroke-width="9" fill="none" stroke-linecap="round" />
          @for (l of leaves; track $index) {
            <g [attr.transform]="'translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ')'">
              <path d="M0 0 C 30 -26 90 -26 120 0 C 90 26 30 26 0 0Z" [attr.fill]="l[3]" />
              <path d="M4 0 H112" stroke="#1f3328" stroke-width="2" opacity=".5" />
            </g>
          }
          @for (c of cherries; track $index) {
            <circle [attr.cx]="c[0]" [attr.cy]="c[1]" r="17" [attr.fill]="c[2]" />
            <circle [attr.cx]="c[0] - 6" [attr.cy]="c[1] - 6" r="4.5" fill="#fff" opacity="0.4" />
          }
        </svg>
      }
    }
  `,
})
export class SceneArt {
  readonly scene = input<'hero' | 'cata' | 'finca' | 'taller' | 'historia'>('hero');
  protected readonly rows = [0, 1, 2, 3];
  protected readonly cols = Array.from({ length: 14 }, (_, i) => i);
  protected readonly beans = [
    [40, 225, 20], [58, 232, -30], [300, 230, 60], [320, 238, 10], [360, 222, -40], [210, 245, 30],
  ];
  protected readonly leaves: [number, number, number, string][] = [
    [60, 132, -40, '#2f4a3a'], [70, 138, 35, '#4c6b55'], [230, 168, -35, '#3d5c48'], [240, 176, 40, '#2f4a3a'],
    [400, 178, -30, '#4c6b55'], [410, 182, 38, '#3d5c48'], [540, 172, -25, '#2f4a3a'], [550, 174, 45, '#4c6b55'],
  ];
  protected readonly cherries: [number, number, string][] = [
    [150, 160, '#8e2f20'], [178, 170, '#b8412c'], [160, 190, '#d4583f'], [190, 198, '#6b2737'], [140, 184, '#d9a441'],
    [320, 196, '#b8412c'], [348, 200, '#8e2f20'], [332, 224, '#d4583f'], [304, 220, '#6b2737'],
    [470, 190, '#d4583f'], [496, 196, '#8e2f20'], [482, 218, '#b8412c'],
  ];
}
