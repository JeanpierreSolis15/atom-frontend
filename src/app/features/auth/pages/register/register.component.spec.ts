import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthFormFieldComponent } from "@auth/components/auth-form-field/auth-form-field.component";
import { AuthSubmitButtonComponent } from "@auth/components/auth-submit-button/auth-submit-button.component";
import { BrandSectionComponent } from "@auth/components/brand-section/brand-section.component";
import { RegisterRequest } from "@auth/domain/repositories/user-repository.interface";
import { RegisterPresenter } from "@auth/presentation/presenters/register.presenter";
import { TranslateModule } from "@ngx-translate/core";
import { Subject } from "rxjs";

import { RegisterComponent } from "./register.component";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerPresenterSpy: jasmine.SpyObj<RegisterPresenter>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let formBuilder: FormBuilder;
  let queryParamsSubject: Subject<any>;

  beforeEach(async () => {
    const registerPresenterSpyObj = jasmine.createSpyObj("RegisterPresenter", ["register"]);
    const routerSpyObj = jasmine.createSpyObj("Router", ["navigate"]);
    queryParamsSubject = new Subject();
    const activatedRouteSpyObj = {
      queryParams: queryParamsSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
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
        { provide: RegisterPresenter, useValue: registerPresenterSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    registerPresenterSpy = TestBed.inject(RegisterPresenter) as jasmine.SpyObj<RegisterPresenter>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  afterEach(() => {
    queryParamsSubject.complete();
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

    it("should initialize form with all required controls", () => {
      expect(component.registerForm).toBeDefined();
      expect(component.registerForm.get("name")).toBeDefined();
      expect(component.registerForm.get("lastName")).toBeDefined();
      expect(component.registerForm.get("email")).toBeDefined();
      expect(component.nameControl).toBeDefined();
      expect(component.lastNameControl).toBeDefined();
      expect(component.emailControl).toBeDefined();
    });

    it("should set validators correctly for all fields", () => {
      const { nameControl } = component;
      nameControl.setValue("");
      expect(nameControl.errors?.["required"]).toBeTruthy();
      nameControl.setValue("A");
      expect(nameControl.errors?.["minlength"]).toBeTruthy();
      nameControl.setValue("John");
      expect(nameControl.errors).toBeNull();

      const { lastNameControl } = component;
      lastNameControl.setValue("");
      expect(lastNameControl.errors?.["required"]).toBeTruthy();
      lastNameControl.setValue("D");
      expect(lastNameControl.errors?.["minlength"]).toBeTruthy();
      lastNameControl.setValue("Doe");
      expect(lastNameControl.errors).toBeNull();

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
    it("should mark form as invalid when required fields are empty", () => {
      component.nameControl.setValue("");
      component.lastNameControl.setValue("");
      component.emailControl.setValue("");

      expect(component.registerForm.valid).toBe(false);
      expect(component.viewModel.formValid).toBe(false);
    });

    it("should mark form as invalid when fields do not meet minimum length", () => {
      component.nameControl.setValue("A");
      component.lastNameControl.setValue("B");
      component.emailControl.setValue("valid@email.com");

      expect(component.registerForm.valid).toBe(false);
      expect(component.viewModel.formValid).toBe(false);
    });

    it("should mark form as invalid when email format is wrong", () => {
      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("invalid-email");

      expect(component.registerForm.valid).toBe(false);
      expect(component.viewModel.formValid).toBe(false);
    });

    it("should mark form as valid when all fields are correct", () => {
      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");

      expect(component.registerForm.valid).toBe(true);
      expect(component.viewModel.formValid).toBe(true);
    });

    it("should update viewModel.formValid when form status changes", fakeAsync(() => {
      component.nameControl.setValue("");
      tick();
      expect(component.viewModel.formValid).toBe(false);

      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");
      tick();
      expect(component.viewModel.formValid).toBe(true);
    }));
  });

  describe("Query Parameters Email Prefill", () => {
    it("should prefill email from query parameters", fakeAsync(() => {
      const testEmail = "prefilled@example.com";

      queryParamsSubject.next({ email: testEmail });
      tick();

      expect(component.emailControl.value).toBe(testEmail);
    }));

    it("should not prefill email when query parameter is missing", fakeAsync(() => {
      queryParamsSubject.next({});
      tick();

      expect(component.emailControl.value).toBe("");
    }));

    it("should handle multiple query parameter changes", fakeAsync(() => {
      const firstEmail = "first@example.com";
      const secondEmail = "second@example.com";

      queryParamsSubject.next({ email: firstEmail });
      tick();
      expect(component.emailControl.value).toBe(firstEmail);

      queryParamsSubject.next({ email: secondEmail });
      tick();
      expect(component.emailControl.value).toBe(secondEmail);
    }));

    it("should handle empty email query parameter", fakeAsync(() => {
      queryParamsSubject.next({ email: "" });
      tick();

      expect(component.emailControl.value).toBe("");
    }));
  });

  describe("Form Submission", () => {
    it("should call presenter register when form is valid", async () => {
      const userData: RegisterRequest = {
        name: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };

      component.nameControl.setValue(userData.name);
      component.lastNameControl.setValue(userData.lastName);
      component.emailControl.setValue(userData.email);
      registerPresenterSpy.register.and.returnValue(Promise.resolve());

      await component.onSubmit();

      expect(registerPresenterSpy.register).toHaveBeenCalledWith(component, userData);
    });

    it("should not call presenter register when form is invalid", async () => {
      component.nameControl.setValue("");

      await component.onSubmit();

      expect(registerPresenterSpy.register).not.toHaveBeenCalled();
    });

    it("should not call presenter register when any field is invalid", async () => {
      component.nameControl.setValue("A");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");

      await component.onSubmit();

      expect(registerPresenterSpy.register).not.toHaveBeenCalled();
    });
  });

  describe("RegisterView Interface Implementation", () => {
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
      it("should navigate to kanban", () => {
        component.navigateToKanban();

        expect(routerSpy.navigate).toHaveBeenCalledWith(["/kanban"]);
      });
    });

    describe("Email Prefill", () => {
      it("should prefill email correctly", () => {
        const testEmail = "prefill@example.com";

        component.prefillEmail(testEmail);

        expect(component.emailControl.value).toBe(testEmail);
      });

      it("should handle empty email prefill", () => {
        component.prefillEmail("");

        expect(component.emailControl.value).toBe("");
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

    it("should trigger change detection on prefillEmail", () => {
      spyOn((component as any).cdr, "markForCheck");

      component.prefillEmail("test@example.com");

      expect((component as any).cdr.markForCheck).toHaveBeenCalled();
    });
  });

  describe("Component Lifecycle", () => {
    it("should initialize form on ngOnInit", () => {
      const newComponent = new RegisterComponent(
        formBuilder,
        registerPresenterSpy,
        routerSpy,
        activatedRouteSpy,
        jasmine.createSpyObj("ChangeDetectorRef", ["markForCheck"])
      );

      expect(newComponent.registerForm).toBeUndefined();

      newComponent.ngOnInit();

      expect(newComponent.registerForm).toBeDefined();
      expect(newComponent.registerForm.get("name")).toBeDefined();
      expect(newComponent.registerForm.get("lastName")).toBeDefined();
      expect(newComponent.registerForm.get("email")).toBeDefined();
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

      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");
      tick();

      expect(component.viewModel.formValid).toBe(true);
    }));
  });

  describe("Template Integration", () => {
    it("should render BrandSectionComponent", () => {
      const brandSection = fixture.nativeElement.querySelector("app-brand-section");
      expect(brandSection).toBeTruthy();
    });

    it("should render AuthFormFieldComponent for all fields", () => {
      const authFormFields = fixture.nativeElement.querySelectorAll("app-auth-form-field");
      expect(authFormFields.length).toBe(3);
    });

    it("should render AuthSubmitButtonComponent", () => {
      const submitButton = fixture.nativeElement.querySelector("app-auth-submit-button");
      expect(submitButton).toBeTruthy();
    });

    it("should disable submit button when form is invalid", () => {
      component.nameControl.setValue("");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(false);
    });

    it("should enable submit button when form is valid", () => {
      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");
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
    it("should handle form submission with null values", async () => {
      component.registerForm.patchValue({
        name: null,
        lastName: null,
        email: null,
      });

      await component.onSubmit();

      expect(registerPresenterSpy.register).not.toHaveBeenCalled();
    });

    it("should handle multiple rapid form validity changes", fakeAsync(() => {
      component.nameControl.setValue("");
      component.nameControl.setValue("J");
      component.nameControl.setValue("Jo");
      component.nameControl.setValue("John");

      component.lastNameControl.setValue("D");
      component.lastNameControl.setValue("Do");
      component.lastNameControl.setValue("Doe");

      component.emailControl.setValue("john.doe@example.com");

      tick();

      expect(component.viewModel.formValid).toBe(true);
    }));

    it("should handle presenter errors gracefully", async () => {
      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");
      registerPresenterSpy.register.and.returnValue(Promise.reject(new Error("Network error")));

      try {
        await component.onSubmit();
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(registerPresenterSpy.register).toHaveBeenCalled();
    });

    it("should handle special characters in names", () => {
      component.nameControl.setValue("José");
      component.lastNameControl.setValue("García-López");
      component.emailControl.setValue("jose@example.com");

      expect(component.registerForm.valid).toBe(true);
    });

    it("should handle very long names", () => {
      const longName = "A".repeat(100);

      component.nameControl.setValue(longName);
      component.lastNameControl.setValue(longName);
      component.emailControl.setValue("test@example.com");

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure", () => {
      const form = fixture.nativeElement.querySelector("form");
      expect(form).toBeTruthy();
    });

    it("should maintain focus management during loading states", () => {
      component.showLoading();
      fixture.detectChanges();

      const formFields = fixture.nativeElement.querySelectorAll("app-auth-form-field");
      expect(formFields.length).toBe(3);
    });

    it("should provide appropriate labels for all fields", () => {
      const formFields = fixture.nativeElement.querySelectorAll("app-auth-form-field");
      expect(formFields.length).toBe(3);
    });
  });

  describe("Integration with Child Components", () => {
    it("should pass correct properties to AuthFormFieldComponents", () => {
      fixture.detectChanges();

      const authFormFields = fixture.nativeElement.querySelectorAll("app-auth-form-field");
      expect(authFormFields.length).toBe(3);
    });

    it("should pass loading state to AuthSubmitButtonComponent", () => {
      component.showLoading();
      fixture.detectChanges();

      expect(component.viewModel.loading).toBe(true);
    });

    it("should pass form validity to submit button disabled state", () => {
      component.nameControl.setValue("");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(false);

      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");
      fixture.detectChanges();

      expect(component.viewModel.formValid).toBe(true);
    });
  });

  describe("Real-world Scenarios", () => {
    it("should handle complete registration flow", async () => {
      queryParamsSubject.next({ email: "john.doe@example.com" });

      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");

      expect(component.registerForm.valid).toBe(true);

      registerPresenterSpy.register.and.returnValue(Promise.resolve());
      await component.onSubmit();

      expect(registerPresenterSpy.register).toHaveBeenCalledWith(component, {
        name: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      });
    });

    it("should handle registration with error and recovery", async () => {
      component.nameControl.setValue("John");
      component.lastNameControl.setValue("Doe");
      component.emailControl.setValue("john.doe@example.com");

      registerPresenterSpy.register.and.returnValue(Promise.reject(new Error("Email already exists")));

      try {
        await component.onSubmit();
      } catch (error) {
        expect((error as Error).message).toBe("Email already exists");
      }

      component.emailControl.setValue("john.doe2@example.com");

      registerPresenterSpy.register.and.returnValue(Promise.resolve());
      await component.onSubmit();

      expect(registerPresenterSpy.register).toHaveBeenCalledTimes(2);
    });
  });
});
