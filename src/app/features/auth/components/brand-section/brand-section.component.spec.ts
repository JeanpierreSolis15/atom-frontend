import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { BrandSectionComponent } from "./brand-section.component";

describe("BrandSectionComponent", () => {
  let component: BrandSectionComponent;
  let fixture: ComponentFixture<BrandSectionComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSectionComponent, MatIconModule, TranslateModule.forRoot(), BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandSectionComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Component Inputs", () => {
    it("should have default input values", () => {
      expect(component.title).toBe("AUTH.BRAND_TITLE");
      expect(component.subtitle).toBe("AUTH.BRAND_SUBTITLE");
      expect(component.icon).toBe("task_alt");
    });

    it("should accept custom title", () => {
      const customTitle = "My Custom Title";
      component.title = customTitle;

      expect(component.title).toBe(customTitle);
    });

    it("should accept custom subtitle", () => {
      const customSubtitle = "My Custom Subtitle";
      component.subtitle = customSubtitle;

      expect(component.subtitle).toBe(customSubtitle);
    });

    it("should accept custom icon", () => {
      const customIcon = "home";
      component.icon = customIcon;

      expect(component.icon).toBe(customIcon);
    });

    it("should accept translation keys as inputs", () => {
      component.title = "CUSTOM.TITLE_KEY";
      component.subtitle = "CUSTOM.SUBTITLE_KEY";

      expect(component.title).toBe("CUSTOM.TITLE_KEY");
      expect(component.subtitle).toBe("CUSTOM.SUBTITLE_KEY");
    });
  });

  describe("Template Rendering", () => {
    it("should render the icon", () => {
      component.icon = "star";
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement).toBeTruthy();
      expect(iconElement.textContent?.trim()).toBe("star");
    });

    it("should render default icon when no icon is provided", () => {
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement).toBeTruthy();
      expect(iconElement.textContent?.trim()).toBe("task_alt");
    });

    it("should render title with translate pipe", () => {
      component.title = "TEST.TITLE";
      fixture.detectChanges();

      expect(component.title).toBe("TEST.TITLE");
      const titleElement = fixture.nativeElement.querySelector(".brand-title");
      expect(titleElement).toBeTruthy();
    });

    it("should render subtitle with translate pipe", () => {
      component.subtitle = "TEST.SUBTITLE";
      fixture.detectChanges();

      expect(component.subtitle).toBe("TEST.SUBTITLE");
      const subtitleElement = fixture.nativeElement.querySelector(".brand-subtitle");
      expect(subtitleElement).toBeTruthy();
    });
  });

  describe("Icon Variations", () => {
    it("should handle material design icons", () => {
      const materialIcons = ["home", "person", "settings", "search", "favorite"];

      materialIcons.forEach(iconName => {
        component.icon = iconName;
        fixture.detectChanges();

        const iconElement = fixture.nativeElement.querySelector("mat-icon");
        expect(iconElement.textContent?.trim()).toBe(iconName);
      });
    });

    it("should handle empty icon string", () => {
      component.icon = "";
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement.textContent?.trim()).toBe("");
    });

    it("should handle special characters in icon name", () => {
      component.icon = "check_circle_outline";
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement.textContent?.trim()).toBe("check_circle_outline");
    });
  });

  describe("Translation Integration", () => {
    it("should use translate pipe for title", () => {
      component.title = "AUTH.LOGIN_TITLE";
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain("AUTH.LOGIN_TITLE");
    });

    it("should use translate pipe for subtitle", () => {
      component.subtitle = "AUTH.LOGIN_SUBTITLE";
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain("AUTH.LOGIN_SUBTITLE");
    });

    it("should handle missing translation keys gracefully", () => {
      component.title = "NON_EXISTENT.KEY";
      component.subtitle = "ANOTHER.NON_EXISTENT.KEY";
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain("NON_EXISTENT.KEY");
    });
  });

  describe("Component Structure", () => {
    it("should have proper component structure", () => {
      fixture.detectChanges();

      const componentElement = fixture.nativeElement;
      expect(componentElement).toBeTruthy();

      const iconElement = componentElement.querySelector("mat-icon");
      expect(iconElement).toBeTruthy();
    });

    it("should maintain component hierarchy", () => {
      fixture.detectChanges();

      const componentElement = fixture.nativeElement;
      expect(componentElement.children.length).toBeGreaterThan(0);
    });
  });

  describe("Input Changes", () => {
    it("should react to title changes", () => {
      const initialTitle = "Initial Title";
      const updatedTitle = "Updated Title";

      component.title = initialTitle;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(initialTitle);

      component.title = updatedTitle;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(updatedTitle);
    });

    it("should react to subtitle changes", () => {
      const initialSubtitle = "Initial Subtitle";
      const updatedSubtitle = "Updated Subtitle";

      component.subtitle = initialSubtitle;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(initialSubtitle);

      component.subtitle = updatedSubtitle;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(updatedSubtitle);
    });

    it("should react to icon changes", () => {
      component.icon = "star";
      fixture.detectChanges();

      let iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement.textContent?.trim()).toBe("star");

      component.icon = "favorite";
      fixture.detectChanges();

      iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement.textContent?.trim()).toBe("favorite");
    });
  });

  describe("Default Values Behavior", () => {
    it("should use default values when component is initialized", () => {
      const newFixture = TestBed.createComponent(BrandSectionComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.title).toBe("AUTH.BRAND_TITLE");
      expect(newComponent.subtitle).toBe("AUTH.BRAND_SUBTITLE");
      expect(newComponent.icon).toBe("task_alt");
    });

    it("should render default values in template", () => {
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector("mat-icon");
      expect(iconElement.textContent?.trim()).toBe("task_alt");
      expect(fixture.nativeElement.textContent).toContain("AUTH.BRAND_TITLE");
      expect(fixture.nativeElement.textContent).toContain("AUTH.BRAND_SUBTITLE");
    });
  });

  describe("Accessibility", () => {
    it("should maintain semantic structure", () => {
      fixture.detectChanges();

      const componentElement = fixture.nativeElement;
      expect(componentElement).toBeTruthy();

      const iconElement = componentElement.querySelector("mat-icon");
      expect(iconElement).toBeTruthy();
    });

    it("should handle screen reader accessibility", () => {
      fixture.detectChanges();

      const textContent = fixture.nativeElement.textContent;
      expect(textContent).toBeTruthy();
      expect(textContent.trim().length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null/undefined values gracefully", () => {
      component.title = null as any;
      component.subtitle = undefined as any;
      component.icon = null as any;

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should handle very long strings", () => {
      const longString = "A".repeat(1000);

      component.title = longString;
      component.subtitle = longString;
      component.icon = "star";

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();

      expect(component.title).toBe(longString);
      expect(component.subtitle).toBe(longString);
    });

    it("should handle special characters in text", () => {
      component.title = "Title with ñ, é, ü special chars & symbols <>";
      component.subtitle = "Subtitle with 中文 characters and émojis 🚀";

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});
