import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import { TASK_REPOSITORY, TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { of, throwError } from "rxjs";
import { DeleteTaskUseCase } from "./delete-task.use-case";

describe("DeleteTaskUseCase", () => {
  let useCase: DeleteTaskUseCase;
  let mockTaskRepository: jasmine.SpyObj<TaskRepository>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockTask = Task.create({
    id: "1",
    title: "Test Task",
    description: "Test Description",
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    dueDate: "2024-12-31",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  });

  beforeEach(() => {
    const taskRepositorySpy = jasmine.createSpyObj("TaskRepository", ["deleteTask", "getTasks", "tasks$"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        DeleteTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: taskRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(DeleteTaskUseCase);
    mockTaskRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should delete task successfully and refresh task list", done => {
      const taskId = "1";
      mockTaskRepository.deleteTask.and.returnValue(of(undefined));
      mockTaskRepository.getTasks.and.returnValue(of([]));

      useCase.execute(taskId).subscribe({
        next: result => {
          expect(result).toBeUndefined();
          expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(taskId);
          expect(mockTaskRepository.getTasks).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle repository error and show notification", done => {
      const taskId = "1";
      const error = new Error("Repository error");
      mockTaskRepository.deleteTask.and.returnValue(throwError(() => error));

      useCase.execute(taskId).subscribe({
        error: err => {
          expect(err).toEqual(error);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al eliminar la tarea");
          done();
        },
      });
    });

    it("should call getTasks after successful deletion", done => {
      const taskId = "1";
      mockTaskRepository.deleteTask.and.returnValue(of(undefined));
      mockTaskRepository.getTasks.and.returnValue(of([]));

      useCase.execute(taskId).subscribe({
        next: () => {
          expect(mockTaskRepository.deleteTask).toHaveBeenCalledBefore(mockTaskRepository.getTasks as jasmine.Spy);
          done();
        },
      });
    });

    it("should not call getTasks if deletion fails", done => {
      const taskId = "1";
      const error = new Error("Repository error");
      mockTaskRepository.deleteTask.and.returnValue(throwError(() => error));

      useCase.execute(taskId).subscribe({
        error: () => {
          expect(mockTaskRepository.getTasks).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
