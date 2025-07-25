import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { KanbanColumnComponent } from "@tasks/components/kanban-column/kanban-column.component";
import { Task, TaskStatus } from "@tasks/domain/entities/task.entity";

@Component({
  selector: "app-kanban-board",
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, KanbanColumnComponent, TranslateModule],
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

  TaskStatus = TaskStatus;

  getStatuses(): TaskStatus[] {
    return [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  }

  getConnectedContainers(): string[] {
    return this.getStatuses().map(status => `kanban-column-${status.toLowerCase()}`);
  }

  trackByStatus(index: number, status: TaskStatus): string {
    return status;
  }
}
