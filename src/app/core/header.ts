import { ChangeDetectionStrategy, Component, HostListener, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './cart.service';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { BagArt } from '../shared/bag-art';
import { CopPipe } from '../shared/cop.pipe';

export const NAV = [
  { path: '/', label: 'Inicio', exact: true },
  { path: '/tienda', label: 'Tienda', exact: false },
  { path: '/experiencias', label: 'Experiencias', exact: false },
  { path: '/nosotros', label: 'Nosotros', exact: false },
  { path: '/contacto', label: 'Contacto', exact: false },
];

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, Logo, BagArt, CopPipe],
  template: `
    <div class="announce">
      <app-icon name="truck" [size]="16" />
      <span>Envío gratis desde $120.000<span class="extra"> · Tostamos cada martes y viernes</span></span>
    </div>
    <header class="bar" [class.scrolled]="scrolled()">
      <div class="container inner">
        <a routerLink="/" class="brand" aria-label="Cumbre, ir al inicio"><app-logo /></a>

        <nav class="nav" aria-label="Principal">
          @for (item of nav; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }">{{ item.label }}</a>
          }
        </nav>

        <div class="actions">
          <a routerLink="/experiencias" fragment="reserva" class="btn btn--sm cta">Reserva una cata</a>
          <button class="icon-btn" type="button" (click)="cart.drawerOpen.set(true)" aria-label="Abrir carrito">
            <app-icon name="cart" [size]="22" />
            @if (cart.count() > 0) {
              <span class="count">{{ cart.count() }}</span>
            }
          </button>
          <button class="icon-btn burger" type="button" (click)="menu.set(!menu())" [attr.aria-expanded]="menu()" aria-controls="mobile-menu" aria-label="Menú">
            <app-icon [name]="menu() ? 'close' : 'menu'" [size]="24" />
          </button>
        </div>
      </div>
    </header>

    <!-- Menú móvil -->
    <div id="mobile-menu" class="mobile" [class.open]="menu()" [attr.aria-hidden]="!menu()">
      <nav aria-label="Móvil">
        @for (item of nav; track item.path; let i = $index) {
          <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.exact }" [style.--i]="i">
            <span>0{{ i + 1 }}</span>{{ item.label }}
          </a>
        }
      </nav>
      <a routerLink="/experiencias" fragment="reserva" class="btn btn--block">Reserva una cata</a>
      <div class="mobile-social">
        <app-icon name="instagram" /> <app-icon name="facebook" /> <app-icon name="tiktok" /> <app-icon name="whatsapp" />
      </div>
    </div>

    <!-- Carrito lateral -->
    <div class="scrim" [class.open]="cart.drawerOpen()" (click)="cart.drawerOpen.set(false)"></div>
    <aside class="drawer" [class.open]="cart.drawerOpen()" aria-label="Carrito de compras" [attr.aria-hidden]="!cart.drawerOpen()">
      <div class="drawer-head">
        <h3>Tu carrito <small>({{ cart.count() }})</small></h3>
        <button class="icon-btn" type="button" (click)="cart.drawerOpen.set(false)" aria-label="Cerrar carrito"><app-icon name="close" /></button>
      </div>
      @if (cart.items().length === 0) {
        <div class="empty">
          <app-icon name="cup" [size]="48" [stroke]="1.2" />
          <p>Tu carrito está vacío.<br />¡Hay un café esperándote!</p>
          <a routerLink="/tienda" class="btn btn--sm" (click)="cart.drawerOpen.set(false)">Ir a la tienda</a>
        </div>
      } @else {
        <ul class="lines">
          @for (l of cart.items(); track l.slug + l.grind) {
            <li>
              <div class="thumb" [style.background]="l.product.color + '22'">
                <app-bag-art [name]="l.product.name" [color]="l.product.color" [accent]="l.product.accent" [roast]="l.product.roast" />
              </div>
              <div class="info">
                <strong>{{ l.product.name }}</strong>
                <small>{{ l.grind }} · {{ l.product.weight }}</small>
                <div class="qty">
                  <button type="button" (click)="cart.setQty(l, l.qty - 1)" aria-label="Quitar uno"><app-icon name="minus" [size]="14" /></button>
                  <span>{{ l.qty }}</span>
                  <button type="button" (click)="cart.setQty(l, l.qty + 1)" aria-label="Agregar uno"><app-icon name="plus" [size]="14" /></button>
                </div>
              </div>
              <strong class="price">{{ l.qty * l.product.price | cop }}</strong>
            </li>
          }
        </ul>
        <div class="drawer-foot">
          @if (cart.shipping() > 0) {
            <div class="progress">
              <p>Te faltan <b>{{ 120000 - cart.subtotal() | cop }}</b> para el envío gratis</p>
              <div class="track"><div [style.width.%]="(cart.subtotal() / 120000) * 100"></div></div>
            </div>
          } @else {
            <p class="free"><app-icon name="check" [size]="16" /> ¡Tienes envío gratis!</p>
          }
          <div class="row"><span>Subtotal</span><strong>{{ cart.subtotal() | cop }}</strong></div>
          <a routerLink="/carrito" class="btn btn--block" (click)="cart.drawerOpen.set(false)">Ver carrito y pagar <app-icon name="arrow" /></a>
        </div>
      }
    </aside>

    <!-- Notificación -->
    <div class="toast" [class.show]="!!cart.toast()" role="status" aria-live="polite">
      @if (cart.toast()) {
        <app-icon name="check" [size]="18" /> {{ cart.toast() }}
      }
    </div>
  `,
  styleUrl: './header.scss',
})
export class Header {
  protected readonly nav = NAV;
  protected readonly cart = inject(CartService);
  protected readonly menu = signal(false);
  protected readonly scrolled = signal(false);

  constructor() {
    inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.menu.set(false);
    });
    effect(() => {
      document.body.style.overflow = this.menu() || this.cart.drawerOpen() ? 'hidden' : '';
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 10);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.menu.set(false);
    this.cart.drawerOpen.set(false);
  }
}
