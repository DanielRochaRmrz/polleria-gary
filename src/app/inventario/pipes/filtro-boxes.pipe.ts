import { Pipe, PipeTransform } from '@angular/core';
import { Caja } from '../interfaces/boxes.interfaces';

@Pipe({
  name: 'filtroBoxes'
})
export class FiltroBoxesPipe implements PipeTransform {

  transform( boxes: Caja[], page: number = 0, search = '' ): Caja[] {

    if( search.length === 0 )
      return boxes.slice(page, page + 5);

    const filterboxes = boxes.filter(box => box.barcode.toLowerCase().trim().includes( search.toLowerCase().trim() ) );

    return filterboxes.slice(page, page + 5);

  }

}
