import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

import { KanbanUtils } from "../../../../core/utils/kanban.utils";
import { Task, TaskStatus } from "../../interfaces/task.interface";
import { KanbanColumnComponent } from "../kanban-column/kanban-column.component";

@Component({
  selector: "app-kanban-board",
  standalone: true,
  imports: [CommonModule, KanbanColumnComponent],
  templateUrl: "./kanban-board.component.html",
  styleUrls: ["./kanban-board.component.scss"],
})
export class KanbanBoardComponent {
  @Input() tasks: Task[] = [];
  @Input() filteredTasks: { [key in TaskStatus]: Task[] } = {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: [],
  };

  @Output() taskDrop = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<TaskStatus>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  taskStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.filteredTasks[status] || [];
  }

  getConnectedContainers(currentStatus: TaskStatus): string[] {
    return KanbanUtils.getConnectedContainers(currentStatus);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    this.taskDrop.emit(event);
  }

  trackByStatus(index: number, status: TaskStatus): string {
    return status;
  }
}
