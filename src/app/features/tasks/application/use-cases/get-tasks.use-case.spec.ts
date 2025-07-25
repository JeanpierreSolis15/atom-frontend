import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import { TASK_REPOSITORY, TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { of, throwError } from "rxjs";
import { GetTasksUseCase } from "./get-tasks.use-case";

describe("GetTasksUseCase", () => {
  let useCase: GetTasksUseCase;
  let mockTaskRepository: jasmine.SpyObj<TaskRepository>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockTasks = [
    Task.create({
      id: "1",
      title: "Task 1",
      description: "Description 1",
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      dueDate: "2024-12-31",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    }),
    Task.create({
      id: "2",
      title: "Task 2",
      description: "Description 2",
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      dueDate: "2024-12-25",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    }),
  ];

  beforeEach(() => {
    const taskRepositorySpy = jasmine.createSpyObj("TaskRepository", ["getTasks", "tasks$"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        GetTasksUseCase,
        { provide: TASK_REPOSITORY, useValue: taskRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(GetTasksUseCase);
    mockTaskRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should get tasks successfully", done => {
      mockTaskRepository.getTasks.and.returnValue(of(mockTasks));

      useCase.execute().subscribe({
        next: result => {
          expect(result).toEqual(mockTasks);
          expect(result.length).toBe(2);
          expect(mockTaskRepository.getTasks).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle empty task list", done => {
      mockTaskRepository.getTasks.and.returnValue(of([]));

      useCase.execute().subscribe({
        next: result => {
          expect(result).toEqual([]);
          expect(result.length).toBe(0);
          done();
        },
      });
    });

    it("should handle repository error and show notification", done => {
      const error = new Error("Repository error");
      mockTaskRepository.getTasks.and.returnValue(throwError(() => error));

      useCase.execute().subscribe({
        error: err => {
          expect(err).toEqual(error);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al cargar las tareas");
          done();
        },
      });
    });

    it("should return tasks with correct properties", done => {
      mockTaskRepository.getTasks.and.returnValue(of(mockTasks));

      useCase.execute().subscribe({
        next: result => {
          const firstTask = result[0];
          expect(firstTask.id).toBe("1");
          expect(firstTask.title).toBe("Task 1");
          expect(firstTask.status).toBe(TaskStatus.TODO);
          expect(firstTask.priority).toBe(TaskPriority.HIGH);
          done();
        },
      });
    });

    it("should handle network timeout error", done => {
      const timeoutError = new Error("Network timeout");
      mockTaskRepository.getTasks.and.returnValue(throwError(() => timeoutError));

      useCase.execute().subscribe({
        error: err => {
          expect(err.message).toBe("Network timeout");
          expect(mockNotificationService.showError).toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
