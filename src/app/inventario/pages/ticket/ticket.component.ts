import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { TicketsService } from '../../services/tickets.service';
import { Detail, TicketDetails } from '../../interfaces/tickets.interface';
import { ProductsService } from '../../services/products.service';
import { Products } from '../../interfaces/products.interface';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  ls = localStorage;
  date!: string;
  totalTicket!: number;
  ticket_id!: number;
  ticket_type: string = '';
  ticketDetails!: TicketDetails;
  detailsTiket!: Detail[];
  products: any[] = [];
  public isLoadingResults = true;

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
    private productsService: ProductsService,
    private ticketService: TicketsService,
  ) {}

  ngOnInit(): void {

    this.productsService.getProducts().subscribe( data => {
      data.products.forEach( p => {
            this.products.push({ id: p.id, nombre: p.nombre });
      });
      this.ticketService.getTicket(this.ticket_id).subscribe( (data: TicketDetails) => {
        if (data) {
          this.ticketDetails = data;
          this.date = this.ticketDetails.ticket.created_at;
          this.totalTicket = this.ticketDetails.ticket.total;
          this.detailsTiket = this.ticketDetails.details;
          this.detailsTiket.forEach( dT => {
            const product = this.products.find( product => product.id ==  dT.product_id);
            return dT.nombreProducto = product.nombre;
          })
          this.isLoadingResults = false;
        }
      })
    });

  }
}
