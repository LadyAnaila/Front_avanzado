import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string, formatType: number): string | null {

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return null; 
    }


    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    switch (formatType) {
      case 1:
        return `${day}${month}${year}`;
      case 2:
        return `${day} / ${month} / ${year}`;
      case 3:
        return `${day}/${month}/${year}`;
      case 4:
        return `${year}-${month}-${day}`;
      default:
        return null;
    }
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
