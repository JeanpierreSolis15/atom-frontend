import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { USER_REPOSITORY, UserRepository } from "@auth/domain/repositories/user-repository.interface";
import { UserRepositoryImpl } from "@auth/infrastructure/repositories/user-repository.impl";
import { NotificationService } from "@core/services/notification.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { KanbanBoardComponent } from "@tasks/components/kanban-board/kanban-board.component";
import { KanbanToolbarComponent } from "@tasks/components/kanban-toolbar/kanban-toolbar.component";
import { TaskFormComponent } from "@tasks/components/task-form/task-form.component";
import { Task, TaskStatus } from "@tasks/domain/entities/task.entity";
import { TaskService } from "@tasks/services/task.service";
import { TASKS_PROVIDERS } from "@tasks/tasks.config";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";

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
    TaskFormComponent,
    TranslateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    ...TASKS_PROVIDERS,
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
  currentUser$ = new BehaviorSubject(this.userRepository.getCurrentUser());

  private destroy$ = new Subject<void>();
  private tasksUpdate$ = new Subject<Task[]>();
  private isDragging = false;

  constructor(
    private taskService: TaskService,
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
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
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasksUpdate$.next(tasks);
      },
      error: () => {},
    });
  }

  private updateFilteredTasks(): void {
    this.filteredTasks = {
      [TaskStatus.TODO]: this.tasks.filter(task => task.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.DONE]: this.tasks.filter(task => task.status === TaskStatus.DONE),
    };
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);

      if (task && newStatus && task.status !== newStatus) {
        this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
          next: () => {
            this.notificationService.showSuccess(this.translateService.instant("KANBAN.TASK_UPDATED"));
          },
          error: () => {
            this.notificationService.showError(this.translateService.instant("KANBAN.TASK_UPDATE_ERROR"));
            this.loadTasks();
          },
        });
      }
    }
  }

  onDragStarted(): void {
    this.isDragging = true;
  }

  onDragEnded(): void {
    this.isDragging = false;
  }

  onAddTaskToColumn(status: TaskStatus): void {
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
    this.userRepository.logout();
    this.router.navigate(["/auth/login"]);
  }

  private openTaskDialog(status?: TaskStatus): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: "500px",
      data: { task: this.editingTask, defaultStatus: status },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editingTask = null;
      if (result) {
        this.loadTasks();
      }
    });
  }

  private getStatusFromContainerId(containerId: string): TaskStatus | null {
    if (containerId.includes("todo")) return TaskStatus.TODO;
    if (containerId.includes("in-progress")) return TaskStatus.IN_PROGRESS;
    if (containerId.includes("done")) return TaskStatus.DONE;
    return null;
  }
}
