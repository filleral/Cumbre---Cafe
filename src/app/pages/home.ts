import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXPERIENCES, PRODUCTS, TESTIMONIALS } from '../core/data';
import { CartService } from '../core/cart.service';
import { ProductCard } from '../shared/product-card';
import { SceneArt } from '../shared/scene-art';
import { BagArt } from '../shared/bag-art';
import { Icon } from '../shared/icon';
import { RevealDirective } from '../shared/reveal.directive';
import { CopPipe } from '../shared/cop.pipe';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCard, SceneArt, BagArt, Icon, RevealDirective, CopPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private cart = inject(CartService);
  protected readonly featured = PRODUCTS.slice(0, 4);
  protected readonly experiences = EXPERIENCES;
  protected readonly testimonials = TESTIMONIALS;
  protected readonly tasteNotes = ['Panela', 'Chocolate', 'Jazmín', 'Bergamota', 'Frutos rojos', 'Mandarina', 'Caramelo', 'Cacao', 'Durazno', 'Hibisco'];

  protected readonly values = [
    { icon: 'mountain', title: 'Origen trazable', text: 'Cada bolsa dice de qué finca, qué familia y a qué altura nació tu café.' },
    { icon: 'flame', title: 'Tostión en pequeños lotes', text: 'Tostamos dos veces por semana, en lotes de 12 kg, y despachamos en 48 horas.' },
    { icon: 'hand', title: 'Precio justo', text: 'Pagamos hasta 40 % más que el precio de bolsa directamente a los productores.' },
  ];

  protected readonly steps = [
    { n: '01', title: 'Cosecha a mano', text: 'Solo se recoge la cereza roja y madura, grano por grano.' },
    { n: '02', title: 'Beneficio', text: 'Despulpado, fermentado y secado al sol en la misma finca.' },
    { n: '03', title: 'Tostión', text: 'Diseñamos un perfil de tueste para resaltar las notas de cada lote.' },
    { n: '04', title: 'Tu taza', text: 'Llega fresco a tu puerta con guía de preparación incluida.' },
  ];

  protected readonly plans = [
    { id: 'quincenal', label: 'Cada 15 días', price: 71400 },
    { id: 'mensual', label: 'Cada mes', price: 35700 },
  ];
  protected readonly plan = signal('mensual');

  subscribeClub() {
    this.cart.notify('¡Ya eres parte del Club Cumbre! Te escribiremos para elegir tu café.');
  }
}
