import { Routes } from "@angular/router";

import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/kanban",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then(m => m.AUTH_ROUTES),
  },
  {
    path: "kanban",
    loadComponent: () => import("./features/tasks/pages/kanban/kanban.component").then(m => m.KanbanComponent),
    canActivate: [AuthGuard],
  },
];
