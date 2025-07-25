import { TestBed } from "@angular/core/testing";
import { LoginUseCase } from "@auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@auth/application/use-cases/register.use-case";
import { AuthResponse, RegisterRequest } from "@auth/domain/repositories/user-repository.interface";
import { RegisterView } from "@auth/presentation/views/register.view.interface";
import { NotificationService } from "@core/services/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { RegisterPresenter } from "./register.presenter";

describe("RegisterPresenter", () => {
  let presenter: RegisterPresenter;
  let mockRegisterUseCase: jasmine.SpyObj<RegisterUseCase>;
  let mockLoginUseCase: jasmine.SpyObj<LoginUseCase>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockView: jasmine.SpyObj<RegisterView>;

  const mockRegisterRequest: RegisterRequest = {
    name: "Test",
    lastName: "User",
    email: "test@example.com",
  };

  const mockAuthResponse: AuthResponse = {
    user: {
      id: "1",
      name: "Test",
      lastName: "User",
      email: "test@example.com",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
    accessToken: "access-token",
    refreshToken: "refresh-token",
  };

  beforeEach(() => {
    const registerUseCaseSpy = jasmine.createSpyObj("RegisterUseCase", ["execute"]);
    const loginUseCaseSpy = jasmine.createSpyObj("LoginUseCase", ["execute"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showSuccess", "showError"]);
    const translateServiceSpy = jasmine.createSpyObj("TranslateService", ["instant"]);

    mockView = jasmine.createSpyObj("RegisterView", [
      "showError",
      "showLoading",
      "hideLoading",
      "navigateToKanban",
      "clearError",
    ]);

    TestBed.configureTestingModule({
      providers: [
        RegisterPresenter,
        { provide: RegisterUseCase, useValue: registerUseCaseSpy },
        { provide: LoginUseCase, useValue: loginUseCaseSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    });

    presenter = TestBed.inject(RegisterPresenter);
    mockRegisterUseCase = TestBed.inject(RegisterUseCase) as jasmine.SpyObj<RegisterUseCase>;
    mockLoginUseCase = TestBed.inject(LoginUseCase) as jasmine.SpyObj<LoginUseCase>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it("should be created", () => {
    expect(presenter).toBeTruthy();
  });

  describe("register", () => {
    it("should register successfully, login automatically and navigate to kanban", async () => {
      mockRegisterUseCase.execute.and.returnValue(of(mockAuthResponse));
      mockLoginUseCase.execute.and.returnValue(of(mockAuthResponse));
      mockTranslateService.instant.and.returnValue("Cuenta creada y sesión iniciada exitosamente");

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(mockRegisterRequest);
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith({ email: mockRegisterRequest.email });
      expect(mockView.hideLoading).toHaveBeenCalled();
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Cuenta creada y sesión iniciada exitosamente");
      expect(mockView.navigateToKanban).toHaveBeenCalled();
    });

    it("should handle registration error and show error message", async () => {
      const error = new Error("Registration failed");
      mockRegisterUseCase.execute.and.returnValue(throwError(() => error));

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockView.hideLoading).toHaveBeenCalled();
      expect(mockView.showError).toHaveBeenCalledWith("Registration failed");
      expect(mockLoginUseCase.execute).not.toHaveBeenCalled();
      expect(mockView.navigateToKanban).not.toHaveBeenCalled();
    });

    it("should handle login error after successful registration", async () => {
      mockRegisterUseCase.execute.and.returnValue(of(mockAuthResponse));
      const loginError = new Error("Login failed");
      mockLoginUseCase.execute.and.returnValue(throwError(() => loginError));

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockRegisterUseCase.execute).toHaveBeenCalled();
      expect(mockLoginUseCase.execute).toHaveBeenCalled();
      expect(mockView.hideLoading).toHaveBeenCalled();
      expect(mockView.showError).toHaveBeenCalledWith("Login failed");
      expect(mockView.navigateToKanban).not.toHaveBeenCalled();
    });

    it("should handle email already exists error", async () => {
      const emailExistsError = { status: 409, message: "Email already exists" };
      mockRegisterUseCase.execute.and.returnValue(throwError(() => emailExistsError));

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockView.showError).toHaveBeenCalledWith("Email already exists");
    });

    it("should handle network error during registration", async () => {
      const networkError = { status: 0, message: "Network error" };
      mockRegisterUseCase.execute.and.returnValue(throwError(() => networkError));

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockView.showError).toHaveBeenCalledWith("Network error");
    });

    it("should handle error without message", async () => {
      const errorWithoutMessage = { status: 500 };
      mockRegisterUseCase.execute.and.returnValue(throwError(() => errorWithoutMessage));

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockView.showError).toHaveBeenCalledWith("Error al registrar usuario");
    });

    it("should always hide loading even if error occurs", async () => {
      const error = new Error("Unexpected error");
      mockRegisterUseCase.execute.and.returnValue(throwError(() => error));

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockView.hideLoading).toHaveBeenCalled();
    });

    it("should call translation service for success message", async () => {
      mockRegisterUseCase.execute.and.returnValue(of(mockAuthResponse));
      mockLoginUseCase.execute.and.returnValue(of(mockAuthResponse));
      mockTranslateService.instant.and.returnValue("Success message");

      await presenter.register(mockView, mockRegisterRequest);

      expect(mockTranslateService.instant).toHaveBeenCalledWith("AUTH.ACCOUNT_CREATED_AND_LOGGED");
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Success message");
    });
  });
});
