import { TestBed } from "@angular/core/testing";
import { NotificationService } from "@core/services/notification.service";
import { TaskStatus } from "@tasks/domain/entities/task.entity";
import { MoveTaskRequest, TASK_REPOSITORY, TaskRepository } from "@tasks/domain/repositories/task-repository.interface";
import { of, throwError } from "rxjs";

import { MoveTaskUseCase } from "./move-task.use-case";

describe("MoveTaskUseCase", () => {
  let useCase: MoveTaskUseCase;
  let mockTaskRepository: jasmine.SpyObj<TaskRepository>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockMoveRequest: MoveTaskRequest = {
    taskId: "1",
    newStatus: TaskStatus.IN_PROGRESS,
  };

  beforeEach(() => {
    const taskRepositorySpy = jasmine.createSpyObj("TaskRepository", ["moveTask", "getTasks", "tasks$"]);
    const notificationServiceSpy = jasmine.createSpyObj("NotificationService", ["showError", "showSuccess"]);

    TestBed.configureTestingModule({
      providers: [
        MoveTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: taskRepositorySpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    useCase = TestBed.inject(MoveTaskUseCase);
    mockTaskRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
    mockNotificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  describe("execute", () => {
    it("should move task successfully and refresh task list", done => {
      mockTaskRepository.moveTask.and.returnValue(of(undefined));
      mockTaskRepository.getTasks.and.returnValue(of([]));

      useCase.execute(mockMoveRequest).subscribe({
        next: result => {
          expect(result).toBeUndefined();
          expect(mockTaskRepository.moveTask).toHaveBeenCalledWith(mockMoveRequest);
          expect(mockTaskRepository.getTasks).toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle repository error and show notification", done => {
      const error = new Error("Repository error");
      mockTaskRepository.moveTask.and.returnValue(throwError(() => error));

      useCase.execute(mockMoveRequest).subscribe({
        error: err => {
          expect(err).toEqual(error);
          expect(mockNotificationService.showError).toHaveBeenCalledWith("Error al mover la tarea");
          done();
        },
      });
    });

    it("should call getTasks after successful move", done => {
      mockTaskRepository.moveTask.and.returnValue(of(undefined));
      mockTaskRepository.getTasks.and.returnValue(of([]));

      useCase.execute(mockMoveRequest).subscribe({
        next: () => {
          expect(mockTaskRepository.moveTask).toHaveBeenCalledBefore(mockTaskRepository.getTasks as jasmine.Spy);
          done();
        },
      });
    });

    it("should not call getTasks if move fails", done => {
      const error = new Error("Repository error");
      mockTaskRepository.moveTask.and.returnValue(throwError(() => error));

      useCase.execute(mockMoveRequest).subscribe({
        error: () => {
          expect(mockTaskRepository.getTasks).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it("should handle different task statuses", done => {
      const moveToCompleted: MoveTaskRequest = {
        taskId: "1",
        newStatus: TaskStatus.DONE,
      };
      mockTaskRepository.moveTask.and.returnValue(of(undefined));
      mockTaskRepository.getTasks.and.returnValue(of([]));

      useCase.execute(moveToCompleted).subscribe({
        next: () => {
          expect(mockTaskRepository.moveTask).toHaveBeenCalledWith(moveToCompleted);
          done();
        },
      });
    });
  });
});
