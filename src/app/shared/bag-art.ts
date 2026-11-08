import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let uid = 0;

/** Ilustración vectorial del empaque de café Cumbre, parametrizable por producto. */
@Component({
  selector: 'app-bag-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  template: `
    <svg viewBox="0 0 300 380" role="img" [attr.aria-label]="'Empaque de ' + name()">
      <defs>
        <linearGradient [attr.id]="id + 'k'" x1="0" x2="1">
          <stop offset="0" stop-color="#c49a6c" />
          <stop offset="0.45" stop-color="#d9b48a" />
          <stop offset="1" stop-color="#b58758" />
        </linearGradient>
        <linearGradient [attr.id]="id + 's'" x1="0" x2="1">
          <stop offset="0" stop-color="#000" stop-opacity="0.18" />
          <stop offset="0.35" stop-color="#000" stop-opacity="0" />
          <stop offset="0.8" stop-color="#000" stop-opacity="0" />
          <stop offset="1" stop-color="#000" stop-opacity="0.22" />
        </linearGradient>
      </defs>
      <!-- sombra -->
      <ellipse cx="150" cy="362" rx="110" ry="12" fill="#2a1810" opacity="0.18" />
      <!-- bolsa -->
      <path d="M58 52 L242 52 L254 350 Q150 360 46 350 Z" [attr.fill]="'url(#' + id + 'k)'" />
      <!-- pliegue superior -->
      <path d="M54 28 L246 28 L242 58 L58 58 Z" fill="#a87b4d" />
      <path d="M54 28 L246 28 L246 36 L54 36 Z" fill="#8f653b" />
      <rect x="70" y="40" width="160" height="5" rx="2.5" fill="#7a5530" opacity="0.6" />
      <!-- válvula -->
      <circle cx="150" cy="86" r="9" fill="#8f653b" opacity="0.5" />
      <circle cx="150" cy="86" r="4" fill="#7a5530" opacity="0.6" />
      <!-- etiqueta -->
      <path d="M62 118 L238 118 L246 300 L54 300 Z" [attr.fill]="color()" />
      <!-- logo montaña -->
      <g [attr.fill]="accent()" transform="translate(150 162)">
        <path d="M-34 18 L-12 -16 L0 0 L8 -10 L30 18 Z" opacity="0.95" />
        <path d="M-12 -16 L-6 -7 L-10 -4 L-16 -9 Z" [attr.fill]="color()" opacity="0.6" />
        <circle cx="20" cy="-20" r="5" />
      </g>
      <text x="150" y="208" text-anchor="middle" [attr.fill]="accent()"
        font-family="DM Sans, sans-serif" font-size="11" font-weight="700" letter-spacing="4">CUMBRE</text>
      <line x1="100" y1="220" x2="200" y2="220" [attr.stroke]="accent()" stroke-opacity="0.5" />
      <text x="150" y="246" text-anchor="middle" [attr.fill]="accent()"
        font-family="Fraunces, Georgia, serif" [attr.font-size]="titleSize()" font-weight="600">{{ name() }}</text>
      <text x="150" y="272" text-anchor="middle" [attr.fill]="accent()" opacity="0.8"
        font-family="DM Sans, sans-serif" font-size="10" font-weight="600" letter-spacing="2">
        TOSTIÓN {{ roast().toUpperCase() }}
      </text>
      <!-- sombreado de volumen -->
      <path d="M58 52 L242 52 L254 350 Q150 360 46 350 Z" [attr.fill]="'url(#' + id + 's)'" />
      <path d="M150 58 L152 352" stroke="#000" stroke-opacity="0.05" stroke-width="2" />
    </svg>
  `,
})
export class BagArt {
  readonly name = input('Cumbre');
  readonly color = input('#b8412c');
  readonly accent = input('#f6efe4');
  readonly roast = input('Media');
  protected readonly id = 'bag' + uid++;
  protected readonly titleSize = computed(() => (this.name().length > 15 ? 17 : 21));
}
