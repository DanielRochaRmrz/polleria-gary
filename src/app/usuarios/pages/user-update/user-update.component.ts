import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/users.interfaces';



@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
    }
  );

  public user!: User;
  public id_user!: number;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    public modalRef: MdbModalRef<UserUpdateComponent>
  ) {}

  ngOnInit(): void {
    this.usersService.getUser(this.id_user).subscribe(user => {
      this.user = user.usuario;

      this.miFormulario.get('nombre')?.setValue(this.user.nombre);
      this.miFormulario.get('usuario')?.patchValue(this.user.usuario);
    });
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  userUpdate() {
    const user = this.miFormulario.value;
    this.usersService.userUpdate(user, this.id_user).subscribe((resp) => {
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
          this.modalRef.close();
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'El nombre de usuario ya existe',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0f1765',
          customClass: {
            container: 'my-swal'
          }
        })
      }
    })

  }

}
