import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { KanbanUtils } from "../../../../core/utils/kanban.utils";
import { Task, TaskStatus } from "../../interfaces/task.interface";
import { TaskCardComponent } from "../task-card/task-card.component";

@Component({
  selector: "app-kanban-column",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule,
    TaskCardComponent,
    TranslateModule,
  ],
  templateUrl: "./kanban-column.component.html",
  styleUrls: ["./kanban-column.component.scss"],
})
export class KanbanColumnComponent {
  @Input() status!: TaskStatus;
  @Input() tasks: Task[] = [];
  @Input() connectedContainers: string[] = [];

  @Output() taskDrop = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<TaskStatus>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  constructor(private translateService: TranslateService) {}

  getStatusTitle(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return this.translateService.instant("TASK.TODO");
      case TaskStatus.IN_PROGRESS:
        return this.translateService.instant("TASK.IN_PROGRESS");
      case TaskStatus.DONE:
        return this.translateService.instant("TASK.DONE");
      default:
        return status;
    }
  }

  getStatusColor(status: TaskStatus): string {
    return KanbanUtils.getStatusColor(status);
  }

  getContainerId(status: TaskStatus): string {
    return KanbanUtils.getContainerId(status);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
