import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";

import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";
import { TaskCardComponent } from "./task-card.component";

describe("TaskCardComponent", () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

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

  const mockTask = Task.create(mockTaskData);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskCardComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatChipsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("onEdit", () => {
    it("should emit edit event", () => {
      spyOn(component.edit, "emit");

      component.onEdit();

      expect(component.edit.emit).toHaveBeenCalledWith(mockTask);
    });
  });

  describe("onDelete", () => {
    it("should emit delete event", () => {
      spyOn(component.delete, "emit");

      component.onDelete();

      expect(component.delete.emit).toHaveBeenCalledWith(mockTask);
    });
  });

  describe("getPriorityColor", () => {
    it("should return correct color for each priority", () => {
      expect(component.getPriorityColor(TaskPriority.LOW)).toBe("primary");
      expect(component.getPriorityColor(TaskPriority.MEDIUM)).toBe("accent");
      expect(component.getPriorityColor(TaskPriority.HIGH)).toBe("warn");
      expect(component.getPriorityColor(TaskPriority.URGENT)).toBe("warn");
    });
  });

  describe("getPriorityIcon", () => {
    it("should return correct icon for each priority", () => {
      expect(component.getPriorityIcon(TaskPriority.LOW)).toBe("arrow_downward");
      expect(component.getPriorityIcon(TaskPriority.MEDIUM)).toBe("remove");
      expect(component.getPriorityIcon(TaskPriority.HIGH)).toBe("arrow_upward");
      expect(component.getPriorityIcon(TaskPriority.URGENT)).toBe("priority_high");
    });
  });

  describe("getTaskClasses", () => {
    it("should return correct classes for completed task", () => {
      const completedTask = Task.create({
        ...mockTaskData,
        status: TaskStatus.DONE,
      });
      component.task = completedTask;

      expect(component.getTaskClasses()).toContain("completed");
    });

    it("should return correct classes for in-progress task", () => {
      const inProgressTask = Task.create({
        ...mockTaskData,
        status: TaskStatus.IN_PROGRESS,
      });
      component.task = inProgressTask;

      expect(component.getTaskClasses()).toContain("in-progress");
    });

    it("should return correct classes for urgent task", () => {
      const urgentTask = Task.create({
        ...mockTaskData,
        priority: TaskPriority.URGENT,
      });
      component.task = urgentTask;

      expect(component.getTaskClasses()).toContain("urgent");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const testDate = new Date("2024-12-31");
      const formattedDate = component.formatDate(testDate);

      expect(formattedDate).toBeDefined();
      expect(typeof formattedDate).toBe("string");
    });
  });

  describe("isOverdue", () => {
    it("should return true for overdue date", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      expect(component.isOverdue(pastDate)).toBe(true);
    });

    it("should return false for future date", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(component.isOverdue(futureDate)).toBe(false);
    });
  });
});
