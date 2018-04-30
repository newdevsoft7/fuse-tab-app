import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'partialAmount'
})
export class PartialAmountPipe implements PipeTransform {
  transform(data: any, start: number, count: number) {
    const end = start + count;
    return data.slice(start, end);
  }
}
