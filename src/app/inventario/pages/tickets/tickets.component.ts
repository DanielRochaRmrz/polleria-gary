import { Component, OnInit } from '@angular/core';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { UsersService } from '../../../usuarios/services/users.service';
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
  public users: any[] = [];
  public page: number = 0;
  public search: string = '';

  constructor(
    private usersService: UsersService,
    private ticketsService: TicketsService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadTickets()
  }

  loadTickets() {
    this.usersService.getUsers().subscribe( users => {
      users.usuario.forEach(u => {
        this.users.push({ id: u.id, usuario: u.usuario });
      });
    })
    this.ticketsService.getTickets().subscribe(resp => {
      this.tickets = resp.ticket;
      this.tickets.forEach( tk => {
        const usuario = this.users.find( u => u.id == tk.usuario_id);
        return tk.usuario = usuario.usuario;
      });
   });
  }

  openModal(ticket_id: number) {
    this.modalRef = this.modalService.open(TicketComponent, { data: { ticket_id } });
  }

  deleteProduct(id_ticket: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f1765',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, elimínalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ticketsService.deleteTicket(id_ticket).subscribe( resp => {
          if ( resp.status === true ) {
            Swal.fire({
              title: 'Éxito',
              text: resp.message,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0f1765',
              customClass: {
                container: 'my-swal'
              }
            }).then( () => {
              this.loadTickets();
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: resp.message,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0f1765',
              customClass: {
                container: 'my-swal'
              }
            })
          }

        });
      }
    });
  }

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
