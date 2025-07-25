import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { CreateTaskUseCase } from "@tasks/application/use-cases/create-task.use-case";
import { DeleteTaskUseCase } from "@tasks/application/use-cases/delete-task.use-case";
import { GetTasksUseCase } from "@tasks/application/use-cases/get-tasks.use-case";
import { MoveTaskUseCase } from "@tasks/application/use-cases/move-task.use-case";
import { UpdateTaskUseCase } from "@tasks/application/use-cases/update-task.use-case";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import {
  CreateTaskRequest,
  MoveTaskRequest,
  UpdateTaskRequest,
} from "@tasks/domain/repositories/task-repository.interface";
import { of } from "rxjs";

import { TaskService } from "./task.service";

describe("TaskService", () => {
  let service: TaskService;
  let mockGetTasksUseCase: jasmine.SpyObj<GetTasksUseCase>;
  let mockCreateTaskUseCase: jasmine.SpyObj<CreateTaskUseCase>;
  let mockUpdateTaskUseCase: jasmine.SpyObj<UpdateTaskUseCase>;
  let mockDeleteTaskUseCase: jasmine.SpyObj<DeleteTaskUseCase>;
  let mockMoveTaskUseCase: jasmine.SpyObj<MoveTaskUseCase>;
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
    const getTasksUseCaseSpy = jasmine.createSpyObj("GetTasksUseCase", ["execute"]);
    const createTaskUseCaseSpy = jasmine.createSpyObj("CreateTaskUseCase", ["execute"]);
    const updateTaskUseCaseSpy = jasmine.createSpyObj("UpdateTaskUseCase", ["execute"]);
    const deleteTaskUseCaseSpy = jasmine.createSpyObj("DeleteTaskUseCase", ["execute"]);
    const moveTaskUseCaseSpy = jasmine.createSpyObj("MoveTaskUseCase", ["execute"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "showSuccess",
      "showInfo",
      "showError",
    ]);

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: GetTasksUseCase, useValue: getTasksUseCaseSpy },
        { provide: CreateTaskUseCase, useValue: createTaskUseCaseSpy },
        { provide: UpdateTaskUseCase, useValue: updateTaskUseCaseSpy },
        { provide: DeleteTaskUseCase, useValue: deleteTaskUseCaseSpy },
        { provide: MoveTaskUseCase, useValue: moveTaskUseCaseSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    service = TestBed.inject(TaskService);
    mockGetTasksUseCase = TestBed.inject(GetTasksUseCase) as jasmine.SpyObj<GetTasksUseCase>;
    mockCreateTaskUseCase = TestBed.inject(CreateTaskUseCase) as jasmine.SpyObj<CreateTaskUseCase>;
    mockUpdateTaskUseCase = TestBed.inject(UpdateTaskUseCase) as jasmine.SpyObj<UpdateTaskUseCase>;
    mockDeleteTaskUseCase = TestBed.inject(DeleteTaskUseCase) as jasmine.SpyObj<DeleteTaskUseCase>;
    mockMoveTaskUseCase = TestBed.inject(MoveTaskUseCase) as jasmine.SpyObj<MoveTaskUseCase>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getTasks", () => {
    it("should call GetTasksUseCase and return tasks", done => {
      const expectedTasks = [mockTask];
      mockGetTasksUseCase.execute.and.returnValue(of(expectedTasks));

      service.getTasks().subscribe({
        next: tasks => {
          expect(tasks).toEqual(expectedTasks);
          expect(mockGetTasksUseCase.execute).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe("createTask", () => {
    it("should create task and show success notification", done => {
      const createRequest: CreateTaskRequest = {
        title: "New Task",
        description: "New Description",
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date(),
      };
      mockCreateTaskUseCase.execute.and.returnValue(of(mockTask));

      service.createTask(createRequest).subscribe({
        next: task => {
          expect(task).toEqual(mockTask);
          expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(createRequest);
          expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Tarea creada exitosamente");
          done();
        },
      });
    });
  });

  describe("updateTask", () => {
    it("should update task and show success notification", done => {
      const taskId = "1";
      const updateRequest: UpdateTaskRequest = {
        title: "Updated Task",
      };
      mockUpdateTaskUseCase.execute.and.returnValue(of(mockTask));

      service.updateTask(taskId, updateRequest).subscribe({
        next: task => {
          expect(task).toEqual(mockTask);
          expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith(taskId, updateRequest);
          expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Tarea actualizada exitosamente");
          done();
        },
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete task and show success notification", done => {
      const taskId = "1";
      mockDeleteTaskUseCase.execute.and.returnValue(of(undefined));

      service.deleteTask(taskId).subscribe({
        next: result => {
          expect(result).toBeUndefined();
          expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith(taskId);
          expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Tarea eliminada exitosamente");
          done();
        },
      });
    });
  });

  describe("moveTask", () => {
    it("should move task and show info notification", done => {
      const moveRequest: MoveTaskRequest = {
        taskId: "1",
        newStatus: TaskStatus.IN_PROGRESS,
      };
      mockMoveTaskUseCase.execute.and.returnValue(of(undefined));

      service.moveTask(moveRequest).subscribe({
        next: result => {
          expect(result).toBeUndefined();
          expect(mockMoveTaskUseCase.execute).toHaveBeenCalledWith(moveRequest);
          expect(mockNotificationService.showInfo).toHaveBeenCalledWith("Tarea movida exitosamente");
          done();
        },
      });
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status and show success notification", done => {
      const taskId = "1";
      const newStatus = TaskStatus.DONE;
      mockUpdateTaskUseCase.execute.and.returnValue(of(mockTask));

      service.updateTaskStatus(taskId, newStatus).subscribe({
        next: task => {
          expect(task).toEqual(mockTask);
          expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith(taskId, { status: newStatus });
          expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Estado de tarea actualizado");
          done();
        },
      });
    });
  });
});
