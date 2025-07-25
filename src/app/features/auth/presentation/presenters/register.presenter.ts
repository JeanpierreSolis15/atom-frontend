import { Injectable } from "@angular/core";
import { RegisterUseCase } from "@auth/application/use-cases/register.use-case";
import { RegisterRequest } from "@auth/domain/repositories/user-repository.interface";
import { RegisterView } from "@auth/presentation/views/register.view.interface";

@Injectable()
export class RegisterPresenter {
  constructor(private registerUseCase: RegisterUseCase) {}

  async register(view: RegisterView, userData: RegisterRequest): Promise<void> {
    view.showLoading();
    view.clearError();

    try {
      await this.registerUseCase.execute(userData).toPromise();
      view.hideLoading();
      view.navigateToKanban();
    } catch (error: any) {
      view.hideLoading();
      view.showError(error.message || "Error al registrar usuario");
    }
  }
}
