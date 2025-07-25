import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-translation-loader",
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule, TranslateModule],
  templateUrl: "./translation-loader.component.html",
  styleUrls: ["./translation-loader.component.scss"],
})
export class TranslationLoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
