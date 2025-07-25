import { Injectable } from "@angular/core";
import { LoginUseCase } from "@auth/application/use-cases/login.use-case";
import { LoginRequest } from "@auth/domain/repositories/user-repository.interface";
import { LoginView } from "@auth/presentation/views/login.view.interface";

@Injectable()
export class LoginPresenter {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(view: LoginView, credentials: LoginRequest): Promise<void> {
    view.showLoading();
    view.clearError();

    try {
      await this.loginUseCase.execute(credentials).toPromise();
      view.hideLoading();
      view.navigateToKanban();
    } catch (error: any) {
      view.hideLoading();
      view.showError(error.message || "Error al iniciar sesión");
    }
  }
}
