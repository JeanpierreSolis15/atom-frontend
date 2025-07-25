import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-auth-form-field",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, TranslateModule],
  templateUrl: "./auth-form-field.component.html",
  styleUrls: ["./auth-form-field.component.scss"],
})
export class AuthFormFieldComponent {
  @Input() control!: FormControl;
  @Input() label = "";
  @Input() placeholder = "";
  @Input() icon = "";
  @Input() type = "text";
  @Input() required = false;
  @Input() errorMessage = "";

  getErrorMessage(): string {
    if (this.errorMessage) {
      return this.errorMessage;
    }

    if (this.control?.errors && this.control?.touched) {
      if (this.control.errors["required"]) {
        return "VALIDATION.REQUIRED";
      }
      if (this.control.errors["email"]) {
        return "VALIDATION.EMAIL_INVALID";
      }
      if (this.control.errors["minlength"]) {
        return `VALIDATION.MIN_LENGTH`;
      }
    }
    return "";
  }
}
