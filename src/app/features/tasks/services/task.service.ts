import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay, tap, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { ApiService } from "../../../core/services/api.service";
import { NotificationService } from "../../../core/services/notification.service";
import {
  CreateTaskRequest,
  MoveTaskRequest,
  Task,
  TaskErrorResponse,
  TaskResponse,
  TasksResponse,
  TaskStatus,
  UpdateTaskRequest,
} from "../interfaces/task.interface";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    shareReplay(1)
  );

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.getTasks().subscribe();
  }

  getTasks(): Observable<Task[]> {
    return this.apiService.get<TasksResponse>("/tasks/my-tasks").pipe(
      tap(response => {
        if (response.success) {
          const tasks = response.data || [];
          this.tasksSubject.next(Array.isArray(tasks) ? tasks : []);
        } else {
          this.tasksSubject.next([]);
        }
      }),
      map(response => {
        const tasks = response.data || [];
        return Array.isArray(tasks) ? tasks : [];
      }),
      catchError((error: TaskErrorResponse) => {
        this.tasksSubject.next([]);
        const errorMessage = error.data?.error || "Error al cargar las tareas";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.apiService.post<TaskResponse>("/tasks", taskData).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([...currentTasks, response.data]);
          this.notificationService.showSuccess("Tarea creada exitosamente");
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error("Respuesta inválida del servidor");
        }
        return response.data;
      }),
      catchError((error: TaskErrorResponse) => {
        const errorMessage = error.data?.error || "Error al crear la tarea";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateTask(taskId: string, taskData: UpdateTaskRequest): Observable<Task> {
    return this.apiService.put<TaskResponse>(`/tasks/${taskId}`, taskData).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = currentTasks.map(task => (task.id === taskId ? response.data : task));
          this.tasksSubject.next(updatedTasks);
          this.notificationService.showSuccess("Tarea actualizada exitosamente");
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error("Respuesta inválida del servidor");
        }
        return response.data;
      }),
      catchError((error: TaskErrorResponse) => {
        const errorMessage = error.data?.error || "Error al actualizar la tarea";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const filteredTasks = currentTasks.filter(task => task.id !== taskId);
        this.tasksSubject.next(filteredTasks);
        this.notificationService.showSuccess("Tarea eliminada exitosamente");
      }),
      catchError((error: TaskErrorResponse) => {
        const errorMessage = error.data?.error || "Error al eliminar la tarea";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  moveTask(moveData: MoveTaskRequest): Observable<void> {
    return this.updateTaskStatus(moveData.taskId, moveData.newStatus).pipe(
      map(() => undefined),
      tap(() => {
        this.notificationService.showInfo("Tarea movida exitosamente");
      }),
      catchError((error: TaskErrorResponse) => {
        const errorMessage = error.data?.error || "Error al mover la tarea";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): Observable<Task> {
    return this.apiService.put<TaskResponse>(`/tasks/${taskId}`, { status: newStatus }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = currentTasks.map(task => (task.id === taskId ? response.data : task));
          this.tasksSubject.next(updatedTasks);
          this.notificationService.showSuccess("Estado de tarea actualizado");
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error("Respuesta inválida del servidor");
        }
        return response.data;
      }),
      catchError((error: TaskErrorResponse) => {
        const errorMessage = error.data?.error || "Error al actualizar el estado de la tarea";
        this.notificationService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasksSubject.value.filter(task => task.status === status);
  }

  getCurrentTasks(): Task[] {
    return this.tasksSubject.value;
  }
}
