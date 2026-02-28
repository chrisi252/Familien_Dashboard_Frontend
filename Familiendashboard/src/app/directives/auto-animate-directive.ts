import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import autoAnimate from '@formkit/auto-animate';

@Directive({
  selector: '[appAutoAnimate]',
  standalone: true
})
export class AutoAnimateDirective implements OnInit {
private el = inject(ElementRef);

  ngOnInit() {
    autoAnimate(this.el.nativeElement, {
      duration: 300,
      easing: 'ease-in-out'
    });
  }
  constructor(elementRef: ElementRef) {
    }

}
