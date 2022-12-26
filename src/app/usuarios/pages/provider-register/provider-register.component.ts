import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { RfcValidatorService } from '../../../shared/validator/rfc-validator.service';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-provider-register',
  templateUrl: './provider-register.component.html',
  styleUrls: ['./provider-register.component.scss'],
})
export class ProviderRegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    rfc: [
      '',
      [Validators.required, Validators.minLength(12), Validators.maxLength(13)],
      [this.rfcValidator],
    ],
  });

  get rfcErrorMsg(): string {
    const errors = this.miFormulario.get('rfc')?.errors;
    if (errors?.['required']) {
      return 'El campo RFC es obligatorio';
    } else if (errors?.['rfcRegistrado']) {
      return 'El RFC ya esta dado de alta';
    } else if (errors?.['minlength'] || errors?.['maxlength']) {
      return 'El RFC debe contener 12 caracteres';
    }
    return '';
  }

  constructor(
    private fb: FormBuilder,
    private rfcValidator: RfcValidatorService,
    private providerService: ProviderService,
    public modalRef: MdbModalRef<ProviderRegisterComponent>
  ) {}

  ngOnInit(): void {
    this.miFormulario.get('rfc')?.valueChanges.subscribe((event) => {
      this.miFormulario
        .get('rfc')
        ?.setValue(event.toUpperCase(), { emitEvent: false });
    });
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  providerRegister() {
    console.log(this.miFormulario.value);
    const provider = this.miFormulario.value;
    this.providerService.providerRegister(provider).subscribe((resp) => {
      if (resp.status === true) {
        Swal.fire({
          title: 'Éxito',
          text: resp.message,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0f1765',
          customClass: {
            container: 'my-swal',
          },
        }).then(() => {
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
            container: 'my-swal',
          },
        });
      }
    });
  }
}
