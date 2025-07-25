import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { USER_REPOSITORY } from "@auth/domain/repositories/user-repository.interface";

export const authGuard = () => {
  const userRepository = inject(USER_REPOSITORY);
  const router = inject(Router);

  if (userRepository.isAuthenticated()) {
    return true;
  }

  router.navigate(["/auth/login"]);
  return false;
};
