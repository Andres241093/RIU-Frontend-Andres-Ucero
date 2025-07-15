import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercaseDirective]',
})
export class UppercaseDirective {
  // FormControlName directive extends from NgControl
  private ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();

    // Update FormControl without trigger event
    if (this.ngControl.control && this.ngControl.control.value !== upperValue) {
      this.ngControl.control.setValue(upperValue, { emitEvent: false });
    }

    // Set value to input, for show uppercase in first edit view render
    input.value = upperValue;
  }
}
