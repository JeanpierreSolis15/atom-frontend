import { Inject, Injectable } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { Task } from "@tasks/domain/entities/task.entity";
import {
  TASK_REPOSITORY,
  TaskRepository,
  UpdateTaskRequest,
} from "@tasks/domain/repositories/task-repository.interface";
import { catchError, Observable } from "rxjs";

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) {}

  execute(taskId: string, taskData: UpdateTaskRequest): Observable<Task> {
    return this.taskRepository.updateTask(taskId, taskData).pipe(
      catchError(error => {
        this.notificationService.showError("Error al actualizar la tarea");
        throw error;
      })
    );
  }
}
