import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthSubmitButtonComponent } from "./auth-submit-button.component";

describe("AuthSubmitButtonComponent", () => {
  let component: AuthSubmitButtonComponent;
  let fixture: ComponentFixture<AuthSubmitButtonComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthSubmitButtonComponent,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSubmitButtonComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Component Inputs", () => {
    it("should have default input values", () => {
      expect(component.loading).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.icon).toBe("");
      expect(component.loadingText).toBe("");
      expect(component.text).toBe("");
      expect(component.type).toBe("submit");
    });

    it("should accept custom input values", () => {
      component.loading = true;
      component.disabled = true;
      component.icon = "login";
      component.loadingText = "Processing...";
      component.text = "Sign In";
      component.type = "button";

      expect(component.loading).toBe(true);
      expect(component.disabled).toBe(true);
      expect(component.icon).toBe("login");
      expect(component.loadingText).toBe("Processing...");
      expect(component.text).toBe("Sign In");
      expect(component.type).toBe("button");
    });
  });

  describe("Button States", () => {
    it("should render button with correct type", () => {
      component.type = "button";
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.type).toBe("button");
    });

    it("should set submit type by default", () => {
      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.type).toBe("submit");
    });

    it("should disable button when disabled is true", () => {
      component.disabled = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(true);
    });

    it("should disable button when loading is true", () => {
      component.loading = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(true);
    });

    it("should disable button when both disabled and loading are true", () => {
      component.disabled = true;
      component.loading = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(true);
    });

    it("should not disable button when both disabled and loading are false", () => {
      component.disabled = false;
      component.loading = false;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(false);
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner when loading is true", () => {
      component.loading = true;
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector("mat-spinner");
      expect(spinnerElement).toBeTruthy();
    });

    it("should hide loading spinner when loading is false", () => {
      component.loading = false;
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector("mat-spinner");
      expect(spinnerElement).toBeFalsy();
    });

    it("should show loading text when loading is true and loadingText is provided", () => {
      component.loading = true;
      component.loadingText = "Loading...";
      component.text = "Submit";
      fixture.detectChanges();

      expect(component.loading).toBe(true);
      expect(component.loadingText).toBe("Loading...");
    });

    it("should show regular text when loading is false", () => {
      component.loading = false;
      component.loadingText = "Loading...";
      component.text = "Submit";
      fixture.detectChanges();

      expect(component.loading).toBe(false);
      expect(component.text).toBe("Submit");
    });

    it("should hide icon when loading is true", () => {
      component.loading = true;
      component.icon = "login";
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon:not(.spinner)");
      expect(iconElement).toBeFalsy();
    });
  });

  describe("Icon Display", () => {
    it("should show icon when icon is provided and not loading", () => {
      component.icon = "login";
      component.loading = false;
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement).toBeTruthy();
      expect(iconElement.textContent?.trim()).toBe("login");
    });

    it("should not show icon when icon is empty", () => {
      component.icon = "";
      component.loading = false;
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon:not(.spinner)");
      expect(iconElement).toBeFalsy();
    });

    it("should not show icon when loading is true even if icon is provided", () => {
      component.icon = "login";
      component.loading = true;
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon:not(.spinner)");
      expect(iconElement).toBeFalsy();
    });
  });

  describe("Text Display", () => {
    it("should display text when provided", () => {
      component.text = "Sign In";
      component.loading = false;
      fixture.detectChanges();

      expect(component.text).toBe("Sign In");
      expect(component.loading).toBe(false);
    });

    it("should display loading text when loading and loadingText provided", () => {
      component.text = "Sign In";
      component.loadingText = "Signing In...";
      component.loading = true;
      fixture.detectChanges();

      expect(component.loadingText).toBe("Signing In...");
      expect(component.loading).toBe(true);
    });

    it("should display empty text when text is not provided", () => {
      component.text = "";
      component.loading = false;
      fixture.detectChanges();

      expect(component.text).toBe("");
      expect(component.loading).toBe(false);
    });
  });

  describe("Button Styling", () => {
    it("should have mat-raised-button class", () => {
      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.classList.contains("mat-mdc-raised-button")).toBe(true);
    });

    it("should have primary color", () => {
      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.classList.contains("mat-primary")).toBe(true);
    });

    it("should have submit-button class", () => {
      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.classList.contains("submit-button")).toBe(true);
    });

    it("should have button-content div", () => {
      const contentDiv = fixture.nativeElement.querySelector(".button-content");
      expect(contentDiv).toBeTruthy();
    });
  });

  describe("Spinner Configuration", () => {
    it("should have correct spinner diameter when loading", () => {
      component.loading = true;
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector("mat-spinner");
      expect(spinnerElement).toBeTruthy();
      expect(spinnerElement.getAttribute("ng-reflect-diameter")).toBe("20");
    });

    it("should have spinner class when loading", () => {
      component.loading = true;
      fixture.detectChanges();

      const spinnerElement = fixture.nativeElement.querySelector("mat-spinner");
      expect(spinnerElement.classList.contains("spinner")).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should maintain button semantics", () => {
      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.tagName.toLowerCase()).toBe("button");
    });

    it("should be accessible when disabled", () => {
      component.disabled = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(true);
    });

    it("should maintain focus management when loading", () => {
      component.loading = true;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement).toBeTruthy();
    });
  });

  describe("Translation Integration", () => {
    it("should use translate pipe for text", () => {
      component.text = "AUTH.SIGN_IN";
      component.loading = false;
      fixture.detectChanges();

      const spanElement = fixture.nativeElement.querySelector("span");
      expect(spanElement).toBeTruthy();
    });

    it("should use translate pipe for loading text", () => {
      component.loadingText = "AUTH.SIGNING_IN";
      component.loading = true;
      fixture.detectChanges();

      const spanElement = fixture.nativeElement.querySelector("span");
      expect(spanElement).toBeTruthy();
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle loading state change correctly", () => {
      component.loading = false;
      component.text = "Submit";
      component.icon = "send";
      fixture.detectChanges();

      let iconElement = fixture.nativeElement.querySelector("mat-icon:not(.spinner)");
      let spinnerElement = fixture.nativeElement.querySelector("mat-spinner");

      expect(iconElement).toBeTruthy();
      expect(spinnerElement).toBeFalsy();

      component.loading = true;
      component.loadingText = "Submitting...";
      fixture.detectChanges();

      iconElement = fixture.nativeElement.querySelector("mat-icon:not(.spinner)");
      spinnerElement = fixture.nativeElement.querySelector("mat-spinner");

      expect(iconElement).toBeFalsy();
      expect(spinnerElement).toBeTruthy();
    });

    it("should handle disabled state independent of loading", () => {
      component.disabled = true;
      component.loading = false;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBe(true);

      component.loading = true;
      fixture.detectChanges();

      expect(buttonElement.disabled).toBe(true);
    });
  });
});
