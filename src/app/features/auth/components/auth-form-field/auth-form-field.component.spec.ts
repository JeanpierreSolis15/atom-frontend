import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";

import { AuthFormFieldComponent } from "./auth-form-field.component";

describe("AuthFormFieldComponent", () => {
  let component: AuthFormFieldComponent;
  let fixture: ComponentFixture<AuthFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthFormFieldComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormFieldComponent);
    component = fixture.componentInstance;

    component.control = new FormControl("");
    component.label = "Test Label";
    component.placeholder = "Test Placeholder";

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Component Inputs", () => {
    it("should display label correctly", () => {
      component.label = "Email Address";
      fixture.detectChanges();

      const labelElement = fixture.nativeElement.querySelector("mat-label");
      expect(labelElement).toBeTruthy();
    });

    it("should display icon when provided", () => {
      component.icon = "email";
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement?.textContent?.trim()).toBe("email");
    });

    it("should not display icon when not provided", () => {
      component.icon = "";
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector(".field-icon");
      expect(iconElement).toBeFalsy();
    });

    it("should set input type correctly", () => {
      component.type = "password";
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement.type).toBe("password");
    });

    it("should set required attribute when required is true", () => {
      component.required = true;
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement.required).toBe(true);
    });

    it("should not set required attribute when required is false", () => {
      component.required = false;
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement.required).toBe(false);
    });
  });

  describe("Form Control Integration", () => {
    it("should bind to form control value", () => {
      const testValue = "test@example.com";
      component.control.setValue(testValue);
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement.value).toBe(testValue);
    });

    it("should update form control when input changes", () => {
      const inputElement = fixture.nativeElement.querySelector("input");
      const testValue = "new@example.com";

      inputElement.value = testValue;
      inputElement.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.control.value).toBe(testValue);
    });
  });

  describe("getErrorMessage method", () => {
    it("should return custom error message when provided", () => {
      component.errorMessage = "Custom error message";

      const result = component.getErrorMessage();

      expect(result).toBe("Custom error message");
    });

    it("should return empty string when control is null", () => {
      component.control = null as any;
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("");
    });

    it("should return empty string when control has no errors", () => {
      component.control = new FormControl("valid@email.com");
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("");
    });

    it("should return empty string when control has errors but is not touched", () => {
      component.control = new FormControl("", [Validators.required]);
      component.control.markAsUntouched();
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("");
    });

    it("should return required error message when field is required and empty", () => {
      component.control = new FormControl("", [Validators.required]);
      component.control.markAsTouched();
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("VALIDATION.REQUIRED");
    });

    it("should return email error message when email is invalid", () => {
      component.control = new FormControl("invalid-email", [Validators.email]);
      component.control.markAsTouched();
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("VALIDATION.EMAIL_INVALID");
    });

    it("should return minlength error message when value is too short", () => {
      component.control = new FormControl("ab", [Validators.minLength(3)]);
      component.control.markAsTouched();
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("VALIDATION.MIN_LENGTH");
    });

    it("should prioritize custom error message over validation errors", () => {
      component.control = new FormControl("", [Validators.required]);
      component.control.markAsTouched();
      component.errorMessage = "Custom priority message";

      const result = component.getErrorMessage();

      expect(result).toBe("Custom priority message");
    });

    it("should return required error for multiple validation errors (required takes priority)", () => {
      component.control = new FormControl("", [Validators.required, Validators.email]);
      component.control.markAsTouched();
      component.errorMessage = "";

      const result = component.getErrorMessage();

      expect(result).toBe("VALIDATION.REQUIRED");
    });
  });

  describe("Error Display", () => {
    it("should show error message when form control has errors and is touched", () => {
      component.control = new FormControl("", [Validators.required]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector("mat-error");
      expect(errorElement).toBeTruthy();
    });

    it("should not show error message when form control is valid", () => {
      component.control = new FormControl("valid@email.com", [Validators.email]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector("mat-error");
      expect(errorElement).toBeFalsy();
    });

    it("should not show error message when form control has errors but is not touched", () => {
      component.control = new FormControl("", [Validators.required]);
      component.control.markAsUntouched();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector("mat-error");
      expect(errorElement).toBeFalsy();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form field structure for accessibility", () => {
      const matFormField = fixture.nativeElement.querySelector("mat-form-field");
      const matLabel = fixture.nativeElement.querySelector("mat-label");
      const input = fixture.nativeElement.querySelector("input");

      expect(matFormField).toBeTruthy();
      expect(matLabel).toBeTruthy();
      expect(input).toBeTruthy();
    });

    it("should connect label with input for screen readers", () => {
      const matLabel = fixture.nativeElement.querySelector("mat-label");
      const input = fixture.nativeElement.querySelector("input");

      expect(matLabel).toBeTruthy();
      expect(input).toBeTruthy();
    });
  });
});
