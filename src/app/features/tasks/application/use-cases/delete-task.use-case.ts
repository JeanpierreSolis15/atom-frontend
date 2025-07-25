import { Inject, Injectable } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { TASK_REPOSITORY, TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { catchError, Observable } from "rxjs";

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) {}

  execute(taskId: string): Observable<void> {
    return this.taskRepository.deleteTask(taskId).pipe(
      catchError(error => {
        this.notificationService.showError("Error al eliminar la tarea");
        throw error;
      })
    );
  }
}
