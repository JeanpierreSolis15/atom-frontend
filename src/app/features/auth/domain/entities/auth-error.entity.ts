export enum AuthErrorType {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN = "UNKNOWN",
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  status?: number;
  originalError?: any;
  email?: string;
}

export class AuthErrorFactory {
  static createUserNotFoundError(email: string, originalError?: any): AuthError {
    return {
      type: AuthErrorType.USER_NOT_FOUND,
      message: `Usuario con email ${email} no encontrado`,
      status: 404,
      originalError,
      email,
    };
  }

  static createInvalidCredentialsError(originalError?: any): AuthError {
    return {
      type: AuthErrorType.INVALID_CREDENTIALS,
      message: "Credenciales inválidas",
      status: 401,
      originalError,
    };
  }

  static createServerError(originalError?: any): AuthError {
    return {
      type: AuthErrorType.SERVER_ERROR,
      message: "Error del servidor",
      status: 500,
      originalError,
    };
  }

  static createNetworkError(originalError?: any): AuthError {
    return {
      type: AuthErrorType.NETWORK_ERROR,
      message: "Error de conexión",
      originalError,
    };
  }

  static fromHttpError(error: any, email?: string): AuthError {
    if (
      error.status === 404 ||
      (error.error?.message &&
        error.error.message.includes("Usuario con ID") &&
        error.error.message.includes("no encontrado"))
    ) {
      return this.createUserNotFoundError(email || "", error);
    }

    if (error.status === 401) {
      return this.createInvalidCredentialsError(error);
    }

    if (error.status >= 500) {
      return this.createServerError(error);
    }

    if (error.status === 0 || error.name === "NetworkError") {
      return this.createNetworkError(error);
    }

    return {
      type: AuthErrorType.UNKNOWN,
      message: error.message || "Error desconocido",
      status: error.status,
      originalError: error,
    };
  }
}
