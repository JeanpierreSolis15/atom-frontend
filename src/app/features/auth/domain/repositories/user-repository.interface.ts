import { InjectionToken } from "@angular/core";
import { User } from "@core/domain/entities/user.entity";
import { Observable } from "rxjs";

export const USER_REPOSITORY = new InjectionToken<UserRepository>("UserRepository");

export interface LoginRequest {
  email: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface UserRepository {
  login(credentials: LoginRequest): Observable<AuthResponse>;
  register(userData: RegisterRequest): Observable<AuthResponse>;
  logout(): void;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
  getAccessToken(): string | null;
}
