export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    user: User;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    error: string;
  };
}
