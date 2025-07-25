import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";

import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockInjector: jasmine.SpyObj<Injector>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open", "dismiss"]);
    const injectorSpy = jasmine.createSpyObj("Injector", ["get"]);
    const translateServiceSpy = jasmine.createSpyObj("TranslateService", ["instant"]);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Injector, useValue: injectorSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    mockInjector = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
    mockTranslateService = translateServiceSpy;

    mockInjector.get.and.returnValue(mockTranslateService);
    mockTranslateService.instant.and.returnValue("Translated message");
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("showSuccess", () => {
    it("should show success notification with default parameters", () => {
      const message = "Success message";
      const mockSnackBarRef = jasmine.createSpyObj("MatSnackBarRef", ["onAction"]);
      mockSnackBar.open.and.returnValue(mockSnackBarRef);

      service.showSuccess(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, "Cerrar", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ["success-snackbar"],
      });
    });

    it("should show success notification with custom options", () => {
      const message = "Success message";
      const customOptions = { duration: 5000, horizontalPosition: "right" as const };

      service.showSuccess(message, customOptions);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, "Cerrar", {
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: ["success-snackbar"],
      });
    });

    it("should translate message with dots", () => {
      const message = "COMMON.SUCCESS";

      service.showSuccess(message);

      expect(mockTranslateService.instant).toHaveBeenCalledWith(message);
      expect(mockSnackBar.open).toHaveBeenCalledWith("Translated message", jasmine.any(String), jasmine.any(Object));
    });
  });

  describe("showError", () => {
    it("should show error notification with longer duration", () => {
      const message = "Error message";

      service.showError(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, "Cerrar", {
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ["error-snackbar"],
      });
    });

    it("should override default duration for errors", () => {
      const message = "Error message";
      const customOptions = { duration: 2000 };

      service.showError(message, customOptions);

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        message,
        "Cerrar",
        jasmine.objectContaining({
          duration: 2000,
        })
      );
    });
  });

  describe("showWarning", () => {
    it("should show warning notification with correct duration", () => {
      const message = "Warning message";

      service.showWarning(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, "Cerrar", {
        duration: 4000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ["warning-snackbar"],
      });
    });
  });

  describe("showInfo", () => {
    it("should show info notification with default parameters", () => {
      const message = "Info message";

      service.showInfo(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, "Cerrar", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ["info-snackbar"],
      });
    });
  });

  describe("dismiss", () => {
    it("should dismiss current notification", () => {
      service.dismiss();

      expect(mockSnackBar.dismiss).toHaveBeenCalled();
    });
  });

  describe("translation handling", () => {
    it("should not translate messages without dots", () => {
      const message = "Simple message";

      service.showSuccess(message);

      expect(mockTranslateService.instant).not.toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, jasmine.any(String), jasmine.any(Object));
    });

    it("should handle translation service errors gracefully", () => {
      const message = "COMMON.ERROR";
      mockInjector.get.and.throwError("Translation service not available");

      service.showError(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, jasmine.any(String), jasmine.any(Object));
    });
  });

  describe("integration tests", () => {
    it("should show multiple notifications in sequence", () => {
      service.showSuccess("Success 1");
      service.showError("Error 1");
      service.showInfo("Info 1");

      expect(mockSnackBar.open).toHaveBeenCalledTimes(3);
    });

    it("should handle empty messages", () => {
      service.showSuccess("");

      expect(mockSnackBar.open).toHaveBeenCalledWith("", "Cerrar", jasmine.any(Object));
    });

    it("should handle special characters in messages", () => {
      const specialMessage = "Message with special chars: àáâãäåæçèéêë";

      service.showInfo(specialMessage);

      expect(mockSnackBar.open).toHaveBeenCalledWith(specialMessage, jasmine.any(String), jasmine.any(Object));
    });
  });
});
