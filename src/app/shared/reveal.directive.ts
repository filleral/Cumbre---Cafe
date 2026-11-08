import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/** Anima la aparición de un elemento cuando entra en pantalla. */
@Directive({ selector: '[reveal]', host: { class: 'reveal', '[style.--d]': 'delay() + "ms"' } })
export class RevealDirective implements OnDestroy {
  readonly delay = input(0, { alias: 'reveal', transform: (v: unknown) => Number(v) || 0 });
  private el = inject(ElementRef<HTMLElement>);
  private io?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement as HTMLElement;
      if (!('IntersectionObserver' in window)) {
        node.classList.add('is-visible');
        return;
      }
      this.io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              node.classList.add('is-visible');
              this.io?.disconnect();
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      this.io.observe(node);
    });
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }
}
