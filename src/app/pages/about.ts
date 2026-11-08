import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SceneArt } from '../shared/scene-art';
import { Icon } from '../shared/icon';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SceneArt, Icon, RevealDirective],
  template: `
    <section class="page-hero grain">
      <div class="container intro">
        <div>
          <span class="eyebrow">Nuestra historia</span>
          <h1>Somos hijos de caficultores</h1>
          <p class="lead">
            Cumbre nació en 2016 en la cocina de la familia Muñoz, en Pitalito. Queríamos que el café que nuestros
            abuelos cultivaban dejara de venderse como un grano anónimo y llegara, con nombre propio, a las tazas de
            todo el país.
          </p>
          <a routerLink="/tienda" class="btn">Prueba nuestro café <app-icon name="arrow" /></a>
        </div>
        <div class="art"><app-scene-art scene="historia" /></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <dl class="numbers">
          @for (n of numbers; track n.label; let i = $index) {
            <div [reveal]="i * 100"><dt>{{ n.value }}</dt><dd>{{ n.label }}</dd></div>
          }
        </dl>
      </div>
    </section>

    <section class="section section--paper">
      <div class="container timeline-wrap">
        <div class="sticky">
          <span class="eyebrow">Línea de tiempo</span>
          <h2>Diez años subiendo la montaña</h2>
          <p class="lead">Cada paso lo hemos dado de la mano de las familias que siembran nuestro café.</p>
        </div>
        <ol class="timeline">
          @for (t of timeline; track t.year; let i = $index) {
            <li [reveal]="i * 80">
              <span class="year">{{ t.year }}</span>
              <h3>{{ t.title }}</h3>
              <p>{{ t.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section" id="fincas">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">Las fincas</span>
            <h2>Las manos detrás de tu café</h2>
          </div>
          <p class="lead">Conoce a algunas de las 32 familias con las que trabajamos de forma directa.</p>
        </div>
        <div class="farmers">
          @for (f of farmers; track f.name; let i = $index) {
            <article class="farmer" [reveal]="i * 100">
              <div class="avatar" [style.background]="f.color">{{ f.initials }}</div>
              <h3>{{ f.name }}</h3>
              <p class="farm"><app-icon name="pin" [size]="14" /> {{ f.farm }}</p>
              <p>“{{ f.quote }}”</p>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section section--dark grain">
      <div class="container mission">
        <div reveal>
          <span class="eyebrow">Propósito</span>
          <h2>Que el campo colombiano tenga futuro</h2>
        </div>
        <div class="pillars">
          @for (p of pillars; track p.title) {
            <div reveal>
              <app-icon [name]="p.icon" [size]="28" />
              <h3>{{ p.title }}</h3>
              <p>{{ p.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './about.scss',
})
export class About {
  protected readonly numbers = [
    { value: '2016', label: 'año de fundación' },
    { value: '32', label: 'familias aliadas' },
    { value: '+40 %', label: 'sobre el precio de bolsa' },
    { value: '18 t', label: 'de café tostado al año' },
  ];
  protected readonly timeline = [
    { year: '2016', title: 'Una tostadora de 1 kg', text: 'Empezamos tostando en una sartén y luego en una pequeña máquina de 1 kg, vendiendo a vecinos y amigos de Neiva.' },
    { year: '2018', title: 'Primer microlote premiado', text: 'El Geisha de La Esperanza obtuvo 89 puntos en la Taza de la Excelencia regional.' },
    { year: '2020', title: 'Llegamos a todo el país', text: 'Lanzamos la tienda en línea y el Club Cumbre. En un año pasamos de 200 a 3.000 clientes.' },
    { year: '2023', title: 'Abrimos la tostadería', text: 'Nuestro espacio en Neiva: tostadora de 12 kg, barra de café y sala de catas abierta al público.' },
    { year: '2026', title: 'Turismo cafetero', text: 'Con las familias aliadas diseñamos los tours de finca para que más personas vivan el origen.' },
  ];
  protected readonly farmers = [
    { name: 'Don Hernando Muñoz', initials: 'HM', farm: 'El Mirador · Pitalito', color: '#b8412c', quote: 'Mi papá me enseñó que el café bueno se recoge maduro y se trata con cariño.' },
    { name: 'Doña Rubiela Cruz', initials: 'RC', farm: 'Los Naranjos · Acevedo', color: '#d97a8a', quote: 'Con el honey aprendí que la paciencia también se puede saborear.' },
    { name: 'Familia Ortiz', initials: 'FO', farm: 'La Esperanza · San Agustín', color: '#2f4a3a', quote: 'Antes no sabíamos a dónde iba nuestro café. Ahora nos escriben desde Bogotá.' },
    { name: 'Jhon Fredy Salas', initials: 'JS', farm: 'Villa Clara · La Plata', color: '#6b2737', quote: 'Soy la tercera generación y quiero que mis hijos quieran ser la cuarta.' },
  ];
  protected readonly pillars = [
    { icon: 'hand', title: 'Comercio directo', text: 'Sin intermediarios: acordamos el precio con cada familia antes de la cosecha.' },
    { icon: 'leaf', title: 'Cultivo responsable', text: 'Apoyamos la transición a abonos orgánicos y la protección de nacimientos de agua.' },
    { icon: 'users', title: 'Relevo generacional', text: 'Becas de formación en catación y barismo para jóvenes de las veredas.' },
  ];
}
