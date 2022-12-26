import { Pipe, PipeTransform } from '@angular/core';
import { Provider } from '../interfaces/providers.interface';

@Pipe({
  name: 'filtroProviders'
})
export class FiltroProvidersPipe implements PipeTransform {

  transform( providers: Provider[], page: number = 0, search = '' ): Provider[] {

    if( search.length === 0)
      return providers.slice(page, page + 5);

    const filterProviders = providers.filter(prov => prov.nombre.toLowerCase().trim().includes( search.toLowerCase().trim() ) );

    return filterProviders.slice(page, page + 5);

  }

}
