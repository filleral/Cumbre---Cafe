import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Icon],
  template: `
    <section class="page-hero grain">
      <div class="container">
        <span class="eyebrow">Contacto</span>
        <h1>Hablemos de café</h1>
        <p class="lead">¿Tienes una pregunta sobre tu pedido, quieres vender Cumbre en tu negocio o planear una cata para tu equipo? Te respondemos en menos de 24 horas.</p>
      </div>
    </section>

    <section class="section">
      <div class="container layout">
        <form class="card form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          @if (sent()) {
            <div class="ok" role="status">
              <span class="ok-ico"><app-icon name="check" [size]="28" /></span>
              <h3>¡Mensaje enviado!</h3>
              <p>Gracias por escribirnos. Te responderemos muy pronto al correo que nos dejaste.</p>
              <button class="btn btn--sm btn--ghost" type="button" (click)="sent.set(false)">Enviar otro mensaje</button>
            </div>
          } @else {
            <h2>Escríbenos</h2>
            <div class="grid-2">
              <div class="field" [class.invalid]="bad('name')">
                <label for="c-name">Nombre</label>
                <input id="c-name" formControlName="name" autocomplete="name" placeholder="Tu nombre" />
                @if (bad('name')) { <span class="error">Escribe tu nombre</span> }
              </div>
              <div class="field" [class.invalid]="bad('email')">
                <label for="c-email">Correo</label>
                <input id="c-email" type="email" formControlName="email" autocomplete="email" placeholder="tu@correo.com" />
                @if (bad('email')) { <span class="error">Correo no válido</span> }
              </div>
            </div>
            <div class="field">
              <label>Motivo</label>
              <div class="topics" role="radiogroup" aria-label="Motivo">
                @for (t of topics; track t.id) {
                  <label class="topic" [class.on]="form.controls.topic.value === t.id">
                    <input type="radio" formControlName="topic" [value]="t.id" />
                    <app-icon [name]="t.icon" [size]="18" /> {{ t.label }}
                  </label>
                }
              </div>
            </div>
            <div class="field" [class.invalid]="bad('message')">
              <label for="c-msg">Mensaje</label>
              <textarea id="c-msg" formControlName="message" placeholder="Cuéntanos en qué te podemos ayudar"></textarea>
              @if (bad('message')) { <span class="error">Mínimo 10 caracteres</span> }
            </div>
            <label class="consent">
              <input type="checkbox" formControlName="consent" />
              Acepto la política de tratamiento de datos personales.
            </label>
            @if (bad('consent')) { <span class="error">Debes aceptar para continuar</span> }
            <button class="btn btn--block" type="submit">Enviar mensaje <app-icon name="arrow" /></button>
          }
        </form>

        <aside class="side">
          <div class="map" role="img" aria-label="Mapa de ubicación de la tostadería en Neiva">
            <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="260" fill="#e7dccb" />
              <path d="M0 190 C 90 170 140 220 230 200 S 360 150 400 170 L400 260 L0 260Z" fill="#b9cdb9" />
              <path d="M-10 210 C 90 190 150 240 240 218 S 360 170 410 190" stroke="#9cc0d6" stroke-width="16" fill="none" />
              <g stroke="#fffaf3" stroke-width="10" stroke-linecap="round">
                <path d="M0 70 H400" /><path d="M0 140 H400" /><path d="M80 0 V260" /><path d="M200 0 V200" /><path d="M320 0 V180" />
              </g>
              <g stroke="#fffaf3" stroke-width="4" opacity=".8"><path d="M0 105 H400" /><path d="M140 0 V200" /><path d="M260 0 V200" /></g>
              <rect x="215" y="82" width="40" height="46" rx="4" fill="#d9c7ac" />
              <rect x="95" y="82" width="38" height="46" rx="4" fill="#d9c7ac" />
              <rect x="275" y="12" width="36" height="48" rx="4" fill="#d9c7ac" />
              <g transform="translate(200 105)">
                <circle r="34" fill="#b8412c" opacity=".18"><animate attributeName="r" values="18;40;18" dur="3s" repeatCount="indefinite" /></circle>
                <path d="M0 0 C -14 -16 -16 -24 -16 -30 A16 16 0 0 1 16 -30 C 16 -24 14 -16 0 0Z" fill="#b8412c" />
                <circle cy="-30" r="6" fill="#fffaf3" />
              </g>
            </svg>
            <span class="map-tag">Tostadería Cumbre · Neiva</span>
          </div>
          <ul class="info">
            @for (i of info; track i.title) {
              <li class="card">
                <span class="ico"><app-icon [name]="i.icon" /></span>
                <div><strong>{{ i.title }}</strong><p>{{ i.text }}</p></div>
              </li>
            }
          </ul>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: start; }
    .card { background: var(--papel); border: 1px solid var(--linea); border-radius: var(--radius-lg); }
    .form { padding: clamp(24px, 4vw, 44px); box-shadow: var(--shadow); }
    .form h2 { font-size: 2rem; margin-bottom: 24px; }
    .topics { display: flex; flex-wrap: wrap; gap: 8px; }
    .topic {
      display: inline-flex !important; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 99px;
      border: 1.5px solid var(--linea); cursor: pointer; font-weight: 600 !important; font-size: .88rem !important; transition: all .2s;
    }
    .topic input { position: absolute; opacity: 0; pointer-events: none; width: 0 !important; }
    .topic.on { background: var(--espresso); color: var(--crema) !important; border-color: var(--espresso); }
    .topic:focus-within { outline: 3px solid var(--miel); outline-offset: 2px; }
    .consent { display: flex; gap: 10px; align-items: flex-start; font-size: .88rem; color: var(--gris); margin: 4px 0 8px; cursor: pointer; }
    .consent input { width: 18px; height: 18px; accent-color: var(--cereza); margin-top: 2px; }
    .form > .error { display: block; color: var(--cereza); font-size: .8rem; font-weight: 600; margin-bottom: 8px; }
    .form .btn--block { margin-top: 16px; }
    .ok { text-align: center; padding: 40px 0; display: flex; flex-direction: column; align-items: center; }
    .ok-ico { width: 64px; height: 64px; border-radius: 50%; background: var(--montana); color: var(--crema); display: grid; place-items: center; margin-bottom: 18px; }
    .ok p { color: var(--gris); max-width: 36ch; }
    .side { display: grid; gap: 16px; }
    .map { position: relative; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 16 / 10; box-shadow: var(--shadow); }
    .map svg { width: 100%; height: 100%; }
    .map-tag { position: absolute; left: 16px; bottom: 16px; padding: 8px 14px; border-radius: 99px; background: var(--papel); font-weight: 700; font-size: .85rem; box-shadow: var(--shadow-sm); }
    .info { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info li { display: flex; gap: 14px; padding: 18px; }
    .info p { margin: 2px 0 0; color: var(--gris); font-size: .88rem; }
    .ico { flex-shrink: 0; width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: var(--crema-2); color: var(--cereza); }
    @media (max-width: 960px) { .layout { grid-template-columns: 1fr; } }
    @media (max-width: 560px) { .info { grid-template-columns: 1fr; } }
  `,
})
export class Contact {
  private fb = inject(FormBuilder);
  protected readonly sent = signal(false);
  protected readonly topics = [
    { id: 'pedido', label: 'Mi pedido', icon: 'truck' },
    { id: 'mayorista', label: 'Mayoristas', icon: 'cup' },
    { id: 'experiencias', label: 'Experiencias', icon: 'calendar' },
    { id: 'otro', label: 'Otro', icon: 'mail' },
  ];
  protected readonly info = [
    { icon: 'pin', title: 'Tostadería', text: 'Cra. 5 # 12-40, Neiva, Huila' },
    { icon: 'clock', title: 'Horario', text: 'Lun a sáb · 8 a. m. – 7 p. m.' },
    { icon: 'whatsapp', title: 'WhatsApp', text: '+57 310 555 0142' },
    { icon: 'mail', title: 'Correo', text: 'hola@cumbrecafe.co' },
  ];
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    topic: ['pedido'],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue],
  });

  bad(n: keyof typeof this.form.controls) {
    const c = this.form.controls[n];
    return c.invalid && (c.touched || c.dirty);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sent.set(true);
    this.form.reset();
  }
}
