import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { UserValidatorService } from 'src/app/shared/validator/user-validator.service';
import { ValidatorService } from '../../../shared/validator/validator.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
})
export class UserRegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required], [this.userValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    },
    {
      validators: [
        this.validatorService.camposIguales('password', 'password_confirmation'),
      ],
    }
  );

  get usuarioErrorMsg(): string {
    const errors = this.miFormulario.get('usuario')?.errors;
    if (errors?.['required']) {
      return 'El campo usuario es obligatorio';
    } else if (errors?.['usuarioTomado']) {
      return 'El usuario ya fue tomado';
    }
    return '';
  }

  get getpasswordMsg(): string {
    const errors = this.miFormulario.get('password')?.errors;
    if (errors?.['required']) {
      return 'El campo contraseña es obligatorio';
    } else if (errors?.['minlength']) {
      return 'La contraseña debe de ser mayor a 8 caracteres';
    }
    return '';
  }

  get getPassConfirmMsg(): string {
    const errors = this.miFormulario.get('password_confirmation')?.errors;
    if (errors?.['required']) {
      return 'La confirmación de la contraseña es obligatoria';
    } else if (errors?.['noIguales']) {
      return 'Las contraseñas deben de ser iguales';
    }
    return '';
  }

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private userValidator: UserValidatorService,
    private usersService: UsersService,
    public modalRef: MdbModalRef<UserRegisterComponent>
  ) {}

  ngOnInit(): void {}

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  userRegister() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    const user = this.miFormulario.value;
    this.usersService.userRegister(user).subscribe((resp) => {
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
          text: resp.message,
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
