import { Pipe, PipeTransform } from '@angular/core';
import { formatCOP } from '../core/data';

@Pipe({ name: 'cop' })
export class CopPipe implements PipeTransform {
  transform(value: number): string {
    return formatCOP(value);
  }
}
