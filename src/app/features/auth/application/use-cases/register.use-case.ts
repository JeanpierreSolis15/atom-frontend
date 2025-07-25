import { Inject, Injectable } from "@angular/core";
import {
  AuthResponse,
  RegisterRequest,
  USER_REPOSITORY,
  UserRepository,
} from "@auth/domain/repositories/user-repository.interface";
import { NotificationService } from "@core/services/notification.service";
import { catchError, Observable } from "rxjs";

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private notificationService: NotificationService
  ) {}

  execute(userData: RegisterRequest): Observable<AuthResponse> {
    return this.userRepository.register(userData).pipe(
      catchError(error => {
        this.notificationService.showError("Error al registrar usuario");
        throw error;
      })
    );
  }
}
