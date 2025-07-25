import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import {
  CreateTaskRequest,
  TASK_REPOSITORY,
  TaskRepository,
} from "@tasks/domain/repositories/task-repository.interface";
import { of, throwError } from "rxjs";
import { CreateTaskUseCase } from "./create-task.use-case";

describe("CreateTaskUseCase", () => {
  let useCase: CreateTaskUseCase;
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

  const mockCreateRequest: CreateTaskRequest = {
    title: "Test Task",
    description: "Test Description",
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    dueDate: new Date("2024-12-31"),
  };

  beforeEach(() => {
    const taskRepositorySpy = jasmine.createSpyObj("TaskRepository", ["createTask", "getTasks", "tasks$"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: taskRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(CreateTaskUseCase);
    mockTaskRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should create task successfully and refresh task list", done => {
      mockTaskRepository.createTask.and.returnValue(of(mockTask));
      mockTaskRepository.getTasks.and.returnValue(of([mockTask]));

      useCase.execute(mockCreateRequest).subscribe({
        next: result => {
          expect(result).toEqual(mockTask);
          expect(mockTaskRepository.createTask).toHaveBeenCalledWith(mockCreateRequest);
          expect(mockTaskRepository.getTasks).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle repository error and show notification", done => {
      const error = new Error("Repository error");
      mockTaskRepository.createTask.and.returnValue(throwError(() => error));

      useCase.execute(mockCreateRequest).subscribe({
        error: err => {
          expect(err).toEqual(error);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al crear la tarea");
          done();
        },
      });
    });

    it("should call getTasks after successful creation", done => {
      mockTaskRepository.createTask.and.returnValue(of(mockTask));
      mockTaskRepository.getTasks.and.returnValue(of([mockTask]));

      useCase.execute(mockCreateRequest).subscribe({
        next: () => {
          expect(mockTaskRepository.createTask).toHaveBeenCalledBefore(mockTaskRepository.getTasks as jasmine.Spy);
          done();
        },
      });
    });
  });
});
