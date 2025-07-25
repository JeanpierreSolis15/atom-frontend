import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, switchMap, tap, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ApiService } from "../../../core/services/api.service";
import { NotificationService } from "../../../core/services/notification.service";
import { ApiError } from "../../../shared/interfaces/api-response.interface";
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, User } from "../interfaces/auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  private saveAuthToStorage(user: User, accessToken: string, refreshToken: string): void {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  private clearAuth(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.currentUserSubject.next(null);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>("/auth/login", credentials).pipe(
      tap(response => {
        if (response.success) {
          this.saveAuthToStorage(response.data.user, response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next(response.data.user);
          this.notificationService.showSuccess("¡Inicio de sesión exitoso!");
        }
      }),
      catchError((error: ApiError) => {
        if (error.status === 404) {
          this.notificationService.showInfo("AUTH.USER_NOT_FOUND");
          return throwError(() => ({ type: "USER_NOT_FOUND", email: credentials.email }));
        }

        if (error.message && error.message.includes("no encontrado")) {
          this.notificationService.showInfo("AUTH.USER_NOT_FOUND");
          return throwError(() => ({ type: "USER_NOT_FOUND", email: credentials.email }));
        }

        const errorMessage = error.message || "Error al iniciar sesión";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>("/auth/register", userData).pipe(
      tap(response => {
        if (response.success) {
          this.currentUserSubject.next(response.data.user);
          this.notificationService.showSuccess("¡Registro exitoso! Bienvenido a la aplicación");
        }
      }),
      catchError((error: ApiError) => {
        const errorMessage = error.message || "Error al registrar usuario";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  registerAndLogin(userData: RegisterRequest): Observable<AuthResponse> {
    return this.register(userData).pipe(
      switchMap(() => {
        const loginData: LoginRequest = { email: userData.email };
        return this.login(loginData);
      }),
      catchError(error => throwError(() => error))
    );
  }

  logout(): void {
    this.clearAuth();
    this.notificationService.showInfo("AUTH.SESSION_CLOSED");
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem("accessToken");
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }
}
