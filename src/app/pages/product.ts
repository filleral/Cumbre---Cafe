import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCTS } from '../core/data';
import { CartService } from '../core/cart.service';
import { BagArt } from '../shared/bag-art';
import { Icon } from '../shared/icon';
import { CopPipe } from '../shared/cop.pipe';
import { ProductCard } from '../shared/product-card';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BagArt, Icon, CopPipe, ProductCard],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage {
  readonly slug = input.required<string>();
  private cart = inject(CartService);

  protected readonly product = computed(() => PRODUCTS.find((p) => p.slug === this.slug()));
  protected readonly related = computed(() => PRODUCTS.filter((p) => p.slug !== this.slug()).slice(0, 3));
  protected readonly grinds = ['Grano entero', 'Molido para V60', 'Molido para prensa', 'Molido para espresso'];
  protected readonly grind = signal('Grano entero');
  protected readonly qty = signal(1);
  protected readonly profileKeys = [
    { key: 'acidez', label: 'Acidez' },
    { key: 'cuerpo', label: 'Cuerpo' },
    { key: 'dulzor', label: 'Dulzor' },
    { key: 'amargor', label: 'Amargor' },
  ] as const;

  add() {
    const p = this.product();
    if (!p) return;
    this.cart.add(p.slug, this.qty(), this.grind());
    this.qty.set(1);
  }
}
