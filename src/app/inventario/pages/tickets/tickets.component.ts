import { Component, OnInit } from '@angular/core';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { TicketsService } from '../../services/tickets.service';

import { Ticket } from '../../interfaces/tickets.interface';

import { ProductRegisterComponent } from '../product-register/product-register.component';
import { ProductUpdateComponent } from '../product-update/product-update.component';
import { TicketComponent } from '../ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  public namePage: string = 'TICKETS';
  public modalRef: MdbModalRef<ProductRegisterComponent> | null = null;
  public modalRefUpdate: MdbModalRef<ProductUpdateComponent> | null = null;
  public tickets: Ticket[] = [];
  public page: number = 0;
  public search: string = '';

  constructor(
    private ticketsService: TicketsService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadTickets()
  }

  loadTickets() {
    this.ticketsService.getTickets().subscribe(resp => {
      this.tickets = resp.ticket;
   });
  }

  openModal(ticket_id: number) {
    this.modalRef = this.modalService.open(TicketComponent, { data: { ticket_id } });
    this.modalRef.onClose.subscribe((msg: any) => {
      // this.loadProducts();
    });
  }

  openModalUpdate(id_product: number) {
    this.modalRefUpdate = this.modalService.open(ProductUpdateComponent, { data: { id_product } });
    this.modalRefUpdate.onClose.subscribe((msg: any) => {
      localStorage.removeItem('id_producto');
      // this.loadProducts();
    });
  }

  // deleteProduct(id_product: number) {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: "¡No podrás revertir esto!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#0f1765',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: '¡Sí, elimínalo!',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.productsService.deleteProduct(id_product).subscribe( resp => {
  //         if ( resp.status === true ) {
  //           Swal.fire({
  //             title: 'Éxito',
  //             text: resp.message,
  //             icon: 'success',
  //             confirmButtonText: 'Aceptar',
  //             confirmButtonColor: '#0f1765',
  //             customClass: {
  //               container: 'my-swal'
  //             }
  //           }).then( () => {
  //             this.loadProducts();
  //           });
  //         } else {
  //           Swal.fire({
  //             title: 'Error',
  //             text: resp.message,
  //             icon: 'error',
  //             confirmButtonText: 'Aceptar',
  //             confirmButtonColor: '#0f1765',
  //             customClass: {
  //               container: 'my-swal'
  //             }
  //           })
  //         }

  //       });
  //     }
  //   });
  // }

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if ( this.page > 0 ) {
      this.page -= 5;
    }
  }

  onSearchTicket( search: string  ) {
    this.page = 0;
    this.search = search;
  }

}
