import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/data';
import { CartService } from '../core/cart.service';
import { BagArt } from './bag-art';
import { Icon } from './icon';
import { CopPipe } from './cop.pipe';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BagArt, Icon, CopPipe],
  template: `
    @let p = product();
    <article class="card">
      <a class="media" [routerLink]="['/tienda', p.slug]" [style.--tint]="p.color">
        @if (p.tag) {
          <span class="badge">{{ p.tag }}</span>
        }
        <app-bag-art [name]="p.name" [color]="p.color" [accent]="p.accent" [roast]="p.roast" />
      </a>
      <div class="body">
        <p class="origin"><app-icon name="pin" [size]="14" /> {{ p.town }} · {{ p.process }}</p>
        <h3><a [routerLink]="['/tienda', p.slug]">{{ p.name }}</a></h3>
        <ul class="notes">
          @for (n of p.notes; track n) {
            <li>{{ n }}</li>
          }
        </ul>
        <div class="foot">
          <div>
            <strong>{{ p.price | cop }}</strong>
            <small>{{ p.weight }}</small>
          </div>
          <button class="btn btn--sm btn--dark add" type="button" (click)="cart.add(p.slug)" [attr.aria-label]="'Agregar ' + p.name + ' al carrito'">
            <app-icon name="plus" [size]="16" /> Agregar
          </button>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; }
    .card {
      height: 100%; display: flex; flex-direction: column;
      background: var(--papel); border-radius: var(--radius-lg); overflow: hidden;
      box-shadow: var(--shadow-sm); border: 1px solid var(--linea);
      transition: transform .5s var(--ease), box-shadow .5s var(--ease);
    }
    .card:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
    .media {
      position: relative; display: grid; place-items: center; padding: 28px 28px 8px;
      background: radial-gradient(circle at 50% 70%, color-mix(in srgb, var(--tint) 22%, transparent), transparent 70%), var(--crema-2);
      aspect-ratio: 1 / 1;
    }
    .media app-bag-art { width: 72%; transition: transform .6s var(--ease); }
    .card:hover .media app-bag-art { transform: rotate(-4deg) scale(1.05); }
    .badge { position: absolute; top: 16px; left: 16px; z-index: 1; }
    .body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
    .origin { display: flex; align-items: center; gap: 6px; font-size: .8rem; color: var(--gris); margin: 0 0 6px; }
    h3 { margin: 0 0 10px; font-size: 1.3rem; }
    h3 a:hover { color: var(--cereza); }
    .notes { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; padding: 0; margin: 0 0 18px; }
    .notes li { font-size: .75rem; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: var(--crema); color: var(--espresso-2); }
    .foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .foot strong { display: block; font-family: var(--font-display); font-size: 1.35rem; }
    .foot small { color: var(--gris); font-size: .78rem; }
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  protected readonly cart = inject(CartService);
}
