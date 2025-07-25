import { TestBed } from "@angular/core/testing";
import { LoginUseCase } from "@auth/application/use-cases/login.use-case";
import { AuthErrorFactory, AuthErrorType } from "@auth/domain/entities/auth-error.entity";
import { AuthResponse, LoginRequest } from "@auth/domain/repositories/user-repository.interface";
import { LoginView } from "@auth/presentation/views/login.view.interface";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";

import { LoginPresenter } from "./login.presenter";

describe("LoginPresenter", () => {
  let presenter: LoginPresenter;
  let mockLoginUseCase: jasmine.SpyObj<LoginUseCase>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockView: jasmine.SpyObj<LoginView>;

  const mockLoginRequest: LoginRequest = {
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
    const loginUseCaseSpy = jasmine.createSpyObj("LoginUseCase", ["execute"]);
    const translateServiceSpy = jasmine.createSpyObj("TranslateService", ["instant"]);

    mockView = jasmine.createSpyObj("LoginView", [
      "showError",
      "showLoading",
      "hideLoading",
      "navigateToKanban",
      "navigateToRegister",
      "clearError",
    ]);

    TestBed.configureTestingModule({
      providers: [
        LoginPresenter,
        { provide: LoginUseCase, useValue: loginUseCaseSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    });

    presenter = TestBed.inject(LoginPresenter);
    mockLoginUseCase = TestBed.inject(LoginUseCase) as jasmine.SpyObj<LoginUseCase>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it("should be created", () => {
    expect(presenter).toBeTruthy();
  });

  describe("login", () => {
    it("should login successfully and navigate to kanban", async () => {
      mockLoginUseCase.execute.and.returnValue(of(mockAuthResponse));

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(mockLoginRequest);
      expect(mockView.hideLoading).toHaveBeenCalled();
      expect(mockView.navigateToKanban).toHaveBeenCalled();
    });

    it("should handle user not found error and redirect to register", async () => {
      const userNotFoundError = AuthErrorFactory.createUserNotFoundError(mockLoginRequest.email);
      mockLoginUseCase.execute.and.returnValue(throwError(() => userNotFoundError));
      jasmine.clock().install();

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockView.hideLoading).toHaveBeenCalled();
      expect(mockView.showError).toHaveBeenCalledWith(
        "Usuario no encontrado. Redirigiendo al registro en 2 segundos..."
      );

      jasmine.clock().tick(2001);
      expect(mockView.navigateToRegister).toHaveBeenCalledWith(mockLoginRequest.email);

      jasmine.clock().uninstall();
    });

    it("should handle generic error and show error message", async () => {
      const genericError = AuthErrorFactory.createServerError();
      mockLoginUseCase.execute.and.returnValue(throwError(() => genericError));

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockView.hideLoading).toHaveBeenCalled();
      expect(mockView.showError).toHaveBeenCalledWith("Error del servidor");
    });

    it("should handle invalid credentials error", async () => {
      const invalidCredentialsError = AuthErrorFactory.createInvalidCredentialsError();
      mockLoginUseCase.execute.and.returnValue(throwError(() => invalidCredentialsError));

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showError).toHaveBeenCalledWith("Credenciales inválidas");
    });

    it("should handle network error", async () => {
      const networkError = AuthErrorFactory.createNetworkError();
      mockLoginUseCase.execute.and.returnValue(throwError(() => networkError));

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showError).toHaveBeenCalledWith("Error de conexión");
    });

    it("should handle unknown error with custom message", async () => {
      const unknownError = { type: AuthErrorType.UNKNOWN, message: "Custom error message" };
      mockLoginUseCase.execute.and.returnValue(throwError(() => unknownError));

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showError).toHaveBeenCalledWith("Custom error message");
    });

    it("should always hide loading even if error occurs", async () => {
      const error = new Error("Unexpected error");
      mockLoginUseCase.execute.and.returnValue(throwError(() => error));

      await presenter.login(mockView, mockLoginRequest);

      expect(mockView.showLoading).toHaveBeenCalled();
      expect(mockView.hideLoading).toHaveBeenCalled();
    });
  });
});
