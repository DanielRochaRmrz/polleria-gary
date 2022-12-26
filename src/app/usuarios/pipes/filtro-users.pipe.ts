import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../interfaces/users.interfaces';

@Pipe({
  name: 'filtroUsers'
})
export class FiltroUsersPipe implements PipeTransform {

  transform( users: Usuario[], page: number = 0, search = '' ): Usuario[] {
    
    if( search.length === 0)
      return users.slice(page, page + 5);
    
    const filterUsers = users.filter(us => us.nombre.toLowerCase().trim().includes( search.toLowerCase().trim() ) );

    return filterUsers.slice(page, page + 5);
  
  }

}
