import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { TranslationLoaderComponent } from "./shared/components/translation-loader/translation-loader.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, TranslationLoaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "atom-challenge-fe-template";
}
