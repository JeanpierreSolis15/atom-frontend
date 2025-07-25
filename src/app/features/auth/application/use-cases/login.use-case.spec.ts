import { TestBed } from "@angular/core/testing";
import { AuthErrorFactory, AuthErrorType } from "@auth/domain/entities/auth-error.entity";
import {
  AuthResponse,
  LoginRequest,
  USER_REPOSITORY,
  UserRepository,
} from "@auth/domain/repositories/user-repository.interface";
import { NotificationService } from "@core/services/notification.service";
import { of, throwError } from "rxjs";

import { LoginUseCase } from "./login.use-case";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let mockUserRepository: jasmine.SpyObj<UserRepository>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

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
    const userRepositorySpy = jasmine.createSpyObj("UserRepository", [
      "login",
      "logout",
      "getCurrentUser",
      "isAuthenticated",
      "getAccessToken",
    ]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        LoginUseCase,
        { provide: USER_REPOSITORY, useValue: userRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(LoginUseCase);
    mockUserRepository = TestBed.inject(USER_REPOSITORY) as jasmine.SpyObj<UserRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should login successfully", done => {
      mockUserRepository.login.and.returnValue(of(mockAuthResponse));

      useCase.execute(mockLoginRequest).subscribe({
        next: result => {
          expect(result).toEqual(mockAuthResponse);
          expect(mockUserRepository.login).toHaveBeenCalledWith(mockLoginRequest);
          expect(mockNotificationService.showError).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle user not found error without showing notification", done => {
      const userNotFoundError = AuthErrorFactory.createUserNotFoundError(mockLoginRequest.email);
      mockUserRepository.login.and.returnValue(throwError(() => userNotFoundError));

      useCase.execute(mockLoginRequest).subscribe({
        error: error => {
          expect(error.type).toBe(AuthErrorType.USER_NOT_FOUND);
          expect(error.email).toBe(mockLoginRequest.email);
          expect(mockNotificationService.showError).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle generic error and show notification", done => {
      const genericError = AuthErrorFactory.createServerError();
      mockUserRepository.login.and.returnValue(throwError(() => genericError));

      useCase.execute(mockLoginRequest).subscribe({
        error: error => {
          expect(error.type).toBe(AuthErrorType.SERVER_ERROR);
          expect(mockNotificationService.showError).toHaveBeenCalledWith(genericError.message);
          done();
        },
      });
    });

    it("should handle network error and show notification", done => {
      const httpError = { status: 0, message: "Network error" };
      mockUserRepository.login.and.returnValue(throwError(() => httpError));

      useCase.execute(mockLoginRequest).subscribe({
        error: error => {
          expect(error.type).toBe(AuthErrorType.NETWORK_ERROR);
          expect(mockNotificationService.showError).toHaveBeenCalledWith(error.message);
          done();
        },
      });
    });

    it("should handle invalid credentials error and show notification", done => {
      const invalidCredentialsError = AuthErrorFactory.createInvalidCredentialsError();
      mockUserRepository.login.and.returnValue(throwError(() => invalidCredentialsError));

      useCase.execute(mockLoginRequest).subscribe({
        error: error => {
          expect(error.type).toBe(AuthErrorType.INVALID_CREDENTIALS);
          expect(mockNotificationService.showError).toHaveBeenCalledWith(invalidCredentialsError.message);
          done();
        },
      });
    });
  });
});
