import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header';
import { Footer } from './core/footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer],
  host: { style: 'display:block' },
  template: `
    <a class="skip" href="#main">Saltar al contenido</a>
    <app-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: `
    .skip { position: absolute; left: 16px; top: -60px; z-index: 200; padding: 10px 18px; border-radius: 99px; background: var(--espresso); color: var(--crema); font-weight: 700; }
    .skip:focus { top: 12px; }
    main:focus { outline: none; }
  `,
})
export class App {}
