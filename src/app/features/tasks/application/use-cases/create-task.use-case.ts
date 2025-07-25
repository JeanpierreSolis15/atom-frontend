import { Inject, Injectable } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { Task } from "@tasks/domain/entities/task.entity";
import {
  CreateTaskRequest,
  TASK_REPOSITORY,
  TaskRepository,
} from "@tasks/domain/repositories/task-repository.interface";
import { catchError, Observable } from "rxjs";

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) {}

  execute(taskData: CreateTaskRequest): Observable<Task> {
    return this.taskRepository.createTask(taskData).pipe(
      catchError(error => {
        this.notificationService.showError("Error al crear la tarea");
        throw error;
      })
    );
  }
}
