import { Routes } from '@angular/router';
import { Home } from './pages/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Cumbre · Café de Origen del Huila' },
  { path: 'tienda', loadComponent: () => import('./pages/shop').then((m) => m.Shop), title: 'Tienda · Cumbre' },
  {
    path: 'tienda/:slug',
    loadComponent: () => import('./pages/product').then((m) => m.ProductPage),
    title: 'Producto · Cumbre',
  },
  {
    path: 'experiencias',
    loadComponent: () => import('./pages/experiences').then((m) => m.Experiences),
    title: 'Experiencias · Cumbre',
  },
  { path: 'nosotros', loadComponent: () => import('./pages/about').then((m) => m.About), title: 'Nosotros · Cumbre' },
  { path: 'contacto', loadComponent: () => import('./pages/contact').then((m) => m.Contact), title: 'Contacto · Cumbre' },
  { path: 'carrito', loadComponent: () => import('./pages/cart').then((m) => m.Cart), title: 'Carrito · Cumbre' },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound), title: 'Página no encontrada · Cumbre' },
];
