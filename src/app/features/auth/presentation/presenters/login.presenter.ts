import { Injectable } from "@angular/core";
import { LoginUseCase } from "@auth/application/use-cases/login.use-case";
import { AuthErrorType } from "@auth/domain/entities/auth-error.entity";
import { LoginRequest } from "@auth/domain/repositories/user-repository.interface";
import { LoginView } from "@auth/presentation/views/login.view.interface";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class LoginPresenter {
  private readonly REDIRECT_DELAY = 2000;

  constructor(
    private loginUseCase: LoginUseCase,
    private translateService: TranslateService
  ) {}

  async login(view: LoginView, credentials: LoginRequest): Promise<void> {
    view.showLoading();
    view.clearError();

    try {
      await this.loginUseCase.execute(credentials).toPromise();
      view.hideLoading();
      view.navigateToKanban();
    } catch (error: any) {
      view.hideLoading();
      this.handleLoginError(view, error);
    }
  }

  private handleLoginError(view: LoginView, error: any): void {
    if (error.type === AuthErrorType.USER_NOT_FOUND) {
      this.handleUserNotFound(view, error.email || "");
    } else {
      this.handleGenericError(view, error);
    }
  }

  private handleUserNotFound(view: LoginView, email: string): void {
    const message = "Usuario no encontrado. Redirigiendo al registro en 2 segundos...";
    view.showError(message);

    setTimeout(() => {
      view.navigateToRegister(email);
    }, this.REDIRECT_DELAY);
  }

  private handleGenericError(view: LoginView, error: any): void {
    const message = error.message || "Error al iniciar sesión. Verifica tus credenciales.";
    view.showError(message);
  }
}
