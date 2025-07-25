import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Pipe({
  name: "optimizedTranslate",
  pure: false,
  standalone: true,
})
export class OptimizedTranslatePipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject<void>();
  private lastKey: string = "";
  private lastParams: any = null;
  private lastResult: string = "";

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  transform(key: string, params?: any): string {
    if (this.lastKey === key && JSON.stringify(this.lastParams) === JSON.stringify(params)) {
      return this.lastResult;
    }

    this.lastKey = key;
    this.lastParams = params;

    this.translateService
      .get(key, params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.lastResult = result;
        this.cdr.markForCheck();
      });

    return this.translateService.instant(key, params);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
