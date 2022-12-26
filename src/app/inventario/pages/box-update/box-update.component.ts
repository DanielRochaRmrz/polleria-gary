import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { Product, Producto } from '../../interfaces/products.interface';
import { BoxesService } from '../../services/boxes.service';
import { ProductsService } from '../../services/products.service';
import { BoxbarcodeUpdateValidatorService } from 'src/app/shared/validator/boxbarcode-update-validator.service';
import { Caja } from '../../interfaces/boxes.interfaces';

@Component({
  selector: 'app-box-update',
  templateUrl: './box-update.component.html',
  styleUrls: ['./box-update.component.scss'],
})
export class BoxUpdateComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    barcode: ['', [Validators.required], []],
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
  product!: Producto;
  productSelect: Product | undefined;
  termino: string = '';
  productID!: number;
  id_box!: number;
  box!: Caja;

  constructor(
    private fb: FormBuilder,
    private boxesServices: BoxesService,
    private barcodeValidator: BoxbarcodeUpdateValidatorService,
    private productsService: ProductsService,
    public modalRef: MdbModalRef<BoxUpdateComponent>
  ) {}

  ngOnInit(): void {
    localStorage.setItem('id_box', this.id_box.toString());

    this.boxesServices.getBox(this.id_box).subscribe(box => {
      this.box = box.caja;
      this.miFormulario.get('barcode')?.setValue(this.box.barcode);
      this.productID = this.box.producto_id;
      this.productsService.getProduct( this.productID ).subscribe( resp => {
        this.product = resp.product;
        this.miFormulario.get('producto_id')?.setValue(this.product.nombre);
      });
    });

  }

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

  boxUpdate() {
    this.miFormulario.get('producto_id')?.setValue(this.productID);
    const box = this.miFormulario.value;
    this.boxesServices.updateBox(box, this.id_box).subscribe((resp) => {
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
          localStorage.removeItem('id_box');
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
        }).then( () => {
          this.productsService.getProduct( this.productID ).subscribe( resp => {
            this.product = resp.product;
            this.miFormulario.get('producto_id')?.setValue(this.product.nombre);
          });
        });
      }
    })
  }

}
