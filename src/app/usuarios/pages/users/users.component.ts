import { Component, OnInit } from '@angular/core';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { Usuario } from '../../interfaces/users.interfaces';
import { UsersService } from '../../services/users.service';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { UserUpdateComponent } from '../user-update/user-update.component';

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

  constructor(
    private usersService: UsersService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe( resp => {
      this.users = resp.usuario;    
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
