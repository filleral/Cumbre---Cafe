import { Injectable, computed, effect, signal } from '@angular/core';
import { PRODUCTS, Product } from './data';

export interface CartLine {
  slug: string;
  grind: string;
  qty: number;
}

const KEY = 'cumbre-cart-v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly lines = signal<CartLine[]>(this.load());
  readonly drawerOpen = signal(false);
  readonly toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly items = computed(() =>
    this.lines()
      .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.slug === l.slug) as Product }))
      .filter((l) => !!l.product),
  );
  readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((s, l) => s + l.qty * l.product.price, 0));
  readonly shipping = computed(() => (this.subtotal() === 0 || this.subtotal() >= 120000 ? 0 : 9000));
  readonly total = computed(() => this.subtotal() + this.shipping());

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.lines()));
      } catch {
        /* almacenamiento no disponible */
      }
    });
  }

  add(slug: string, qty = 1, grind = 'Grano entero') {
    this.lines.update((ls) => {
      const found = ls.find((l) => l.slug === slug && l.grind === grind);
      if (found) return ls.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
      return [...ls, { slug, grind, qty }];
    });
    const p = PRODUCTS.find((x) => x.slug === slug);
    this.notify(`${p?.name ?? 'Producto'} se agregó al carrito`);
  }

  setQty(line: CartLine, qty: number) {
    if (qty <= 0) return this.remove(line);
    this.lines.update((ls) =>
      ls.map((l) => (l.slug === line.slug && l.grind === line.grind ? { ...l, qty } : l)),
    );
  }

  remove(line: CartLine) {
    this.lines.update((ls) => ls.filter((l) => !(l.slug === line.slug && l.grind === line.grind)));
  }

  clear() {
    this.lines.set([]);
  }

  notify(msg: string) {
    this.toast.set(msg);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 2800);
  }

  private load(): CartLine[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
