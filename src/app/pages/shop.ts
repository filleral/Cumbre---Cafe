import { ChangeDetectionStrategy, Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PRODUCTS, Roast } from '../core/data';
import { ProductCard } from '../shared/product-card';
import { Icon } from '../shared/icon';
import { CopPipe } from '../shared/cop.pipe';

type Sort = 'destacados' | 'menor' | 'mayor' | 'nombre';

@Component({
  selector: 'app-shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, Icon, CopPipe],
  template: `
    <section class="page-hero grain">
      <div class="container">
        <span class="eyebrow">Tienda</span>
        <h1>Nuestros cafés</h1>
        <p class="lead">Microlotes del Huila tostados cada semana. Elige por tostión, proceso o simplemente por las notas que más te antojen.</p>
      </div>
    </section>

    <section class="container shop">
      <button class="btn btn--ghost btn--sm toggle" type="button" (click)="filtersOpen.set(!filtersOpen())" [attr.aria-expanded]="filtersOpen()">
        <app-icon name="filter" [size]="16" /> Filtros @if (activeCount() > 0) { ({{ activeCount() }}) }
      </button>

      <aside class="filters" [class.open]="filtersOpen()" aria-label="Filtros">
        <div class="group">
          <h4>Tostión</h4>
          @for (r of roasts; track r) {
            <label class="check">
              <input type="checkbox" [checked]="roast().includes(r)" (change)="toggle(roast, r)" />
              <span class="roast-dot" [attr.data-r]="r"></span> {{ r }}
            </label>
          }
        </div>
        <div class="group">
          <h4>Proceso</h4>
          @for (p of processes; track p) {
            <label class="check">
              <input type="checkbox" [checked]="process().includes(p)" (change)="toggle(process, p)" /> {{ p }}
            </label>
          }
        </div>
        <div class="group">
          <h4>Precio máximo</h4>
          <input type="range" min="38000" max="98000" step="2000" [value]="maxPrice()" (input)="maxPrice.set(+$any($event.target).value)" aria-label="Precio máximo" />
          <div class="range-val"><span>$38.000</span><strong>{{ maxPrice() | cop }}</strong></div>
        </div>
        @if (activeCount() > 0) {
          <button class="link-arrow clear" type="button" (click)="reset()">Limpiar filtros</button>
        }
      </aside>

      <div class="results">
        <div class="toolbar">
          <label class="search">
            <app-icon name="search" [size]="18" />
            <input type="search" placeholder="Buscar por nombre o nota: “chocolate”…" [value]="q()" (input)="q.set($any($event.target).value)" aria-label="Buscar café" />
          </label>
          <div class="sort">
            <span>{{ list().length }} cafés</span>
            <select (change)="sort.set($any($event.target).value)" aria-label="Ordenar">
              <option value="destacados">Destacados</option>
              <option value="menor">Precio: menor a mayor</option>
              <option value="mayor">Precio: mayor a menor</option>
              <option value="nombre">Nombre A–Z</option>
            </select>
          </div>
        </div>

        @if (list().length) {
          <div class="grid">
            @for (p of list(); track p.slug) {
              <app-product-card [product]="p" />
            }
          </div>
        } @else {
          <div class="none">
            <app-icon name="cup" [size]="48" [stroke]="1.2" />
            <h3>No encontramos cafés con esos filtros</h3>
            <button class="btn btn--sm" type="button" (click)="reset()">Ver todos</button>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './shop.scss',
})
export class Shop {
  protected readonly roasts: Roast[] = ['Clara', 'Media', 'Oscura'];
  protected readonly processes = ['Lavado', 'Honey', 'Natural', 'Descafeinado EA'];

  protected readonly roast = signal<string[]>([]);
  protected readonly process = signal<string[]>([]);
  protected readonly maxPrice = signal(98000);
  protected readonly q = signal('');
  protected readonly sort = signal<Sort>('destacados');
  protected readonly filtersOpen = signal(false);

  protected readonly activeCount = computed(
    () => this.roast().length + this.process().length + (this.maxPrice() < 98000 ? 1 : 0),
  );

  protected readonly list = computed(() => {
    const q = this.q().trim().toLowerCase();
    const out = PRODUCTS.filter(
      (p) =>
        (!this.roast().length || this.roast().includes(p.roast)) &&
        (!this.process().length || this.process().some((x) => p.process.includes(x))) &&
        p.price <= this.maxPrice() &&
        (!q || (p.name + ' ' + p.notes.join(' ') + ' ' + p.town).toLowerCase().includes(q)),
    );
    switch (this.sort()) {
      case 'menor':
        return [...out].sort((a, b) => a.price - b.price);
      case 'mayor':
        return [...out].sort((a, b) => b.price - a.price);
      case 'nombre':
        return [...out].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return out;
    }
  });

  constructor() {
    const t = inject(ActivatedRoute).snapshot.queryParamMap.get('tostion');
    if (t) this.roast.set([t]);
  }

  toggle(sig: WritableSignal<string[]>, v: string) {
    sig.update((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));
  }

  reset() {
    this.roast.set([]);
    this.process.set([]);
    this.maxPrice.set(98000);
    this.q.set('');
  }
}
