import { Inject, Injectable } from "@angular/core";
import {
  AuthResponse,
  LoginRequest,
  USER_REPOSITORY,
  UserRepository,
} from "@auth/domain/repositories/user-repository.interface";
import { NotificationService } from "@core/services/notification.service";
import { catchError, Observable } from "rxjs";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private notificationService: NotificationService
  ) {}

  execute(credentials: LoginRequest): Observable<AuthResponse> {
    return this.userRepository.login(credentials).pipe(
      catchError(error => {
        this.notificationService.showError("Error al iniciar sesión");
        throw error;
      })
    );
  }
}
