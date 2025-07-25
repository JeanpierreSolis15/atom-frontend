import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Task, TaskPriority } from "@tasks/domain/entities/task.entity";

@Component({
  selector: "app-task-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    TranslateModule,
  ],
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  constructor(private translateService: TranslateService) {}

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task);
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return "primary";
      case TaskPriority.MEDIUM:
        return "accent";
      case TaskPriority.HIGH:
        return "warn";
      case TaskPriority.URGENT:
        return "warn";
      default:
        return "primary";
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return this.translateService.instant("TASK.LOW");
      case TaskPriority.MEDIUM:
        return this.translateService.instant("TASK.MEDIUM");
      case TaskPriority.HIGH:
        return this.translateService.instant("TASK.HIGH");
      case TaskPriority.URGENT:
        return this.translateService.instant("TASK.URGENT");
      default:
        return priority;
    }
  }

  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return "arrow_downward";
      case TaskPriority.MEDIUM:
        return "remove";
      case TaskPriority.HIGH:
        return "arrow_upward";
      case TaskPriority.URGENT:
        return "priority_high";
      default:
        return "remove";
    }
  }

  getTaskClasses(): string {
    const classes = [];

    if (this.task.isCompleted) {
      classes.push("completed");
    } else if (this.task.isInProgress) {
      classes.push("in-progress");
    }

    if (this.task.isUrgent) {
      classes.push("urgent");
    }

    return classes.join(" ");
  }

  formatDate(date: Date): string {
    const lang = this.translateService.currentLang;
    return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }
}
