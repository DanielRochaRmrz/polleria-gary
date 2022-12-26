import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    usuario: ['', [ Validators.required ]],
    password: ['', [ Validators.required, Validators.minLength(8)]]
  });

  get getPasswordMsg(): string {
    const errors = this.miFormulario.get('password')?.errors;
    if ( errors?.['required'] ) {
      return 'La contraseña es obligatoria';
    } else if ( errors?.['minlength'] ) {
      return 'La contraseña debe de ser mayor a 8 caracteres';
    }
    return ''
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  
  campoNoValido( campo: string ) {
    return this.miFormulario.get(campo)?.invalid
            && this.miFormulario.get(campo)?.touched;
  }

  login() {
    const { usuario, password } = this.miFormulario.value;
    this.authService.login( usuario, password ).subscribe((resp) => {
      if ( resp === true ) {
        this.router.navigateByUrl('home');
      } else {
        Swal.fire({
          title: 'Error',
          text: resp,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0f1765'
        })
      }
    });
  }
}
