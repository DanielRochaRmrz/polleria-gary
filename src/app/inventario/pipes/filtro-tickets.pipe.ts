import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from '../interfaces/tickets.interface';

@Pipe({
  name: 'filtroTickets'
})
export class FiltroTicketsPipe implements PipeTransform {

  transform( tickets: Ticket[], page: number = 0, search = '' ): Ticket[] {

    if( search.length === 0 )
      return tickets.slice(page, page + 5);

    const filterTickets = tickets.filter(pro => pro.total.toString().toLowerCase().trim().includes( search.toLowerCase().trim() ) );

    return filterTickets.slice(page, page + 5);

  }

}
