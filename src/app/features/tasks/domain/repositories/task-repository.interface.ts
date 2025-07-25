import { InjectionToken } from "@angular/core";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import { Observable } from "rxjs";

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>("TaskRepository");
export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
}
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
}
export interface MoveTaskRequest {
  taskId: string;
  newStatus: TaskStatus;
}
export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface TaskResponse {
  success: boolean;
  data: TaskData;
  message?: string;
}
export interface TasksResponse {
  success: boolean;
  data: TaskData[];
  message?: string;
}
export interface TaskErrorResponse {
  success: false;
  data: {
    error: string;
  };
  message: string;
}
export interface TaskRepository {
  getTasks(): Observable<Task[]>;
  createTask(taskData: CreateTaskRequest): Observable<Task>;
  updateTask(taskId: string, taskData: UpdateTaskRequest): Observable<Task>;
  deleteTask(taskId: string): Observable<void>;
  moveTask(moveData: MoveTaskRequest): Observable<void>;
  updateTaskStatus(taskId: string, newStatus: TaskStatus): Observable<Task>;
  getTasksByStatus(status: TaskStatus): Observable<Task[]>;
}
