import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { NotificationService } from "../../../../core/services/notification.service";
import { FormUtils } from "../../../../core/utils/form.utils";
import { AuthFormFieldComponent } from "../../components/auth-form-field/auth-form-field.component";
import { AuthSubmitButtonComponent } from "../../components/auth-submit-button/auth-submit-button.component";
import { BrandSectionComponent } from "../../components/brand-section/brand-section.component";
import { RegisterRequest } from "../../interfaces/auth.interface";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
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
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  isAutoRegister = false;
  nameControl!: FormControl;
  lastNameControl!: FormControl;
  emailControl!: FormControl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkAutoRegister();
    this.setupControls();
  }

  private setupControls(): void {
    this.nameControl = this.registerForm.get("name") as FormControl;
    this.lastNameControl = this.registerForm.get("lastName") as FormControl;
    this.emailControl = this.registerForm.get("email") as FormControl;
  }

  private checkAutoRegister(): void {
    this.route.queryParams.subscribe(params => {
      if (params["email"]) {
        this.isAutoRegister = true;
        this.registerForm.patchValue({ email: params["email"] });
        this.notificationService.showInfo("AUTH.COMPLETE_REGISTRATION");
      }
    });
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;

      const { name, lastName, email } = this.registerForm.value;
      const userData: RegisterRequest = {
        name,
        lastName,
        email,
      };

      const registerObservable = this.isAutoRegister
        ? this.authService.registerAndLogin(userData)
        : this.authService.register(userData);

      registerObservable.subscribe({
        next: () => {
          if (this.isAutoRegister) {
            this.notificationService.showSuccess("AUTH.ACCOUNT_CREATED_AND_LOGGED");
            this.router.navigate(["/kanban"]);
          } else {
            this.notificationService.showSuccess(this.translateService.instant("AUTH.ACCOUNT_CREATED"));
            this.router.navigate(["/auth/login"]);
          }
        },
        error: () => {
          this.loading = false;
          this.notificationService.showError(this.translateService.instant("AUTH.REGISTER_ERROR"));
        },
      });
    } else {
      FormUtils.markFormGroupTouched(this.registerForm);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    return FormUtils.getErrorMessage(control, this.translateService);
  }
}
