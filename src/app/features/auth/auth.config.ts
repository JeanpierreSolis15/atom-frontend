import { Provider } from "@angular/core";
import { LoginUseCase } from "@auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "@auth/application/use-cases/register.use-case";
import { USER_REPOSITORY } from "@auth/domain/repositories/user-repository.interface";
import { UserRepositoryImpl } from "@auth/infrastructure/repositories/user-repository.impl";
import { LoginPresenter } from "@auth/presentation/presenters/login.presenter";
import { RegisterPresenter } from "@auth/presentation/presenters/register.presenter";

export const AUTH_PROVIDERS: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepositoryImpl,
  },
  LoginUseCase,
  RegisterUseCase,
  LoginPresenter,
  RegisterPresenter,
];
