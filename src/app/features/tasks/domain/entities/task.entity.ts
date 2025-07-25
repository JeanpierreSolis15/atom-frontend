export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: TaskPriority,
    public readonly status: TaskStatus,
    public readonly dueDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date(this.dueDate) < new Date();
  }

  get isCompleted(): boolean {
    return this.status === TaskStatus.DONE;
  }

  get isInProgress(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }

  get isUrgent(): boolean {
    return this.priority === TaskPriority.URGENT;
  }

  static create(data: {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
  }): Task {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.priority,
      data.status,
      data.dueDate ? new Date(data.dueDate) : null,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}
