import { Injectable } from "@angular/core";
import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserRepository,
} from "@auth/domain/repositories/user-repository.interface";
import { User } from "@core/domain/entities/user.entity";
import { ApiService } from "@core/services/api.service";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<any>("/auth/login", credentials).pipe(
      map(response => {
        if (response.success && response.data && response.data.user) {
          const authResponse: AuthResponse = {
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
          User.create(response.data.user);
          this.saveAuthToStorage(response.data.user, response.data.accessToken, response.data.refreshToken);
          return authResponse;
        }
        throw new Error("Respuesta inválida del servidor");
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<any>("/auth/register", userData).pipe(
      map(response => {
        if (response.success && response.data && response.data.user) {
          const authResponse: AuthResponse = {
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
          User.create(response.data.user);
          this.saveAuthToStorage(response.data.user, response.data.accessToken, response.data.refreshToken);
          return authResponse;
        }
        throw new Error("Respuesta inválida del servidor");
      })
    );
  }

  logout(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(User.create(user));
      } catch (error) {
        this.logout();
      }
    }
  }

  private saveAuthToStorage(user: any, accessToken: string, refreshToken: string): void {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    this.currentUserSubject.next(User.create(user));
  }
}
