import { TranslateService } from "@ngx-translate/core";

import { TaskStatus } from "../../features/tasks/interfaces/task.interface";

export class KanbanUtils {
  static getStatusTitle(status: TaskStatus, translateService?: TranslateService): string {
    if (translateService) {
      switch (status) {
        case TaskStatus.TODO:
          return translateService.instant("KANBAN.STATUS.TODO");
        case TaskStatus.IN_PROGRESS:
          return translateService.instant("KANBAN.STATUS.IN_PROGRESS");
        case TaskStatus.DONE:
          return translateService.instant("KANBAN.STATUS.DONE");
        default:
          return status;
      }
    } else {
      switch (status) {
        case TaskStatus.TODO:
          return "Por Hacer";
        case TaskStatus.IN_PROGRESS:
          return "En Progreso";
        case TaskStatus.DONE:
          return "Completado";
        default:
          return status;
      }
    }
  }

  static getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return "status-todo";
      case TaskStatus.IN_PROGRESS:
        return "status-progress";
      case TaskStatus.DONE:
        return "status-done";
      default:
        return "";
    }
  }

  static getContainerId(status: TaskStatus): string {
    return `kanban-container-${status}`;
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
