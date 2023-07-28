import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { Usuario } from '../../interfaces/users.interfaces';
import { UsersService } from '../../services/users.service';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { UserUpdateComponent } from '../user-update/user-update.component';

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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public namePage: string = 'USUARIOS';
  public modalRef: MdbModalRef<UserRegisterComponent> | null = null;
  public modalRefUpdate: MdbModalRef<UserUpdateComponent> | null = null;
  public users: Usuario[] = [];
  public page: number = 0;
  public search: string = '';
  public isLoadingResults = true;

  displayedColumns: string[] = [
    '#',
    'Nombre',
    'Usuario',
    'Acciones',
  ];
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usersService: UsersService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase().trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadUsers() {
    this.usersService.getUsers().subscribe( resp => {
      this.users = resp.usuario;
      this.dataSource = new MatTableDataSource(this.users);
      this.paginator._intl.itemsPerPageLabel = 'usuarios por página';
      this.paginator._intl.nextPageLabel = 'página siguiente';
      this.paginator._intl.previousPageLabel = 'página anterior';
      this.paginator._intl.getRangeLabel = dutchRangeLabel;
      this.dataSource.paginator = this.paginator;
      this.isLoadingResults = false;
    });
  }

  openModal() {
    this.modalRef = this.modalService.open(UserRegisterComponent);
    this.modalRef.onClose.subscribe((msg: any) => {
      this.loadUsers();
    });
  }

  openModalUpdate(id_user: number) {
    this.modalRefUpdate = this.modalService.open(UserUpdateComponent, { data: { id_user } });
    this.modalRefUpdate.onClose.subscribe((msg: any) => {
      this.loadUsers();
    });
  }

  deleteUser(id_user: number) {
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
        this.usersService.userDelete(id_user).subscribe( resp => {
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
              this.loadUsers();
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

  onSearchUsuario( search: string  ) {
    this.page = 0;
    this.search = search;
  }

}
