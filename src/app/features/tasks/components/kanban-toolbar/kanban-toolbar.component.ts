import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";

import { LanguageSelectorComponent } from "../../../../shared/components/language-selector/language-selector.component";

interface User {
  name: string;
  lastName: string;
  email: string;
}

@Component({
  selector: "app-kanban-toolbar",
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatMenuModule, LanguageSelectorComponent, TranslateModule],
  templateUrl: "./kanban-toolbar.component.html",
  styleUrls: ["./kanban-toolbar.component.scss"],
})
export class KanbanToolbarComponent {
  @Input() title = "Tablero Kanban";
  @Input() currentUser$!: Observable<User | null>;
  @Output() logout = new EventEmitter<void>();
}
