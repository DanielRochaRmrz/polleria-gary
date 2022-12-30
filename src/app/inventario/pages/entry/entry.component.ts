import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BoxesService } from './../../services/boxes.service';
import { ProductsService } from '../../services/products.service';
import { Caja } from '../../interfaces/boxes.interfaces';
import { Producto } from '../../interfaces/products.interface';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  public namePage: string = 'ENTRADA';

  box!: Caja;
  product!: Producto;

  miFormulario: FormGroup = this.fb.group({
    barcode: ['', [Validators.required]],
    details: this.fb.array([]),
  });

  get detailsArr() {
    return this.miFormulario.get('details') as FormArray;
  }


  constructor(
    private fb: FormBuilder,
    private boxesService: BoxesService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
  }

  addBoxOrProduct() {
    const barcodeInvalid = this.miFormulario.get('barcode')?.invalid;
    if (barcodeInvalid) {
      return;
    }

    const barcode = this.miFormulario.get('barcode')?.value
    this.boxesService.getBoxBarcode(barcode).subscribe(box => {
      console.log(box.status);
      if (box.status) {
        this.box = box.caja;
        console.log(this.box);
        this.detailsArr.push(
          this.fb.group({
            barcode: [''],
            kilos: [''],
            costo_kilo: [''],
            subtotal: [''],
            total_cajas: [''],
            total_tapas: [''],
            producto_id: ['']
          })
        );
      }
    });

    this.productsService.getProductBarcode(barcode).subscribe(product => {
      console.log(product.status);
      if (product.status) {
        this.product = product.product;
        console.log(this.product);
        this.detailsArr.push(
          this.fb.group({
            barcode: [''],
            kilos: [''],
            costo_kilo: [''],
            subtotal: [''],
            total_cajas: [''],
            total_tapas: [''],
            producto_id: ['']
          })
        );
      }
    });
  }


}
