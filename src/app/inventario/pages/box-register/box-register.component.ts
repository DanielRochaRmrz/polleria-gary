import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { BoxesService } from '../../services/boxes.service';
import { Product } from '../../interfaces/products.interface';
import { ProductsService } from '../../services/products.service';
import { BoxBarcodeValidatorService } from '../../../shared/validator/box-barcode-validator.service';

@Component({
  selector: 'app-box-register',
  templateUrl: './box-register.component.html',
  styleUrls: ['./box-register.component.scss'],
})
export class BoxRegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    barcode: ['', [Validators.required], [this.barcodeValidator]],
    producto_id: ['', [Validators.required]],
  });

  get barcodeErrorMsg(): string {
    const errors = this.miFormulario.get('barcode')?.errors;
    if (errors?.['required']) {
      return 'El campo barcode es obligatorio';
    } else if (errors?.['barcodeRegistrado']) {
      return 'El barcode ya pertenece a otra caja ó producto';
    }
    return '';
  }

  products: Product[] = [];
  productSelect : Product | undefined;
  termino: string = '';
  productID!: number;

  constructor(
    private fb: FormBuilder,
    private boxesServices: BoxesService,
    private barcodeValidator: BoxBarcodeValidatorService,
    private productsService: ProductsService,
    public modalRef: MdbModalRef<BoxRegisterComponent>
  ) {}

  ngOnInit(): void {}

  getsearch() {
    this.termino = this.miFormulario.get('producto_id')?.value;
    if (!this.termino) {
      return;
    }
    this.productsService.search( this.termino.trim() ).subscribe( resp => this.products = resp);
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  optionSelected( e: MatAutocompleteSelectedEvent ) {
    if (!e.option.value) {
      this.productSelect = undefined;
      return;
    }
    const producto: Product = e.option.value;
    this.miFormulario.get('producto_id')?.setValue(producto.nombre);
    this.productID = Number(producto.id);
  }

  boxRegister() {
    this.miFormulario.get('producto_id')?.setValue(this.productID);
    const box = this.miFormulario.value;
    this.boxesServices.boxRegister(box).subscribe((resp) => {
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
