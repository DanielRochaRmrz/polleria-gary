import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/products.interface';

@Pipe({
  name: 'filtroProducts'
})
export class FiltroProductsPipe implements PipeTransform {

  transform( products: Product[], page: number = 0, search = '' ): Product[] {
    
    if( search.length === 0 )
      return products.slice(page, page + 5);

    const filterProducts = products.filter(pro => pro.nombre.toLowerCase().trim().includes( search.toLowerCase().trim() ) );

    return filterProducts.slice(page, page + 5);
  
  }

}
