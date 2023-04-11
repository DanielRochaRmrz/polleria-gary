import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { GetProducts, Product } from '../../interfaces/products.interface';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-get',
  templateUrl: './products-get.component.html',
  styleUrls: ['./products-get.component.scss']
})
export class ProductsGetComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    producto_id: ['', [Validators.required]],
  });

  products!: Product[];
  id_proveedor!: number;

  constructor(
    private fb: FormBuilder,
    public modalRef: MdbModalRef<ProductsGetComponent>,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    console.log('id_proveedor -->', this.id_proveedor);

    this.productsService
            .getProductByProvider(this.id_proveedor)
            .subscribe((prodts) => {
              this.products = prodts.product;
              console.log('products -->', this.products);
            });
  }

  close(): void {
    const id = this.miFormulario.get('producto_id')?.value;
    this.modalRef.close(id)
  }

}
