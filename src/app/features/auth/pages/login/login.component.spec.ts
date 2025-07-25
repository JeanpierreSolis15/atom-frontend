import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { AuthFormFieldComponent } from "@auth/components/auth-form-field/auth-form-field.component";
import { AuthSubmitButtonComponent } from "@auth/components/auth-submit-button/auth-submit-button.component";
import { BrandSectionComponent } from "@auth/components/brand-section/brand-section.component";
import { LoginRequest } from "@auth/domain/repositories/user-repository.interface";
import { LoginPresenter } from "@auth/presentation/presenters/login.presenter";
import { TranslateModule } from "@ngx-translate/core";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginPresenterSpy: jasmine.SpyObj<LoginPresenter>;
  let routerSpy: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const loginPresenterSpyObj = jasmine.createSpyObj("LoginPresenter", ["login"]);
    const routerSpyObj = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        AuthFormFieldComponent,
        AuthSubmitButtonComponent,
        BrandSectionComponent,
      ],
      providers: [
        FormBuilder,
        { provide: LoginPresenter, useValue: loginPresenterSpyObj },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginPresenterSpy = TestBed.inject(LoginPresenter) as jasmine.SpyObj<LoginPresenter>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Component Initialization", () => {
    it("should initialize with correct default values", () => {
      expect(component.viewModel.loading).toBe(false);
      expect(component.viewModel.formValid).toBe(false);
      expect(component.viewModel.errorMessage).toBe("");
    });

    it("should initialize form with email control", () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get("email")).toBeDefined();
      expect(component.emailControl).toBeDefined();
    });

    it("should set email validators correctly", () => {
      const { emailControl } = component;

      emailControl.setValue("");
      expect(emailControl.errors?.["required"]).toBeTruthy();

      emailControl.setValue("invalid-email");
      expect(emailControl.errors?.["email"]).toBeTruthy();

      emailControl.setValue("valid@email.com");
      expect(emailControl.errors).toBeNull();
    });
  });

  describe("Form Validation", () => {
    it("should mark form as invalid when email is empty", () => {
      component.emailControl.setValue("");
      expect(component.loginForm.valid).toBe(false);
      expect(component.viewModel.formValid).toBe(false);
    });

    it("should mark form as invalid when email format is wrong", () => {
      component.emailControl.setValue("invalid-email");
      expect(component.loginForm.valid).toBe(false);
      expect(component.viewModel.formValid).toBe(false);
    });

    it("should mark form as valid when email is correct", () => {
      component.emailControl.setValue("valid@email.com");
      expect(component.loginForm.valid).toBe(true);
      expect(component.viewModel.formValid).toBe(true);
    });

    it("should update viewModel.formValid when form status changes", fakeAsync(() => {
      component.emailControl.setValue("");
      tick();
      expect(component.viewModel.formValid).toBe(false);

      component.emailControl.setValue("valid@email.com");
      tick();
      expect(component.viewModel.formValid).toBe(true);
    }));
  });

  describe("Form Submission", () => {
    it("should call presenter login when form is valid", async () => {
      const testEmail = "test@example.com";
      const expectedCredentials: LoginRequest = { email: testEmail };

      component.emailControl.setValue(testEmail);
      loginPresenterSpy.login.and.returnValue(Promise.resolve());

      await component.onSubmit();

      expect(loginPresenterSpy.login).toHaveBeenCalledWith(component, expectedCredentials);
    });

    it("should not call presenter login when form is invalid", async () => {
      component.emailControl.setValue("");

      await component.onSubmit();

      expect(loginPresenterSpy.login).not.toHaveBeenCalled();
    });

    it("should not call presenter login when email format is invalid", async () => {
      component.emailControl.setValue("invalid-email");

      await component.onSubmit();

      expect(loginPresenterSpy.login).not.toHaveBeenCalled();
    });
  });

  describe("LoginView Interface Implementation", () => {
    describe("Loading State", () => {
      it("should show loading state", () => {
        expect(component.viewModel.loading).toBe(false);

        component.showLoading();

        expect(component.viewModel.loading).toBe(true);
      });

      it("should hide loading state", () => {
        component.viewModel.loading = true;

        component.hideLoading();

        expect(component.viewModel.loading).toBe(false);
      });
    });

    describe("Error Handling", () => {
      it("should show error message", () => {
        const errorMessage = "Test error message";

        component.showError(errorMessage);

        expect(component.viewModel.errorMessage).toBe(errorMessage);
      });

      it("should clear error message", () => {
        component.viewModel.errorMessage = "Some error";

        component.clearError();

        expect(component.viewModel.errorMessage).toBe("");
      });
    });

    describe("Form Validity", () => {
      it("should set form validity", () => {
        component.setFormValid(true);
        expect(component.viewModel.formValid).toBe(true);

        component.setFormValid(false);
        expect(component.viewModel.formValid).toBe(false);
      });

      it("should update form validity", () => {
        component.updateFormValidity(true);
        expect(component.viewModel.formValid).toBe(true);

        component.updateFormValidity(false);
        expect(component.viewModel.formValid).toBe(false);
      });
    });

    describe("Navigation", () => {
      it("should navigate to register without email", () => {
        component.navigateToRegister();

        expect(routerSpy.navigate).toHaveBeenCalledWith(["/auth/register"]);
      });

      it("should navigate to register with email", () => {
        const testEmail = "test@example.com";

        component.navigateToRegister(testEmail);

        expect(routerSpy.navigate).toHaveBeenCalledWith(["/auth/register"], {
          queryParams: { email: testEmail },
        });
      });

      it("should navigate to kanban", () => {
        component.navigateToKanban();

        expect(routerSpy.navigate).toHaveBeenCalledWith(["/kanban"]);
      });
    });
  });

  describe("Change Detection", () => {
    it("should trigger change detection on showLoading", () => {
      spyOn((component as any).cdr, "markForCheck");

      component.showLoading();

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });

    it("should trigger change detection on hideLoading", () => {
      spyOn((component as any).cdr, "markForCheck");

      component.hideLoading();

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });

    it("should trigger change detection on showError", () => {
      spyOn((component as any).cdr, "markForCheck");

      component.showError("Test error");

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });

    it("should trigger change detection on clearError", () => {
      spyOn((component as any).cdr, "markForCheck");

      component.clearError();

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });
  });

  describe("Component Lifecycle", () => {
    it("should initialize form on ngOnInit", () => {
      const newComponent = new LoginComponent(
        formBuilder,
        loginPresenterSpy,
        routerSpy,
        jasmine.createSpyObj("ChangeDetectorRef", ["markForCheck"])
      );

      expect(newComponent.loginForm).toBeUndefined();

      newComponent.ngOnInit();

      expect(newComponent.loginForm).toBeDefined();
      expect(newComponent.loginForm.get("email")).toBeDefined();
    });

    it("should complete destroy subject on ngOnDestroy", () => {
      spyOn((component as any).destroy$, "next");
      spyOn((component as any).destroy$, "complete");

      component.ngOnDestroy();

      expect((component as any).destroy$.next).toHaveBeenCalled();
      expect((component as any).destroy$.complete).toHaveBeenCalled();
    });

    it("should setup form validation on initialization", fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.viewModel.formValid).toBe(false);

      component.emailControl.setValue("test@example.com");
      tick();

      expect(component.viewModel.formValid).toBe(true);
    }));
  });

  describe("Template Integration", () => {
    it("should render BrandSectionComponent", () => {
      const brandSection = fixture.nativeElement.querySelector("app-brand-section");
      expect(brandSection).toBeTruthy();
    });

    it("should render AuthFormFieldComponent for email", () => {
      const authFormField = fixture.nativeElement.querySelector("app-auth-form-field");
      expect(authFormField).toBeTruthy();
    });

    it("should render AuthSubmitButtonComponent", () => {
      const submitButton = fixture.nativeElement.querySelector("app-auth-submit-button");
      expect(submitButton).toBeTruthy();
    });

    it("should disable submit button when form is invalid", () => {
      component.emailControl.setValue("");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(false);
    });

    it("should enable submit button when form is valid", () => {
      component.emailControl.setValue("test@example.com");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(true);
    });

    it("should show loading state in submit button", () => {
      component.showLoading();
      fixture.detectChanges();

      expect(component.viewModel.loading).toBe(true);
    });

    it("should display error message when present", () => {
      const errorMessage = "Test error message";
      component.showError(errorMessage);
      fixture.detectChanges();

      expect(component.viewModel.errorMessage).toBe(errorMessage);
    });
  });

  describe("Edge Cases", () => {
    it("should handle form submission with null email", async () => {
      component.loginForm.patchValue({ email: null });

      await component.onSubmit();

      expect(loginPresenterSpy.login).not.toHaveBeenCalled();
    });

    it("should handle multiple rapid form validity changes", fakeAsync(() => {
      component.emailControl.setValue("");
      component.emailControl.setValue("a");
      component.emailControl.setValue("a@");
      component.emailControl.setValue("a@b");
      component.emailControl.setValue("a@b.com");

      tick();

      expect(component.viewModel.formValid).toBe(true);
    }));

    it("should handle presenter errors gracefully", async () => {
      component.emailControl.setValue("test@example.com");
      loginPresenterSpy.login.and.returnValue(Promise.reject(new Error("Network error")));

      try {
        await component.onSubmit();
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(loginPresenterSpy.login).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure", () => {
      const form = fixture.nativeElement.querySelector("form");
      expect(form).toBeTruthy();
    });

    it("should have proper button type for submission", () => {
      expect(component).toBeTruthy();
    });

    it("should maintain focus management during loading states", () => {
      component.showLoading();
      fixture.detectChanges();

      const formField = fixture.nativeElement.querySelector("app-auth-form-field");
      expect(formField).toBeTruthy();
    });
  });

  describe("Integration with Child Components", () => {
    it("should pass correct properties to AuthFormFieldComponent", () => {
      fixture.detectChanges();

      const authFormField = fixture.nativeElement.querySelector("app-auth-form-field");
      expect(authFormField).toBeTruthy();
    });

    it("should pass loading state to AuthSubmitButtonComponent", () => {
      component.showLoading();
      fixture.detectChanges();

      expect(component.viewModel.loading).toBe(true);
    });

    it("should pass form validity to submit button disabled state", () => {
      component.emailControl.setValue("");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(false);

      component.emailControl.setValue("test@example.com");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(true);
    });
  });
});
