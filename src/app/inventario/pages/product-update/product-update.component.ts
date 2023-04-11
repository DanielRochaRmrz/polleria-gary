import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { ProductsService } from '../../services/products.service';

import { Provider } from '../../../usuarios/interfaces/providers.interface';
import { Producto } from '../../interfaces/products.interface';
import { BarcodeUpdateValidatorService } from 'src/app/shared/validator/barcode-update-validator.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
})
export class ProductUpdateComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    producto_id: ['', [Validators.required]],
    barcode: ['', [Validators.required], [this.barcordeValid]],
    nombre: ['', [Validators.required]],
    proveedor_id: ['', [Validators.required]],
    codigo_proveedor: ['', [Validators.required]],
    costo_kilo: ['', [Validators.required, Validators.min(1)]],
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
    const errors = this.miFormulario.get('costo_kilo')?.errors;
    console.log(errors);

    if (errors?.['required']) {
      return 'El campo costo_kilo es obligatorio';
    } else if (errors?.['min']) {
      return 'El campo costo_kilo debe ser mayor a 0';
    }
    return '';
  }

  providers: Provider[] = [];
  providerSelect: Provider | undefined;
  termino: string = '';
  providerID!: number;
  id_product!: number;
  product!: Producto;


  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private barcordeValid: BarcodeUpdateValidatorService,
    public modalRef: MdbModalRef<ProductUpdateComponent>
  ) {}

  ngOnInit(): void {
    localStorage.setItem('id_producto', this.id_product.toString());

    this.productsService.getProduct(this.id_product).subscribe(product => {
      this.product = product.product;
      this.miFormulario.get('barcode')?.setValue(this.product.barcode);
      this.miFormulario.get('nombre')?.setValue(this.product.nombre);
      this.miFormulario.get('proveedor_id')?.setValue(this.product.proveedor_id);
      this.miFormulario.get('codigo_proveedor')?.setValue(this.product.codigo_proveedor);
      this.miFormulario.get('costo_kilo')?.setValue(this.product.costo_kilo);
      this.miFormulario.get('producto_id')?.setValue(this.product.id);

    });
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  productUpdate() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    const product = this.miFormulario.value;
    this.productsService.updateProduct(product, this.id_product).subscribe((resp) => {
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
