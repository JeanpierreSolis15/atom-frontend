import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-language-selector",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
  templateUrl: "./language-selector.component.html",
  styleUrls: ["./language-selector.component.scss"],
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  currentLang: "es" | "en" = "es";
  private destroy$ = new Subject<void>();

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.currentLang = (this.translateService.currentLang as "es" | "en") || "es";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setLanguage(lang: "es" | "en"): void {
    this.translateService.use(lang);
    this.currentLang = lang;
    localStorage.setItem("preferredLanguage", lang);
  }
}
