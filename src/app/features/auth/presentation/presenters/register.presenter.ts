import { Injectable } from "@angular/core";
import { LoginUseCase } from "@auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@auth/application/use-cases/register.use-case";
import { LoginRequest, RegisterRequest } from "@auth/domain/repositories/user-repository.interface";
import { RegisterView } from "@auth/presentation/views/register.view.interface";
import { NotificationService } from "@core/services/notification.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class RegisterPresenter {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  async register(view: RegisterView, userData: RegisterRequest): Promise<void> {
    view.showLoading();
    view.clearError();

    try {
      await this.registerUseCase.execute(userData).toPromise();

      const loginCredentials: LoginRequest = {
        email: userData.email,
      };

      await this.loginUseCase.execute(loginCredentials).toPromise();

      view.hideLoading();

      const successMessage = this.translateService.instant("AUTH.ACCOUNT_CREATED_AND_LOGGED");
      this.notificationService.showSuccess(successMessage);
      view.navigateToKanban();
    } catch (error: any) {
      view.hideLoading();
      view.showError(error.message || "Error al registrar usuario");
    }
  }
}
