import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-brand-section",
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: "./brand-section.component.html",
  styleUrls: ["./brand-section.component.scss"],
})
export class BrandSectionComponent {
  @Input() title = "AUTH.BRAND_TITLE";
  @Input() subtitle = "AUTH.BRAND_SUBTITLE";
  @Input() icon = "task_alt";
}
