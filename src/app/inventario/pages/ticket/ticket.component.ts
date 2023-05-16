import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  ls = localStorage;
  date = new Date();
  ticket_id!: number;

  get details() {
    return JSON.parse(this.ls.getItem('details') || '[]');
  }

  get detailsExist() {
    return JSON.parse(this.ls.getItem('detailsExist') || '[]');
  }

  get detailsTotal() {
    return this.details.reduce((acc: any, d: any) => acc + d.subtotal, 0);
  }

  constructor(
    public modalRef: MdbModalRef<TicketComponent>,
    private ticketService: TicketsService
  ) {}

  ngOnInit(): void {
    this.ticketService.getTicket(this.ticket_id).subscribe( data => {
      console.log('data ticket -->', data);
    })
  }
}
