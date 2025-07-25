import { Task, TaskPriority, TaskStatus } from "./task.entity";

describe("Task Entity", () => {
  const mockTaskData = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    dueDate: "2024-12-31",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  describe("create", () => {
    it("should create a task with valid data", () => {
      const task = Task.create(mockTaskData);

      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe("1");
      expect(task.title).toBe("Test Task");
      expect(task.description).toBe("Test Description");
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.dueDate).toEqual(new Date("2024-12-31"));
      expect(task.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(task.updatedAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    });

    it("should create a task with null dueDate", () => {
      const taskDataWithNullDate = { ...mockTaskData, dueDate: null };
      const task = Task.create(taskDataWithNullDate);

      expect(task.dueDate).toBeNull();
    });
  });

  describe("isOverdue getter", () => {
    it("should return true for overdue task", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const overdueTaskData = {
        ...mockTaskData,
        dueDate: pastDate.toISOString(),
        status: TaskStatus.TODO,
      };

      const task = Task.create(overdueTaskData);
      expect(task.isOverdue).toBe(true);
    });

    it("should return false for non-overdue task", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const futureTaskData = {
        ...mockTaskData,
        dueDate: futureDate.toISOString(),
        status: TaskStatus.TODO,
      };

      const task = Task.create(futureTaskData);
      expect(task.isOverdue).toBe(false);
    });

    it("should return false for task without due date", () => {
      const taskDataWithoutDate = { ...mockTaskData, dueDate: null };
      const task = Task.create(taskDataWithoutDate);
      expect(task.isOverdue).toBe(false);
    });
  });

  describe("isCompleted getter", () => {
    it("should return true for completed task", () => {
      const completedTask = Task.create({ ...mockTaskData, status: TaskStatus.DONE });
      expect(completedTask.isCompleted).toBe(true);
    });

    it("should return false for non-completed task", () => {
      const todoTask = Task.create({ ...mockTaskData, status: TaskStatus.TODO });
      expect(todoTask.isCompleted).toBe(false);
    });
  });

  describe("isInProgress getter", () => {
    it("should return true for in-progress task", () => {
      const inProgressTask = Task.create({ ...mockTaskData, status: TaskStatus.IN_PROGRESS });
      expect(inProgressTask.isInProgress).toBe(true);
    });

    it("should return false for non-in-progress task", () => {
      const todoTask = Task.create({ ...mockTaskData, status: TaskStatus.TODO });
      expect(todoTask.isInProgress).toBe(false);
    });
  });

  describe("isUrgent getter", () => {
    it("should return true for urgent task", () => {
      const urgentTask = Task.create({ ...mockTaskData, priority: TaskPriority.URGENT });
      expect(urgentTask.isUrgent).toBe(true);
    });

    it("should return false for non-urgent task", () => {
      const lowTask = Task.create({ ...mockTaskData, priority: TaskPriority.LOW });
      expect(lowTask.isUrgent).toBe(false);
    });
  });
});
