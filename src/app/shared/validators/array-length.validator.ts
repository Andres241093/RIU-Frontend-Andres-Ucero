import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxArrayLength(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (Array.isArray(value) && value.length > max) {
      return {
        maxArrayLength: { requiredLength: max, actualLength: value.length },
      };
    }
    return null;
  };
}
