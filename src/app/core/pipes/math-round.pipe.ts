import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'round'})
export class MathRoundPipe implements PipeTransform {

  transform(value: number) {
    return typeof value === 'number' ? Math.round(value) : value;
  }

}
