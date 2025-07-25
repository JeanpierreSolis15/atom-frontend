import { Injectable } from "@angular/core";
import { ApiService } from "@core/services/api.service";
import { Task, TaskStatus } from "@tasks/domain/entities/task.entity";
import {
  CreateTaskRequest,
  MoveTaskRequest,
  TaskRepository,
  TaskResponse,
  TasksResponse,
  UpdateTaskRequest,
} from "@tasks/domain/repositories/task-repository.interface";
import { BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay, tap } from "rxjs";

@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    shareReplay(1)
  );

  constructor(private apiService: ApiService) {
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
          this.tasksSubject.next(Array.isArray(tasks) ? tasks.map(task => Task.create(task)) : []);
        } else {
          this.tasksSubject.next([]);
        }
      }),
      map(response => {
        const tasks = response.data || [];
        return Array.isArray(tasks) ? tasks.map(task => Task.create(task)) : [];
      })
    );
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.apiService.post<TaskResponse>("/tasks", taskData).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          const newTask = Task.create(response.data);
          this.tasksSubject.next([...currentTasks, newTask]);
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error("Respuesta inválida del servidor");
        }
        return Task.create(response.data);
      })
    );
  }

  updateTask(taskId: string, taskData: UpdateTaskRequest): Observable<Task> {
    return this.apiService.put<TaskResponse>(`/tasks/${taskId}`, taskData).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          const updatedTask = Task.create(response.data);
          const updatedTasks = currentTasks.map(task => (task.id === taskId ? updatedTask : task));
          this.tasksSubject.next(updatedTasks);
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error("Respuesta inválida del servidor");
        }
        return Task.create(response.data);
      })
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const filteredTasks = currentTasks.filter(task => task.id !== taskId);
        this.tasksSubject.next(filteredTasks);
      })
    );
  }

  moveTask(moveData: MoveTaskRequest): Observable<void> {
    return this.updateTaskStatus(moveData.taskId, moveData.newStatus).pipe(map(() => undefined));
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): Observable<Task> {
    return this.apiService.put<TaskResponse>(`/tasks/${taskId}`, { status: newStatus }).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentTasks = this.tasksSubject.value;
          const updatedTask = Task.create(response.data);
          const updatedTasks = currentTasks.map(task => (task.id === taskId ? updatedTask : task));
          this.tasksSubject.next(updatedTasks);
        }
      }),
      map(response => {
        if (!response.data) {
          throw new Error("Respuesta inválida del servidor");
        }
        return Task.create(response.data);
      })
    );
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(map(tasks => tasks.filter(task => task.status === status)));
  }

  getCurrentTasks(): Task[] {
    return this.tasksSubject.value;
  }
}
