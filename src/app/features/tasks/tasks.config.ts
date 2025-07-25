import { Provider } from "@angular/core";
import { CreateTaskUseCase } from "@tasks/application/use-cases/create-task.use-case";
import { DeleteTaskUseCase } from "@tasks/application/use-cases/delete-task.use-case";
import { GetTasksUseCase } from "@tasks/application/use-cases/get-tasks.use-case";
import { MoveTaskUseCase } from "@tasks/application/use-cases/move-task.use-case";
import { UpdateTaskUseCase } from "@tasks/application/use-cases/update-task.use-case";
import { TASK_REPOSITORY } from "@tasks/domain/repositories/task-repository.interface";
import { TaskRepositoryImpl } from "@tasks/infrastructure/repositories/task-repository.impl";

export const TASKS_PROVIDERS: Provider[] = [
  {
    provide: TASK_REPOSITORY,
    useClass: TaskRepositoryImpl,
  },
  GetTasksUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  MoveTaskUseCase,
];
