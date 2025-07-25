import { DragDropModule } from "@angular/cdk/drag-drop";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";

import { TaskCardComponent } from "../task-card/task-card.component";
import { KanbanColumnComponent } from "./kanban-column.component";

describe("KanbanColumnComponent", () => {
  let component: KanbanColumnComponent;
  let fixture: ComponentFixture<KanbanColumnComponent>;

  const mockTaskData = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      dueDate: "2024-12-31",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: "2024-12-25",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  ];

  const mockTasks = mockTaskData.map(data => Task.create(data));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        KanbanColumnComponent,
        TaskCardComponent,
        DragDropModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanColumnComponent);
    component = fixture.componentInstance;

    component.tasks = mockTasks;
    component.status = TaskStatus.TODO;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display translated status title", () => {
    component.status = TaskStatus.TODO;
    const title = component.getStatusTitle(TaskStatus.TODO);
    expect(title).toBeDefined();
  });

  it("should return correct title for each status", () => {
    expect(component.getStatusTitle(TaskStatus.TODO)).toBeDefined();
    expect(component.getStatusTitle(TaskStatus.IN_PROGRESS)).toBeDefined();
    expect(component.getStatusTitle(TaskStatus.DONE)).toBeDefined();
  });

  it("should return status color", () => {
    const color = component.getStatusColor(TaskStatus.TODO);
    expect(color).toBeDefined();
    expect(typeof color).toBe("string");
  });

  it("should return container id for status", () => {
    const containerId = component.getContainerId(TaskStatus.TODO);
    expect(containerId).toBeDefined();
    expect(typeof containerId).toBe("string");
  });

  it("should render all tasks", () => {
    const taskCards = fixture.debugElement.queryAll(By.directive(TaskCardComponent));
    expect(taskCards.length).toBe(2);
  });

  it("should display empty state when no tasks", () => {
    component.tasks = [];
    fixture.detectChanges();

    const taskCards = fixture.debugElement.queryAll(By.directive(TaskCardComponent));
    expect(taskCards.length).toBe(0);
  });

  it("should emit editTask event when task card emits edit", () => {
    spyOn(component.editTask, "emit");
    const taskCard = fixture.debugElement.query(By.directive(TaskCardComponent));

    taskCard.componentInstance.edit.emit(mockTasks[0]);

    expect(component.editTask.emit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("should emit deleteTask event when task card emits delete", () => {
    spyOn(component.deleteTask, "emit");
    const taskCard = fixture.debugElement.query(By.directive(TaskCardComponent));

    taskCard.componentInstance.delete.emit(mockTasks[0]);

    expect(component.deleteTask.emit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("should update tasks when input changes", () => {
    const newTaskData = [
      {
        id: "3",
        title: "New Task",
        description: "New Description",
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        dueDate: null,
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z",
      },
    ];
    const newTasks = newTaskData.map(data => Task.create(data));

    component.tasks = newTasks;
    fixture.detectChanges();

    const taskCards = fixture.debugElement.queryAll(By.directive(TaskCardComponent));
    expect(taskCards.length).toBe(1);
    expect(taskCards[0].componentInstance.task.title).toBe("New Task");
  });

  it("should handle tasks with different priorities", () => {
    const mixedPriorityTaskData = [
      {
        ...mockTaskData[0],
        priority: TaskPriority.URGENT,
      },
      {
        ...mockTaskData[1],
        priority: TaskPriority.LOW,
      },
    ];
    const mixedPriorityTasks = mixedPriorityTaskData.map(data => Task.create(data));

    component.tasks = mixedPriorityTasks;
    fixture.detectChanges();

    const taskCards = fixture.debugElement.queryAll(By.directive(TaskCardComponent));
    expect(taskCards.length).toBe(2);
    expect(taskCards[0].componentInstance.task.priority).toBe(TaskPriority.URGENT);
    expect(taskCards[1].componentInstance.task.priority).toBe(TaskPriority.LOW);
  });

  it("should track tasks by id for performance", () => {
    const trackResult1 = component.trackByTaskId(0, mockTasks[0]);
    const trackResult2 = component.trackByTaskId(1, mockTasks[1]);

    expect(trackResult1).toBe("1");
    expect(trackResult2).toBe("2");
  });

  it("should handle different task statuses", () => {
    component.status = TaskStatus.IN_PROGRESS;
    expect(component.getStatusTitle(TaskStatus.IN_PROGRESS)).toBeDefined();

    component.status = TaskStatus.DONE;
    expect(component.getStatusTitle(TaskStatus.DONE)).toBeDefined();
  });

  it("should handle connected containers input", () => {
    const containers = ["todo-container", "progress-container", "done-container"];

    component.connectedContainers = containers;

    expect(component.connectedContainers).toEqual(containers);
  });

  it("should handle default status in getStatusTitle", () => {
    const result = component.getStatusTitle("UNKNOWN_STATUS" as TaskStatus);

    expect(result).toBe("UNKNOWN_STATUS");
  });

  it("should have all required inputs and outputs", () => {
    expect(component.status).toBeDefined();
    expect(component.tasks).toBeDefined();
    expect(component.connectedContainers).toBeDefined();

    expect(component.taskDrop).toBeDefined();
    expect(component.dragStart).toBeDefined();
    expect(component.dragEnd).toBeDefined();
    expect(component.addTask).toBeDefined();
    expect(component.editTask).toBeDefined();
    expect(component.deleteTask).toBeDefined();
  });
});
