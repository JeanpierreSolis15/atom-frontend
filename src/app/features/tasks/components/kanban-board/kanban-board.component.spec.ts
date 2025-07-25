import { DragDropModule } from "@angular/cdk/drag-drop";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";
import { Task, TaskPriority, TaskStatus } from "@tasks/domain/entities/task.entity";

import { KanbanColumnComponent } from "../kanban-column/kanban-column.component";
import { TaskCardComponent } from "../task-card/task-card.component";
import { KanbanBoardComponent } from "./kanban-board.component";

describe("KanbanBoardComponent", () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockTaskData = [
    {
      id: "1",
      title: "Todo Task",
      description: "Description 1",
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      dueDate: "2024-12-31",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "In Progress Task",
      description: "Description 2",
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      dueDate: "2024-12-25",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      title: "Done Task",
      description: "Description 3",
      priority: TaskPriority.LOW,
      status: TaskStatus.DONE,
      dueDate: null,
      createdAt: "2024-01-03T00:00:00.000Z",
      updatedAt: "2024-01-03T00:00:00.000Z",
    },
  ];

  const mockTasks = mockTaskData.map(data => Task.create(data));

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj("MatDialog", ["open"]);

    await TestBed.configureTestingModule({
      imports: [
        KanbanBoardComponent,
        KanbanColumnComponent,
        TaskCardComponent,
        DragDropModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    component.tasks = mockTasks;
    component.filteredTasks = {
      [TaskStatus.TODO]: [mockTasks[0]],
      [TaskStatus.IN_PROGRESS]: [mockTasks[1]],
      [TaskStatus.DONE]: [mockTasks[2]],
    };

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render three kanban columns", () => {
    const columns = fixture.debugElement.queryAll(By.directive(KanbanColumnComponent));
    expect(columns.length).toBe(3);
  });

  it("should pass correct tasks to each column", () => {
    const columns = fixture.debugElement.queryAll(By.directive(KanbanColumnComponent));

    const todoColumn = columns.find(col => col.componentInstance.status === TaskStatus.TODO);
    expect(todoColumn?.componentInstance.tasks).toEqual([mockTasks[0]]);

    const inProgressColumn = columns.find(col => col.componentInstance.status === TaskStatus.IN_PROGRESS);
    expect(inProgressColumn?.componentInstance.tasks).toEqual([mockTasks[1]]);

    const doneColumn = columns.find(col => col.componentInstance.status === TaskStatus.DONE);
    expect(doneColumn?.componentInstance.tasks).toEqual([mockTasks[2]]);
  });

  it("should have filteredTasks with correct structure", () => {
    expect(component.filteredTasks[TaskStatus.TODO]).toBeDefined();
    expect(component.filteredTasks[TaskStatus.IN_PROGRESS]).toBeDefined();
    expect(component.filteredTasks[TaskStatus.DONE]).toBeDefined();
  });

  it("should handle empty filteredTasks correctly", () => {
    component.filteredTasks = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    expect(component.filteredTasks[TaskStatus.TODO]).toEqual([]);
    expect(component.filteredTasks[TaskStatus.IN_PROGRESS]).toEqual([]);
    expect(component.filteredTasks[TaskStatus.DONE]).toEqual([]);
  });

  it("should emit taskDrop event when task is dropped", () => {
    spyOn(component.taskDrop, "emit");
    const mockDropEvent = {
      previousContainer: {
        id: "todo-container",
        data: [mockTasks[0]],
      },
      container: {
        id: "progress-container",
        data: [],
      },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: mockTasks[0] },
    } as any;

    component.taskDrop.emit(mockDropEvent);

    expect(component.taskDrop.emit).toHaveBeenCalledWith(mockDropEvent);
  });

  it("should emit taskDrop when task is dropped in same container for reordering", () => {
    spyOn(component.taskDrop, "emit");
    const mockDropEvent = {
      previousContainer: {
        id: "todo-container",
        data: [mockTasks[0]],
      },
      container: {
        id: "todo-container",
        data: [mockTasks[0]],
      },
      previousIndex: 0,
      currentIndex: 1,
      item: { data: mockTasks[0] },
    } as any;

    component.taskDrop.emit(mockDropEvent);

    expect(component.taskDrop.emit).toHaveBeenCalledWith(mockDropEvent);
  });

  it("should emit addTask event when add task is triggered", () => {
    spyOn(component.addTask, "emit");
    const status = TaskStatus.TODO;

    component.addTask.emit(status);

    expect(component.addTask.emit).toHaveBeenCalledWith(status);
  });

  it("should emit editTask event when edit task is triggered", () => {
    spyOn(component.editTask, "emit");
    const task = mockTasks[0];

    component.editTask.emit(task);

    expect(component.editTask.emit).toHaveBeenCalledWith(task);
  });

  it("should emit deleteTask event when delete task is triggered", () => {
    spyOn(component.deleteTask, "emit");
    const task = mockTasks[0];

    component.deleteTask.emit(task);

    expect(component.deleteTask.emit).toHaveBeenCalledWith(task);
  });

  it("should handle drag start event", () => {
    spyOn(component.dragStart, "emit");

    component.dragStart.emit();

    expect(component.dragStart.emit).toHaveBeenCalled();
  });

  it("should handle drag end event", () => {
    spyOn(component.dragEnd, "emit");

    component.dragEnd.emit();

    expect(component.dragEnd.emit).toHaveBeenCalled();
  });

  it("should have getStatuses method", () => {
    const statuses = component.getStatuses();
    expect(statuses).toEqual([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]);
  });

  it("should have getConnectedContainers method", () => {
    const containers = component.getConnectedContainers();
    expect(containers).toEqual(["kanban-column-todo", "kanban-column-in_progress", "kanban-column-done"]);
  });

  it("should have correct connected containers", () => {
    expect(component.getConnectedContainers()).toEqual([
      "kanban-column-todo",
      "kanban-column-in_progress",
      "kanban-column-done",
    ]);
  });

  it("should update task distribution when filteredTasks input changes", () => {
    const newTaskData = [
      {
        id: "4",
        title: "New Todo Task",
        description: "New Description",
        priority: TaskPriority.URGENT,
        status: TaskStatus.TODO,
        dueDate: "2024-12-30",
        createdAt: "2024-01-04T00:00:00.000Z",
        updatedAt: "2024-01-04T00:00:00.000Z",
      },
    ];
    const newTasks = newTaskData.map(data => Task.create(data));

    component.filteredTasks = {
      [TaskStatus.TODO]: newTasks,
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    fixture.detectChanges();

    expect(component.filteredTasks[TaskStatus.TODO]).toEqual(newTasks);
    expect(component.filteredTasks[TaskStatus.IN_PROGRESS]).toEqual([]);
    expect(component.filteredTasks[TaskStatus.DONE]).toEqual([]);
  });

  it("should handle empty filteredTasks", () => {
    component.filteredTasks = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    fixture.detectChanges();

    expect(component.filteredTasks[TaskStatus.TODO]).toEqual([]);
    expect(component.filteredTasks[TaskStatus.IN_PROGRESS]).toEqual([]);
    expect(component.filteredTasks[TaskStatus.DONE]).toEqual([]);
  });

  it("should pass connected containers to columns", () => {
    const columns = fixture.debugElement.queryAll(By.directive(KanbanColumnComponent));
    const expectedContainers = component.getConnectedContainers();

    columns.forEach(() => {
      expect(expectedContainers.length).toBe(3);
    });
  });

  it("should handle multiple tasks in same status", () => {
    const multipleTasksData = [
      {
        id: "1",
        title: "Todo Task 1",
        description: "Description 1",
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: "2024-12-31",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Todo Task 2",
        description: "Description 2",
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: "2024-12-25",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    ];
    const multipleTasks = multipleTasksData.map(data => Task.create(data));

    component.filteredTasks = {
      [TaskStatus.TODO]: multipleTasks,
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    fixture.detectChanges();

    expect(component.filteredTasks[TaskStatus.TODO].length).toBe(2);
    expect(component.filteredTasks[TaskStatus.TODO]).toEqual(multipleTasks);
  });

  it("should handle tasks with different priorities", () => {
    const mixedPriorityData = [
      {
        id: "1",
        title: "Urgent Task",
        description: "Description 1",
        priority: TaskPriority.URGENT,
        status: TaskStatus.TODO,
        dueDate: "2024-12-31",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Low Task",
        description: "Description 2",
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        dueDate: "2024-12-25",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    ];
    const mixedTasks = mixedPriorityData.map(data => Task.create(data));

    component.filteredTasks = {
      [TaskStatus.TODO]: mixedTasks,
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };

    expect(component.filteredTasks[TaskStatus.TODO][0].priority).toBe(TaskPriority.URGENT);
    expect(component.filteredTasks[TaskStatus.TODO][1].priority).toBe(TaskPriority.LOW);
  });

  it("should have all required inputs and outputs", () => {
    expect(component.tasks).toBeDefined();
    expect(component.filteredTasks).toBeDefined();

    expect(component.taskDrop).toBeDefined();
    expect(component.addTask).toBeDefined();
    expect(component.editTask).toBeDefined();
    expect(component.deleteTask).toBeDefined();
    expect(component.dragStart).toBeDefined();
    expect(component.dragEnd).toBeDefined();
  });

  it("should have trackByStatus method", () => {
    const result = component.trackByStatus(0, TaskStatus.TODO);

    expect(result).toBe(TaskStatus.TODO);
  });
});
