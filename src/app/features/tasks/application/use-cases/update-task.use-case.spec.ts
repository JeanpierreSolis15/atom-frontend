import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import {
  TASK_REPOSITORY,
  TaskRepository,
  UpdateTaskRequest,
} from "@tasks/domain/repositories/task-repository.interface";
import { of, throwError } from "rxjs";
import { UpdateTaskUseCase } from "./update-task.use-case";

describe("UpdateTaskUseCase", () => {
  let useCase: UpdateTaskUseCase;
  let mockTaskRepository: jasmine.SpyObj<TaskRepository>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockTask = Task.create({
    id: "1",
    title: "Updated Task",
    description: "Updated Description",
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    dueDate: "2024-12-31",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  });

  const mockUpdateRequest: UpdateTaskRequest = {
    title: "Updated Task",
    description: "Updated Description",
    status: TaskStatus.IN_PROGRESS,
  };

  beforeEach(() => {
    const taskRepositorySpy = jasmine.createSpyObj("TaskRepository", ["updateTask", "getTasks", "tasks$"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        UpdateTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: taskRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(UpdateTaskUseCase);
    mockTaskRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should update task successfully and refresh task list", done => {
      const taskId = "1";
      mockTaskRepository.updateTask.and.returnValue(of(mockTask));
      mockTaskRepository.getTasks.and.returnValue(of([mockTask]));

      useCase.execute(taskId, mockUpdateRequest).subscribe({
        next: result => {
          expect(result).toEqual(mockTask);
          expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(taskId, mockUpdateRequest);
          expect(mockTaskRepository.getTasks).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle repository error and show notification", done => {
      const taskId = "1";
      const error = new Error("Repository error");
      mockTaskRepository.updateTask.and.returnValue(throwError(() => error));

      useCase.execute(taskId, mockUpdateRequest).subscribe({
        error: err => {
          expect(err).toEqual(error);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al actualizar la tarea");
          done();
        },
      });
    });

    it("should call getTasks after successful update", done => {
      const taskId = "1";
      mockTaskRepository.updateTask.and.returnValue(of(mockTask));
      mockTaskRepository.getTasks.and.returnValue(of([mockTask]));

      useCase.execute(taskId, mockUpdateRequest).subscribe({
        next: () => {
          expect(mockTaskRepository.updateTask).toHaveBeenCalledBefore(mockTaskRepository.getTasks as jasmine.Spy);
          done();
        },
      });
    });

    it("should not call getTasks if update fails", done => {
      const taskId = "1";
      const error = new Error("Repository error");
      mockTaskRepository.updateTask.and.returnValue(throwError(() => error));

      useCase.execute(taskId, mockUpdateRequest).subscribe({
        error: () => {
          expect(mockTaskRepository.getTasks).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
