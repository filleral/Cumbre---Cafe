import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { BagArt } from '../shared/bag-art';
import { Icon } from '../shared/icon';
import { CopPipe } from '../shared/cop.pipe';
import { PRODUCTS } from '../core/data';
import { ProductCard } from '../shared/product-card';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BagArt, Icon, CopPipe, ProductCard],
  template: `
    <section class="page-hero grain small">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta"><a routerLink="/">Inicio</a> <span>/</span> <span aria-current="page">Carrito</span></nav>
        <h1>Tu carrito</h1>
        <ol class="steps" aria-label="Pasos de compra">
          <li class="on"><span>1</span> Carrito</li>
          <li [class.on]="done()"><span>2</span> Envío y pago</li>
          <li [class.on]="done()"><span>3</span> Confirmación</li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        @if (done()) {
          <div class="done">
            <span class="ok"><app-icon name="check" [size]="34" /></span>
            <h2>¡Gracias por tu compra!</h2>
            <p class="lead">Tu pedido <b>#CB-{{ order }}</b> está en camino a la tostadora. Lo despachamos en las próximas 48 horas.</p>
            <a routerLink="/tienda" class="btn">Seguir comprando</a>
          </div>
        } @else if (cart.items().length === 0) {
          <div class="done">
            <app-icon name="cup" [size]="64" [stroke]="1.1" />
            <h2>Tu carrito está vacío</h2>
            <p class="lead">Descubre nuestros cafés de origen y encuentra tu favorito.</p>
            <a routerLink="/tienda" class="btn">Ir a la tienda <app-icon name="arrow" /></a>
          </div>
          <div class="suggest">
            <h3>Te recomendamos</h3>
            <div class="grid">
              @for (p of suggestions; track p.slug) {
                <app-product-card [product]="p" />
              }
            </div>
          </div>
        } @else {
          <div class="layout">
            <div class="table">
              <div class="row head"><span>Producto</span><span>Cantidad</span><span>Total</span></div>
              @for (l of cart.items(); track l.slug + l.grind) {
                <div class="row">
                  <div class="prod">
                    <a class="thumb" [routerLink]="['/tienda', l.slug]" [style.background]="l.product.color + '22'">
                      <app-bag-art [name]="l.product.name" [color]="l.product.color" [accent]="l.product.accent" [roast]="l.product.roast" />
                    </a>
                    <div>
                      <a [routerLink]="['/tienda', l.slug]"><strong>{{ l.product.name }}</strong></a>
                      <small>{{ l.grind }} · {{ l.product.weight }} · {{ l.product.price | cop }}</small>
                      <button class="remove" type="button" (click)="cart.remove(l)"><app-icon name="trash" [size]="14" /> Quitar</button>
                    </div>
                  </div>
                  <div class="qty">
                    <button type="button" (click)="cart.setQty(l, l.qty - 1)" aria-label="Menos"><app-icon name="minus" [size]="14" /></button>
                    <span>{{ l.qty }}</span>
                    <button type="button" (click)="cart.setQty(l, l.qty + 1)" aria-label="Más"><app-icon name="plus" [size]="14" /></button>
                  </div>
                  <strong class="line-total">{{ l.qty * l.product.price | cop }}</strong>
                </div>
              }
            </div>

            <aside class="summary">
              <h3>Resumen</h3>
              <div class="r"><span>Subtotal</span><span>{{ cart.subtotal() | cop }}</span></div>
              <div class="r"><span>Envío</span><span>{{ cart.shipping() === 0 ? 'Gratis' : (cart.shipping() | cop) }}</span></div>
              @if (cart.shipping() > 0) {
                <p class="hint">Agrega {{ 120000 - cart.subtotal() | cop }} más y el envío es gratis.</p>
              }
              <div class="r total"><span>Total</span><strong>{{ cart.total() | cop }}</strong></div>
              <label class="coupon">
                <input type="text" placeholder="Código de descuento" aria-label="Código de descuento" />
                <button class="btn btn--sm btn--ghost" type="button">Aplicar</button>
              </label>
              <button class="btn btn--block" type="button" (click)="checkout()">Finalizar compra <app-icon name="arrow" /></button>
              <ul class="pay">
                <li>PSE</li><li>Nequi</li><li>Tarjeta</li><li>Contraentrega</li>
              </ul>
            </aside>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .small { padding-bottom: 36px; }
    .steps { list-style: none; display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 0; margin: 8px 0 0; }
    .steps li { display: flex; align-items: center; gap: 8px; color: var(--gris); font-weight: 600; font-size: .9rem; }
    .steps span { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; border: 1.5px solid var(--linea); font-size: .8rem; }
    .steps li.on { color: var(--espresso); }
    .steps li.on span { background: var(--cereza); border-color: var(--cereza); color: var(--papel); }
    .layout { display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start; }
    .table { background: var(--papel); border-radius: var(--radius-lg); border: 1px solid var(--linea); padding: 8px 28px; }
    .row { display: grid; grid-template-columns: 1fr 140px 120px; gap: 16px; align-items: center; padding: 20px 0; border-bottom: 1px solid var(--linea); }
    .row:last-child { border: none; }
    .row.head { font-size: .75rem; text-transform: uppercase; letter-spacing: .14em; color: var(--gris); font-weight: 700; padding: 14px 0; }
    .row.head span:last-child, .line-total { text-align: right; }
    .prod { display: flex; gap: 16px; align-items: center; }
    .prod small { display: block; color: var(--gris); font-size: .82rem; }
    .thumb { width: 84px; height: 84px; flex-shrink: 0; border-radius: 14px; display: grid; place-items: center; }
    .thumb app-bag-art { width: 56px; }
    .remove { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; border: none; background: none; padding: 0; color: var(--cereza); font-size: .8rem; font-weight: 600; cursor: pointer; }
    .qty { display: inline-flex; align-items: center; gap: 10px; border: 1.5px solid var(--linea); border-radius: 99px; padding: 3px; width: fit-content; }
    .qty button { width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--crema); display: grid; place-items: center; cursor: pointer; }
    .qty span { min-width: 18px; text-align: center; font-weight: 800; }
    .line-total { font-family: var(--font-display); font-size: 1.15rem; }
    .summary { position: sticky; top: calc(var(--header-h) + 24px); background: var(--espresso); color: var(--crema); padding: 28px; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); }
    .r { display: flex; justify-content: space-between; padding: 10px 0; }
    .r span:first-child { opacity: .75; }
    .total { border-top: 1px solid rgba(246,239,228,.18); margin-top: 8px; padding-top: 18px; font-size: 1.1rem; }
    .total strong { font-family: var(--font-display); font-size: 1.7rem; color: var(--miel); }
    .hint { font-size: .82rem; color: var(--miel); margin: 0 0 8px; }
    .coupon { display: flex; gap: 8px; margin: 18px 0; }
    .coupon input { flex: 1; min-width: 0; padding: 10px 16px; border-radius: 99px; border: 1px solid rgba(246,239,228,.25); background: transparent; color: var(--crema); }
    .coupon .btn--ghost { color: var(--crema); border-color: rgba(246,239,228,.5); }
    .pay { list-style: none; padding: 0; margin: 18px 0 0; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
    .pay li { font-size: .72rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: rgba(246,239,228,.1); }
    .done { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px 0; color: var(--espresso); }
    .done .lead { margin-inline: auto; }
    .ok { width: 80px; height: 80px; border-radius: 50%; background: var(--montana); color: var(--crema); display: grid; place-items: center; margin-bottom: 12px; }
    .suggest { margin-top: 48px; }
    .suggest h3 { text-align: center; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media (max-width: 960px) {
      .layout { grid-template-columns: 1fr; }
      .summary { position: static; }
      .grid { grid-template-columns: 1fr 1fr; }
      .grid > :last-child { display: none; }
    }
    @media (max-width: 600px) {
      .table { padding: 4px 16px; }
      .row.head { display: none; }
      .row { grid-template-columns: 1fr auto; }
      .prod { grid-column: 1 / -1; }
      .thumb { width: 68px; height: 68px; }
      .grid { grid-template-columns: 1fr; }
      .grid > :last-child { display: block; }
    }
  `,
})
export class Cart {
  protected readonly cart = inject(CartService);
  protected readonly done = signal(false);
  protected readonly suggestions = PRODUCTS.slice(0, 3);
  protected order = '';

  checkout() {
    this.order = String(Math.floor(10000 + Math.random() * 89999));
    this.cart.clear();
    this.done.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
