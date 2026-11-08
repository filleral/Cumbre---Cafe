import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <section class="nf container">
      <p class="big">4<span><app-icon name="cup" [size]="120" [stroke]="1.2" /></span>4</p>
      <h1>Esta taza está vacía</h1>
      <p class="lead">La página que buscas no existe o se mudó de finca.</p>
      <a routerLink="/" class="btn">Volver al inicio <app-icon name="arrow" /></a>
    </section>
  `,
  styles: `
    .nf { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-block: 80px; }
    .big { display: flex; align-items: center; font-family: var(--font-display); font-size: clamp(6rem, 20vw, 11rem); font-weight: 700; line-height: 1; color: var(--espresso); margin: 0 0 16px; }
    .big span { color: var(--cereza); }
    .lead { margin-inline: auto; }
  `,
})
export class NotFound {}
