import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { BarcodeValidatorService } from 'src/app/shared/validator/barcode-validator.service';
import { ProductsService } from '../../services/products.service';
import { ProviderService } from 'src/app/usuarios/services/provider.service';

import { Provider } from '../../../usuarios/interfaces/providers.interface';


@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.scss'],
})
export class ProductRegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    barcode: ['', [Validators.required], [this.barcodeValidator]],
    nombre: ['', [Validators.required]],
    costo_kilo: ['', [Validators.required, Validators.min(1)]],
    proveedor_id: ['', [Validators.required]],
  });

  get barcodeErrorMsg(): string {
    const errors = this.miFormulario.get('barcode')?.errors;
    if (errors?.['required']) {
      return 'El campo barcode es obligatorio';
    } else if (errors?.['barcodeRegistrado']) {
      return 'El barcode ya pertenece a otro producto';
    }
    return '';
  }

  get costoKiloErrorMsg(): string {
    const errors = this.miFormulario.get('stock')?.errors;
    console.log(errors);

    if (errors?.['required']) {
      return 'El campo costo por kilo es obligatorio';
    } else if (errors?.['min']) {
      return 'El campo costo por kilo debe ser mayor a 0';
    }
    return '';
  }

  providers: Provider[] = [];
  providerSelect : Provider | undefined;
  termino: string = '';
  providerID!: number;

  constructor(
    private fb: FormBuilder,
    private barcodeValidator: BarcodeValidatorService,
    private productsService: ProductsService,
    private providerservice:ProviderService,
    public modalRef: MdbModalRef<ProductRegisterComponent>
  ) {}

  ngOnInit(): void {
    this.loadProviders()
   }

   loadProviders() {
    this.providerservice.getProviders().subscribe( resp => {
      this.providers = resp.providers;
      console.log('provider -->', this.providers);

    });
  }

  getsearch() {
    this.termino = this.miFormulario.get('proveedor_id')?.value;
    if (!this.termino) {
      return;
    }
    this.providerservice.search( this.termino.trim() ).subscribe( resp => this.providers = resp);
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  optionSelected( e: MatAutocompleteSelectedEvent ) {
    if (!e.option.value) {
      this.providerSelect = undefined;
      return;
    }
    const provider: Provider = e.option.value;
    this.miFormulario.get('proveedor_id')?.setValue(provider.nombre);
    this.providerID = Number(provider.id);
  }

  productRegister() {
    console.log(this.miFormulario.value);
    const product = this.miFormulario.value;
    this.productsService.productRegister(product).subscribe((resp) => {
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
