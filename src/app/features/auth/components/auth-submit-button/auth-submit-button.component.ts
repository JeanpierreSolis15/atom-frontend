import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-auth-submit-button",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: "./auth-submit-button.component.html",
  styleUrls: ["./auth-submit-button.component.scss"],
})
export class AuthSubmitButtonComponent {
  @Input() loading = false;
  @Input() disabled = false;
  @Input() icon = "";
  @Input() loadingText = "";
  @Input() text = "";
  @Input() type = "submit";
}
