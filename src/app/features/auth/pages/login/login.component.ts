import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { AuthFormFieldComponent } from "@auth/components/auth-form-field/auth-form-field.component";
import { AuthSubmitButtonComponent } from "@auth/components/auth-submit-button/auth-submit-button.component";
import { BrandSectionComponent } from "@auth/components/brand-section/brand-section.component";
import { LoginRequest } from "@auth/domain/repositories/user-repository.interface";
import { LoginPresenter } from "@auth/presentation/presenters/login.presenter";
import { LoginViewModel } from "@auth/presentation/view-models/login.view-model";
import { LoginView } from "@auth/presentation/views/login.view.interface";
import { TranslateModule } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-login",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    BrandSectionComponent,
    AuthFormFieldComponent,
    AuthSubmitButtonComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy, LoginView {
  loginForm!: FormGroup;
  viewModel: LoginViewModel = {
    loading: false,
    formValid: false,
    errorMessage: "",
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loginPresenter: LoginPresenter,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get emailControl(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  private setupFormValidation(): void {
    this.loginForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.viewModel.formValid = this.loginForm.valid;
      this.cdr.markForCheck();
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = this.loginForm.value;
      await this.loginPresenter.login(this, credentials);
    }
  }

  showLoading(): void {
    this.viewModel.loading = true;
    this.cdr.markForCheck();
  }

  hideLoading(): void {
    this.viewModel.loading = false;
    this.cdr.markForCheck();
  }

  showError(message: string): void {
    this.viewModel.errorMessage = message;
    this.cdr.markForCheck();
  }

  clearError(): void {
    this.viewModel.errorMessage = "";
    this.cdr.markForCheck();
  }

  setFormValid(isValid: boolean): void {
    this.viewModel.formValid = isValid;
    this.cdr.markForCheck();
  }

  navigateToRegister(email?: string): void {
    if (email) {
      this.router.navigate(["/auth/register"], { queryParams: { email } });
    } else {
      this.router.navigate(["/auth/register"]);
    }
  }

  navigateToKanban(): void {
    this.router.navigate(["/kanban"]);
  }

  updateFormValidity(isValid: boolean): void {
    this.viewModel.formValid = isValid;
    this.cdr.markForCheck();
  }
}
