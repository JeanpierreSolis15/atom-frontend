export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date;
  status?: TaskStatus;
  assignedTo?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  assignedTo?: string;
}

export interface MoveTaskRequest {
  taskId: string;
  newStatus: TaskStatus;
  newOrder: number;
}

export interface TaskResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: Task[];
}

export interface TaskErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    error: string;
  };
}
