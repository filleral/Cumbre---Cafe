import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { CartService } from './cart.service';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Logo, FormsModule],
  template: `
    <footer class="footer grain">
      <div class="container">
        <div class="news">
          <div>
            <h2>Recibe el café recién tostado en tu correo</h2>
            <p>Lanzamientos de microlotes, recetas y 10 % de descuento en tu primera compra.</p>
          </div>
          <form class="news-form" (submit)="subscribe($event)">
            <label for="news-mail" class="sr-only">Correo electrónico</label>
            <input id="news-mail" type="email" name="email" placeholder="tu@correo.com" [(ngModel)]="email" required />
            <button class="btn" type="submit">Suscribirme</button>
          </form>
        </div>

        <div class="cols">
          <div class="about">
            <app-logo [dark]="true" />
            <p>Tostadores de café de especialidad del Huila. Comercio directo con 32 familias caficultoras desde 2016.</p>
            <div class="social">
              <a href="#" aria-label="Instagram"><app-icon name="instagram" /></a>
              <a href="#" aria-label="Facebook"><app-icon name="facebook" /></a>
              <a href="#" aria-label="TikTok"><app-icon name="tiktok" /></a>
              <a href="#" aria-label="WhatsApp"><app-icon name="whatsapp" /></a>
            </div>
          </div>
          <div>
            <h4>Tienda</h4>
            <a routerLink="/tienda">Todos los cafés</a>
            <a [routerLink]="['/tienda', 'kit-cata']">Kit de cata</a>
            <a routerLink="/tienda" [queryParams]="{ tostion: 'Oscura' }">Para espresso</a>
            <a routerLink="/carrito">Mi carrito</a>
          </div>
          <div>
            <h4>Cumbre</h4>
            <a routerLink="/nosotros">Nuestra historia</a>
            <a routerLink="/experiencias">Catas y tours</a>
            <a routerLink="/nosotros" fragment="fincas">Las fincas</a>
            <a routerLink="/contacto">Mayoristas</a>
          </div>
          <div>
            <h4>Visítanos</h4>
            <p class="ico"><app-icon name="pin" [size]="16" /> Cra. 5 # 12-40, Neiva, Huila</p>
            <p class="ico"><app-icon name="clock" [size]="16" /> Lun a sáb · 8:00 a. m. – 7:00 p. m.</p>
            <p class="ico"><app-icon name="phone" [size]="16" /> +57 310 555 0142</p>
            <p class="ico"><app-icon name="mail" [size]="16" /> hola&#64;cumbrecafe.co</p>
          </div>
        </div>

        <div class="legal">
          <span>© 2026 Cumbre Café de Origen · Cliente ficticio</span>
          <span>Diseño: Heidy Tatiana Beltrán Ramírez · Interfaces y Diseño Web</span>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer { background: var(--espresso); color: var(--crema); padding: 80px 0 32px; }
    .news {
      display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: center;
      padding: 40px; border-radius: var(--radius-lg); background: var(--cereza); margin-bottom: 72px;
    }
    .news h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); margin-bottom: 8px; }
    .news p { margin: 0; opacity: .85; }
    .news-form { display: flex; gap: 10px; background: var(--papel); padding: 6px; border-radius: 99px; }
    .news-form input { flex: 1; min-width: 0; border: none; background: transparent; padding: 0 18px; color: var(--tinta); }
    .news-form input:focus { outline: none; }
    .news-form .btn { --bg: var(--espresso); }
    .cols { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.4fr; gap: 40px; }
    .cols h4 { font-family: var(--font-body); font-size: .78rem; letter-spacing: .18em; text-transform: uppercase; color: var(--miel); margin-bottom: 18px; }
    .cols a { display: block; padding: 5px 0; opacity: .8; transition: opacity .2s, transform .2s; }
    .cols a:hover { opacity: 1; transform: translateX(4px); }
    .about p { opacity: .7; margin: 18px 0; max-width: 32ch; }
    .ico { display: flex; gap: 10px; align-items: flex-start; opacity: .8; margin: 0 0 10px; font-size: .92rem; }
    .ico app-icon { margin-top: 4px; color: var(--miel); }
    .social { display: flex; gap: 8px; }
    .social a { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; border: 1px solid rgba(246,239,228,.25); opacity: 1; }
    .social a:hover { background: var(--crema); color: var(--espresso); transform: none; }
    .legal { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 64px; padding-top: 24px; border-top: 1px solid rgba(246,239,228,.15); font-size: .82rem; opacity: .6; }
    @media (max-width: 960px) {
      .news { grid-template-columns: 1fr; padding: 32px 24px; }
      .cols { grid-template-columns: 1fr 1fr; }
      .about { grid-column: 1 / -1; }
    }
    @media (max-width: 560px) {
      .news-form { flex-direction: column; border-radius: 20px; padding: 8px; }
      .news-form input { padding: 14px; }
      .cols { grid-template-columns: 1fr; gap: 28px; }
    }
  `,
})
export class Footer {
  private cart = inject(CartService);
  protected email = signal('');
  subscribe(e: Event) {
    e.preventDefault();
    if (!this.email().includes('@')) {
      this.cart.notify('Escribe un correo válido');
      return;
    }
    this.cart.notify('¡Listo! Revisa tu correo para tu 10 % de descuento');
    this.email.set('');
  }
}
