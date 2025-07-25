import { TestBed } from "@angular/core/testing";
import {
  AuthResponse,
  RegisterRequest,
  USER_REPOSITORY,
  UserRepository,
} from "@auth/domain/repositories/user-repository.interface";
import { NotificationService } from "@core/services/notification.service";
import { of, throwError } from "rxjs";

import { RegisterUseCase } from "./register.use-case";

describe("RegisterUseCase", () => {
  let useCase: RegisterUseCase;
  let mockUserRepository: jasmine.SpyObj<UserRepository>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

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
    const userRepositorySpy = jasmine.createSpyObj("UserRepository", [
      "register",
      "logout",
      "getCurrentUser",
      "isAuthenticated",
      "getAccessToken",
    ]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        RegisterUseCase,
        { provide: USER_REPOSITORY, useValue: userRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(RegisterUseCase);
    mockUserRepository = TestBed.inject(USER_REPOSITORY) as jasmine.SpyObj<UserRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should register successfully", done => {
      mockUserRepository.register.and.returnValue(of(mockAuthResponse));

      useCase.execute(mockRegisterRequest).subscribe({
        next: result => {
          expect(result).toEqual(mockAuthResponse);
          expect(mockUserRepository.register).toHaveBeenCalledWith(mockRegisterRequest);
          expect(mockNotificationService.showError).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle registration error and show notification", done => {
      const error = new Error("Registration failed");
      mockUserRepository.register.and.returnValue(throwError(() => error));

      useCase.execute(mockRegisterRequest).subscribe({
        error: err => {
          expect(err).toEqual(error);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al registrar usuario");
          done();
        },
      });
    });

    it("should handle email already exists error", done => {
      const emailExistsError = { status: 409, message: "Email already exists" };
      mockUserRepository.register.and.returnValue(throwError(() => emailExistsError));

      useCase.execute(mockRegisterRequest).subscribe({
        error: err => {
          expect(err).toEqual(emailExistsError);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al registrar usuario");
          done();
        },
      });
    });

    it("should handle network error during registration", done => {
      const networkError = { status: 0, message: "Network error" };
      mockUserRepository.register.and.returnValue(throwError(() => networkError));

      useCase.execute(mockRegisterRequest).subscribe({
        error: err => {
          expect(err).toEqual(networkError);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al registrar usuario");
          done();
        },
      });
    });

    it("should handle invalid data error", done => {
      const validationError = { status: 400, message: "Invalid data" };
      mockUserRepository.register.and.returnValue(throwError(() => validationError));

      useCase.execute(mockRegisterRequest).subscribe({
        error: err => {
          expect(err).toEqual(validationError);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al registrar usuario");
          done();
        },
      });
    });

    it("should return user data with tokens", done => {
      mockUserRepository.register.and.returnValue(of(mockAuthResponse));

      useCase.execute(mockRegisterRequest).subscribe({
        next: result => {
          expect(result.user.id).toBe("1");
          expect(result.user.email).toBe("test@example.com");
          expect(result.accessToken).toBe("access-token");
          expect(result.refreshToken).toBe("refresh-token");
          done();
        },
      });
    });
  });
});
