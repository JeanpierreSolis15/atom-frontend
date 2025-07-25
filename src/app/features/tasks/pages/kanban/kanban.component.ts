import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";

import { NotificationService } from "../../../../core/services/notification.service";
import { KanbanUtils } from "../../../../core/utils/kanban.utils";
import { AuthService } from "../../../auth/services/auth.service";
import { KanbanBoardComponent } from "../../components/kanban-board/kanban-board.component";
import { KanbanToolbarComponent } from "../../components/kanban-toolbar/kanban-toolbar.component";
import { TaskFormComponent } from "../../components/task-form/task-form.component";
import { Task, TaskStatus } from "../../interfaces/task.interface";
import { TaskService } from "../../services/task.service";

const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-kanban",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatDialogModule,
    KanbanToolbarComponent,
    KanbanBoardComponent,
    TranslateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: "./kanban.component.html",
  styleUrls: ["./kanban.component.scss"],
})
export class KanbanComponent implements OnInit, OnDestroy {
  TaskStatus = TaskStatus;

  tasks: Task[] = [];
  filteredTasks: { [key in TaskStatus]: Task[] } = {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: [],
  };

  editingTask: Task | null = null;
  currentUser$ = this.authService.currentUser$;

  private destroy$ = new Subject<void>();
  private tasksUpdate$ = new Subject<Task[]>();
  private isDragging = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {
    this.dateAdapter.setLocale("es-ES");
  }

  ngOnInit(): void {
    this.setupTasksSubscription();
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tasksUpdate$.complete();
  }

  private setupTasksSubscription(): void {
    this.tasksUpdate$
      .pipe(
        debounceTime(100),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe(tasks => {
        this.tasks = tasks;
        this.updateFilteredTasks();
        this.cdr.markForCheck();
      });
  }

  private loadTasks(): void {
    this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      const validTasks = Array.isArray(tasks) ? tasks : [];
      this.tasksUpdate$.next(validTasks);
    });
  }

  private updateFilteredTasks(): void {
    this.filteredTasks = KanbanUtils.updateFilteredTasks(this.tasks);
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      const task = event.container.data[event.currentIndex];
      const newStatus = KanbanUtils.getStatusFromContainerId(event.container.id);

      if (task && newStatus) {
        const oldStatus = task.status;
        task.status = newStatus;

        this.updateFilteredTasks();

        this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
          next: () => {
            this.notificationService.showSuccess(this.translateService.instant("KANBAN.TASK_UPDATED"));
          },
          error: () => {
            task.status = oldStatus;
            this.updateFilteredTasks();
            this.cdr.markForCheck();
            this.notificationService.showError(this.translateService.instant("KANBAN.TASK_UPDATE_ERROR"));
          },
        });
      }
    }

    this.isDragging = false;
    this.cdr.markForCheck();
  }

  onDragStarted(): void {
    this.isDragging = true;
    document.body.style.cursor = "grabbing";
    document.body.classList.add("dragging");
  }

  onDragEnded(): void {
    this.isDragging = false;
    document.body.style.cursor = "";
    document.body.classList.remove("dragging");
    this.cdr.markForCheck();
  }

  onAddTaskToColumn(status: TaskStatus): void {
    this.editingTask = null;
    this.openTaskDialog(status);
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.openTaskDialog();
  }

  onDeleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(this.translateService.instant("KANBAN.TASK_DELETED"));
      },
      error: () => {
        this.notificationService.showError(this.translateService.instant("KANBAN.TASK_DELETE_ERROR"));
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.notificationService.showInfo(this.translateService.instant("AUTH.SESSION_CLOSED"));
    this.router.navigate(["/auth/login"]);
  }

  private openTaskDialog(status?: TaskStatus): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: "600px",
      data: {
        task: this.editingTask,
        defaultStatus: status,
      },
    });

    dialogRef.afterClosed().subscribe();
  }
}
