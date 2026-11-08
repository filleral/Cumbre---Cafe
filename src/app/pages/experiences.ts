import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EXPERIENCES } from '../core/data';
import { SceneArt } from '../shared/scene-art';
import { Icon } from '../shared/icon';
import { CopPipe } from '../shared/cop.pipe';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-experiences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SceneArt, Icon, CopPipe, ReactiveFormsModule, RevealDirective, RouterLink],
  templateUrl: './experiences.html',
  styleUrl: './experiences.scss',
})
export class Experiences {
  protected readonly list = EXPERIENCES;
  protected readonly sent = signal<string | null>(null);
  private fb = inject(FormBuilder);

  protected readonly today = new Date().toISOString().slice(0, 10);

  protected readonly form = this.fb.nonNullable.group({
    experience: ['cata', Validators.required],
    date: ['', Validators.required],
    people: [2, [Validators.required, Validators.min(1), Validators.max(12)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9 +]{7,15}$/)]],
  });

  private value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly selected = computed(() => EXPERIENCES.find((e) => e.id === this.value().experience) ?? EXPERIENCES[0]);
  protected readonly total = computed(() => this.selected().price * (Number(this.value().people) || 0));

  protected readonly faqs = [
    { q: '¿Necesito saber de café para asistir?', a: 'Para nada. Nuestras experiencias están pensadas para curiosos. Te explicamos todo desde cero.' },
    { q: '¿Puedo reservar para un grupo empresarial?', a: 'Sí. Para grupos de más de 12 personas escríbenos desde la página de contacto y armamos un plan a la medida.' },
    { q: '¿Qué pasa si llueve el día del tour?', a: 'El tour de finca se hace con lluvia o sol (¡así es la vida cafetera!). Si hay alerta climática lo reprogramamos sin costo.' },
    { q: '¿Puedo cancelar mi reserva?', a: 'Puedes cancelar o cambiar la fecha hasta 48 horas antes y te devolvemos el 100 % del valor.' },
  ];

  pick(id: string) {
    this.form.controls.experience.setValue(id);
    document.getElementById('reserva')?.scrollIntoView({ behavior: 'smooth' });
  }

  invalid(name: keyof typeof this.form.controls) {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.sent.set(`${v.name.split(' ')[0]}, tu reserva para «${this.selected().title}» el ${v.date} quedó pre-agendada. Te enviamos la confirmación a ${v.email}.`);
    this.form.reset({ experience: v.experience, people: 2 });
  }
}
