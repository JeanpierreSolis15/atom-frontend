import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "translate",
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(key: string, params?: any[]): string {
    if (params && params.length > 0) {
      const interpolateParams: any = {};
      params.forEach((param, index) => {
        interpolateParams[index] = param;
      });
      return this.translateService.instant(key, interpolateParams);
    }
    return this.translateService.instant(key);
  }
}
