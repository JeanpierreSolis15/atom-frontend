import { Injectable } from "@angular/core";
import { NotificationService } from "@core/services/notification.service";
import { CreateTaskUseCase } from "@tasks/application/use-cases/create-task.use-case";
import { DeleteTaskUseCase } from "@tasks/application/use-cases/delete-task.use-case";
import { GetTasksUseCase } from "@tasks/application/use-cases/get-tasks.use-case";
import { MoveTaskUseCase } from "@tasks/application/use-cases/move-task.use-case";
import { UpdateTaskUseCase } from "@tasks/application/use-cases/update-task.use-case";
import { Task, TaskStatus } from "@tasks/domain/entities/task.entity";
import {
  CreateTaskRequest,
  MoveTaskRequest,
  UpdateTaskRequest,
} from "@tasks/domain/repositories/task-repository.interface";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(
    private getTasksUseCase: GetTasksUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private moveTaskUseCase: MoveTaskUseCase,
    private notificationService: NotificationService
  ) {}

  getTasks(): Observable<Task[]> {
    return this.getTasksUseCase.execute();
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.createTaskUseCase.execute(taskData).pipe(
      tap(() => {
        this.notificationService.showSuccess("Tarea creada exitosamente");
      })
    );
  }

  updateTask(taskId: string, taskData: UpdateTaskRequest): Observable<Task> {
    return this.updateTaskUseCase.execute(taskId, taskData).pipe(
      tap(() => {
        this.notificationService.showSuccess("Tarea actualizada exitosamente");
      })
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.deleteTaskUseCase.execute(taskId).pipe(
      tap(() => {
        this.notificationService.showSuccess("Tarea eliminada exitosamente");
      })
    );
  }

  moveTask(moveData: MoveTaskRequest): Observable<void> {
    return this.moveTaskUseCase.execute(moveData).pipe(
      tap(() => {
        this.notificationService.showInfo("Tarea movida exitosamente");
      })
    );
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): Observable<Task> {
    return this.updateTaskUseCase.execute(taskId, { status: newStatus }).pipe(
      tap(() => {
        this.notificationService.showSuccess("Estado de tarea actualizado");
      })
    );
  }

  getTasksByStatus(): Task[] {
    return [];
  }

  getCurrentTasks(): Task[] {
    return [];
  }
}
