import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { FormUtils } from "../../../../core/utils/form.utils";
import { CreateTaskRequest, Task, TaskPriority, TaskStatus, UpdateTaskRequest } from "../../interfaces/task.interface";
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
  selector: "app-task-form",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm!: FormGroup;
  loading = false;
  errorMessage = "";

  priorityOptions = [
    { label: "Baja", value: TaskPriority.LOW },
    { label: "Media", value: TaskPriority.MEDIUM },
    { label: "Alta", value: TaskPriority.HIGH },
    { label: "Urgente", value: TaskPriority.URGENT },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task | null; defaultStatus?: TaskStatus },
    private dateAdapter: DateAdapter<Date>,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.task = data?.task || null;
    this.dateAdapter.setLocale("es-ES");
    this.updatePriorityOptions();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private updatePriorityOptions(): void {
    this.priorityOptions = [
      { label: this.translateService.instant("TASK.LOW"), value: TaskPriority.LOW },
      { label: this.translateService.instant("TASK.MEDIUM"), value: TaskPriority.MEDIUM },
      { label: this.translateService.instant("TASK.HIGH"), value: TaskPriority.HIGH },
      { label: this.translateService.instant("TASK.URGENT"), value: TaskPriority.URGENT },
    ];
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: [""],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: [null],
    });

    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || "",
        priority: this.task.priority,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      this.errorMessage = "";
      this.cdr.markForCheck();

      const formData = this.taskForm.value;

      if (this.task) {
        const updateData: UpdateTaskRequest = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
        };

        this.taskService.updateTask(this.task.id, updateData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: error => {
            this.errorMessage = error.message || this.translateService.instant("KANBAN.TASK_UPDATE_ERROR");
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
      } else {
        const createData: CreateTaskRequest = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          status: this.data?.defaultStatus || TaskStatus.TODO,
        };

        this.taskService.createTask(createData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: error => {
            this.errorMessage = error.message || this.translateService.instant("KANBAN.TASK_CREATE_ERROR");
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    FormUtils.markFormGroupTouched(this.taskForm);
    this.cdr.markForCheck();
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    return FormUtils.getErrorMessage(control, this.translateService);
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

  getPriorityIconClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return "priority-low";
      case TaskPriority.MEDIUM:
        return "priority-medium";
      case TaskPriority.HIGH:
        return "priority-high";
      case TaskPriority.URGENT:
        return "priority-urgent";
      default:
        return "priority-medium";
    }
  }
}
