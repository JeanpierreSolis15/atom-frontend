import { AbstractControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

export class FormUtils {
  static markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  static getErrorMessage(control: AbstractControl | null, translateService?: TranslateService): string {
    if (!control?.errors || !control.touched) {
      return "";
    }

    if (translateService) {
      if (control.errors["required"]) {
        return translateService.instant("VALIDATION.REQUIRED");
      }
      if (control.errors["minlength"]) {
        return translateService.instant("VALIDATION.MIN_LENGTH", { 0: control.errors["minlength"].requiredLength });
      }
      if (control.errors["maxlength"]) {
        return translateService.instant("VALIDATION.MAX_LENGTH", { 0: control.errors["maxlength"].requiredLength });
      }
      if (control.errors["email"]) {
        return translateService.instant("VALIDATION.EMAIL_INVALID");
      }
    } else {
      if (control.errors["required"]) {
        return "Este campo es requerido";
      }
      if (control.errors["minlength"]) {
        return `Mínimo ${control.errors["minlength"].requiredLength} caracteres`;
      }
      if (control.errors["maxlength"]) {
        return `Máximo ${control.errors["maxlength"].requiredLength} caracteres`;
      }
      if (control.errors["email"]) {
        return "Correo electrónico inválido";
      }
    }

    return "";
  }
}
