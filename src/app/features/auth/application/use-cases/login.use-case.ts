import { Inject, Injectable } from "@angular/core";
import { AuthErrorFactory, AuthErrorType } from "@auth/domain/entities/auth-error.entity";
import {
  AuthResponse,
  LoginRequest,
  USER_REPOSITORY,
  UserRepository,
} from "@auth/domain/repositories/user-repository.interface";
import { NotificationService } from "@core/services/notification.service";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private notificationService: NotificationService
  ) {}

  execute(credentials: LoginRequest): Observable<AuthResponse> {
    return this.userRepository.login(credentials).pipe(
      catchError((error: any) => {
        const authError = AuthErrorFactory.fromHttpError(error, credentials.email);
        if (authError.type !== AuthErrorType.USER_NOT_FOUND) {
          this.notificationService.showError(authError.message);
        }
        return throwError(() => authError);
      })
    );
  }
}
