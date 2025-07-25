import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthFormFieldComponent } from "@auth/components/auth-form-field/auth-form-field.component";
import { AuthSubmitButtonComponent } from "@auth/components/auth-submit-button/auth-submit-button.component";
import { BrandSectionComponent } from "@auth/components/brand-section/brand-section.component";
import { RegisterRequest } from "@auth/domain/repositories/user-repository.interface";
import { RegisterPresenter } from "@auth/presentation/presenters/register.presenter";
import { RegisterViewModel } from "@auth/presentation/view-models/register.view-model";
import { RegisterView } from "@auth/presentation/views/register.view.interface";
import { TranslateModule } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-register",
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
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy, RegisterView {
  registerForm!: FormGroup;
  viewModel: RegisterViewModel = {
    loading: false,
    formValid: false,
    errorMessage: "",
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private registerPresenter: RegisterPresenter,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupFormValidation();
    this.prefillEmailFromQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get nameControl(): FormControl {
    return this.registerForm.get("name") as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.registerForm.get("lastName") as FormControl;
  }

  get emailControl(): FormControl {
    return this.registerForm.get("email") as FormControl;
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  private setupFormValidation(): void {
    this.registerForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.viewModel.formValid = this.registerForm.valid;
      this.cdr.markForCheck();
    });
  }

  private prefillEmailFromQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params["email"]) {
        this.prefillEmail(params["email"]);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const userData: RegisterRequest = this.registerForm.value;
      await this.registerPresenter.register(this, userData);
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

  navigateToKanban(): void {
    this.router.navigate(["/kanban"]);
  }

  updateFormValidity(isValid: boolean): void {
    this.viewModel.formValid = isValid;
    this.cdr.markForCheck();
  }

  prefillEmail(email: string): void {
    this.registerForm.patchValue({ email });
    this.cdr.markForCheck();
  }
}
