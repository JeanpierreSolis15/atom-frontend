import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/kanban",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("@auth/auth.routes").then(m => m.AUTH_ROUTES),
  },
  {
    path: "kanban",
    loadComponent: () => import("@tasks/pages/kanban/kanban.component").then(m => m.KanbanComponent),
    canActivate: [authGuard],
  },
];
