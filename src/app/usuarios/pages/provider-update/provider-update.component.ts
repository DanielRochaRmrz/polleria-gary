import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { ProviderService } from '../../services/provider.service';
import { RfcUpdateValidatorService } from '../../../shared/validator/rfc-update-validator.service';


import { Provider } from '../../interfaces/providers.interface';

@Component({
  selector: 'app-provider-update',
  templateUrl: './provider-update.component.html',
  styleUrls: ['./provider-update.component.scss'],
})
export class ProviderUpdateComponent implements OnInit {
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
    } else if(errors?.['minlength'] || errors?.['maxlength']) {
      return 'El RFC debe contener 12 caracteres';
    }
    return '';
  }

  public provider!: Provider;
  public id_provider!: number;

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private rfcValidator: RfcUpdateValidatorService,
    public modalRef: MdbModalRef<ProviderUpdateComponent>
  ) {}

  ngOnInit(): void {
    localStorage.setItem('id_provider', this.id_provider.toString());

    this.miFormulario.get('rfc')?.valueChanges.subscribe((event) => {
      this.miFormulario
        .get('rfc')
        ?.setValue(event.toUpperCase(), { emitEvent: false });
    });

    this.providerService.getProvider(this.id_provider).subscribe(provider => {
      console.log(provider);

      this.provider = provider.provider;

      this.miFormulario.get('nombre')?.setValue(this.provider.nombre);
      this.miFormulario.get('rfc')?.patchValue(this.provider.rfc);
    });
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  providerUpdate() {
    console.log(this.miFormulario.value);
    const provider = this.miFormulario.value;
    this.providerService.providerUpdate(provider, this.id_provider).subscribe((resp) => {
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
          localStorage.removeItem('id_provider');
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
