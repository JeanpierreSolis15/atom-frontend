import { TaskStatus } from "@tasks/domain/entities/task.entity";

export class KanbanUtils {
  static getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return "primary";
      case TaskStatus.IN_PROGRESS:
        return "accent";
      case TaskStatus.DONE:
        return "success";
      default:
        return "primary";
    }
  }

  static getContainerId(status: TaskStatus): string {
    return `kanban-column-${status.toLowerCase()}`;
  }

  static getConnectedContainers(currentStatus: TaskStatus): string[] {
    const allStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
    return allStatuses.filter(status => status !== currentStatus).map(status => this.getContainerId(status));
  }

  static getStatusFromContainerId(containerId: string): TaskStatus | null {
    if (containerId.includes(`kanban-container-${TaskStatus.TODO}`)) {
      return TaskStatus.TODO;
    }
    if (containerId.includes(`kanban-container-${TaskStatus.IN_PROGRESS}`)) {
      return TaskStatus.IN_PROGRESS;
    }
    if (containerId.includes(`kanban-container-${TaskStatus.DONE}`)) {
      return TaskStatus.DONE;
    }
    return null;
  }

  static filterTasksByStatus(tasks: any[], status: TaskStatus): any[] {
    return tasks.filter(task => task.status === status);
  }

  static updateFilteredTasks(tasks: any[]): { [key in TaskStatus]: any[] } {
    const validTasks = Array.isArray(tasks) ? tasks : [];

    return {
      [TaskStatus.TODO]: this.filterTasksByStatus(validTasks, TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: this.filterTasksByStatus(validTasks, TaskStatus.IN_PROGRESS),
      [TaskStatus.DONE]: this.filterTasksByStatus(validTasks, TaskStatus.DONE),
    };
  }
}
