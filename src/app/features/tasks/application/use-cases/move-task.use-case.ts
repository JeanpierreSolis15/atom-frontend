import { Inject, Injectable } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { MoveTaskRequest, TASK_REPOSITORY, TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { catchError, Observable } from "rxjs";

@Injectable()
export class MoveTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) {}

  execute(moveData: MoveTaskRequest): Observable<void> {
    return this.taskRepository.moveTask(moveData).pipe(
      catchError(error => {
        this.notificationService.showError("Error al mover la tarea");
        throw error;
      })
    );
  }
}
