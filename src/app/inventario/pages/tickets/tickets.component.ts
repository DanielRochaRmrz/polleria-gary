import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { UsersService } from '../../../usuarios/services/users.service';
import { TicketsService } from '../../services/tickets.service';

import { Ticket } from '../../interfaces/tickets.interface';

import { ProductRegisterComponent } from '../product-register/product-register.component';
import { ProductUpdateComponent } from '../product-update/product-update.component';
import { TicketComponent } from '../ticket/ticket.component';
import { Usuario } from 'src/app/usuarios/interfaces/users.interfaces';

const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 van ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

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
  public users: Usuario[] = [];
  public page: number = 0;
  public search: string = '';
  public isLoadingResults = true;

  displayedColumns: string[] = [
    '#',
    'Caja/Producto',
    'Usuario',
    'Creado',
    'Acciones',
  ];
  dataSource!: MatTableDataSource<Ticket>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usersService: UsersService,
    private ticketsService: TicketsService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadTickets()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase().trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadTickets() {
    this.usersService.getUsers().subscribe( users => {
      this.users = users.usuario;
      this.users.forEach(u => {
       return { id: u.id, usuario: u.usuario };
      });
      this.ticketsService.getTickets().subscribe(resp => {
        this.tickets = resp.ticket;
        console.log(this.tickets);

        this.tickets.forEach( tk => {
          const usuario: any = this.users.find( u => u.id == tk.usuario_id);
          tk.usuario = usuario.usuario;
          tk.tipoTK = tk.tipo === 1 ? 'Entrada' : tk.tipo === 2 ? 'Salida' : '';
        });
        this.tickets.sort((a, b) => {
          let inicio = new Date(a.created_at);
          let final  = new Date(b.created_at)
          if (inicio > final) {
            return -1;
          }
          return 0;
        });
        this.dataSource = new MatTableDataSource(this.tickets);
        this.paginator._intl.itemsPerPageLabel = 'tickets por página';
        this.paginator._intl.nextPageLabel = 'página siguiente';
        this.paginator._intl.previousPageLabel = 'página anterior';
        this.paginator._intl.getRangeLabel = dutchRangeLabel;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
     });
    });
  }

  openModal(ticket_id: number, ticket_type: string) {
    this.modalRef = this.modalService.open(TicketComponent, { data: { ticket_id, ticket_type } });
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
