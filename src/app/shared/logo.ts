import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:inline-flex;align-items:center;gap:10px' },
  template: `
    <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" [attr.fill]="dark() ? '#f6efe4' : '#2a1810'" />
      <path d="M10 46 L26 22 L34 33 L40 26 L54 46 Z" fill="#b8412c" />
      <path d="M26 22 L30 28 L27 30 L23 27 Z" [attr.fill]="dark() ? '#2a1810' : '#f6efe4'" />
      <circle cx="46" cy="16" r="5" fill="#d9a441" />
    </svg>
    <span class="word">
      <b>Cumbre</b>
      <small>Café de origen</small>
    </span>
  `,
  styles: `
    .word { display: flex; flex-direction: column; line-height: 1; }
    b { font-family: var(--font-display); font-size: 1.45rem; font-weight: 700; letter-spacing: -.02em; }
    small { font-size: .62rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 700; opacity: .7; margin-top: 3px; }
  `,
})
export class Logo {
  readonly dark = input(false);
}
