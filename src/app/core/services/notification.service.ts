import { Injectable, Injector } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";

export interface NotificationOptions {
  duration?: number;
  horizontalPosition?: "start" | "center" | "end" | "left" | "right";
  verticalPosition?: "top" | "bottom";
  actionText?: string;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly defaultOptions: NotificationOptions = {
    duration: 3000,
    horizontalPosition: "center",
    verticalPosition: "top",
    actionText: "Cerrar",
  };

  constructor(
    private snackBar: MatSnackBar,
    private injector: Injector
  ) {}

  private getTranslatedMessage(message: string): string {
    if (message.includes(".")) {
      try {
        const translateService = this.injector.get(TranslateService);
        return translateService.instant(message);
      } catch (error) {
        return message;
      }
    }
    return message;
  }

  showSuccess(message: string, options?: NotificationOptions): void {
    const config = { ...this.defaultOptions, ...options };
    const translatedMessage = this.getTranslatedMessage(message);
    this.snackBar.open(translatedMessage, config.actionText, {
      duration: config.duration,
      horizontalPosition: config.horizontalPosition,
      verticalPosition: config.verticalPosition,
      panelClass: ["success-snackbar"],
    });
  }

  showError(message: string, options?: NotificationOptions): void {
    const config = {
      ...this.defaultOptions,
      duration: 5000,
      ...options,
    };
    const translatedMessage = this.getTranslatedMessage(message);
    this.snackBar.open(translatedMessage, config.actionText, {
      duration: config.duration,
      horizontalPosition: config.horizontalPosition,
      verticalPosition: config.verticalPosition,
      panelClass: ["error-snackbar"],
    });
  }

  showWarning(message: string, options?: NotificationOptions): void {
    const config = {
      ...this.defaultOptions,
      duration: 4000,
      ...options,
    };
    const translatedMessage = this.getTranslatedMessage(message);
    this.snackBar.open(translatedMessage, config.actionText, {
      duration: config.duration,
      horizontalPosition: config.horizontalPosition,
      verticalPosition: config.verticalPosition,
      panelClass: ["warning-snackbar"],
    });
  }

  showInfo(message: string, options?: NotificationOptions): void {
    const config = { ...this.defaultOptions, ...options };
    const translatedMessage = this.getTranslatedMessage(message);
    this.snackBar.open(translatedMessage, config.actionText, {
      duration: config.duration,
      horizontalPosition: config.horizontalPosition,
      verticalPosition: config.verticalPosition,
      panelClass: ["info-snackbar"],
    });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}
