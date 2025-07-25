import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

import { AppComponent } from "./app.component";

class MockTranslateLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
        }),
      ],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the correct title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("atom-fe-challenge-template-ng-17");
  });

  it("should render translation loader and router outlet", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("app-translation-loader")).toBeTruthy();
    expect(compiled.querySelector("router-outlet")).toBeTruthy();
  });
});
