import { Inject, Injectable } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { Task } from "@tasks/domain/entities/task.entity";
import { TASK_REPOSITORY, TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { catchError, Observable } from "rxjs";

@Injectable()
export class GetTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) {}

  execute(): Observable<Task[]> {
    return this.taskRepository.getTasks().pipe(
      catchError(error => {
        this.notificationService.showError("Error al cargar las tareas");
        throw error;
      })
    );
  }
}
