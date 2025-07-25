import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { NotificationService } from "../../../../core/services/notification.service";
import { FormUtils } from "../../../../core/utils/form.utils";
import { AuthFormFieldComponent } from "../../components/auth-form-field/auth-form-field.component";
import { AuthSubmitButtonComponent } from "../../components/auth-submit-button/auth-submit-button.component";
import { BrandSectionComponent } from "../../components/brand-section/brand-section.component";
import { LoginRequest } from "../../interfaces/auth.interface";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
    BrandSectionComponent,
    AuthFormFieldComponent,
    AuthSubmitButtonComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  emailControl!: FormControl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.emailControl = this.loginForm.get("email") as FormControl;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: () => {
          this.notificationService.showSuccess(this.translateService.instant("AUTH.WELCOME_BACK"));
          this.router.navigate(["/kanban"]);
        },
        error: error => {
          this.loading = false;

          if (error.type === "USER_NOT_FOUND") {
            this.router.navigate(["/auth/register"], {
              queryParams: { email: error.email },
            });
          } else {
            this.notificationService.showError(this.translateService.instant("AUTH.LOGIN_ERROR"));
          }
        },
      });
    } else {
      FormUtils.markFormGroupTouched(this.loginForm);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    return FormUtils.getErrorMessage(control, this.translateService);
  }
}
