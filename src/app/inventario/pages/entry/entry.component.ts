import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { BoxesService } from './../../services/boxes.service';
import { ProductsService } from '../../services/products.service';

import { Caja } from '../../interfaces/boxes.interfaces';
import { Producto } from '../../interfaces/products.interface';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  public namePage: string = 'ENTRADA';

  ls = localStorage;

  box!: Caja;
  product!: Producto;

  miFormulario: FormGroup = this.fb.group({
    barcode: ['', [Validators.required]],
  });

  get details() {
    return JSON.parse(this.ls.getItem('details') || '[]');
  }

  constructor(
    private fb: FormBuilder,
    private boxesService: BoxesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {}

  getBoxOrProduct() {
    const barcodeInvalid = this.miFormulario.get('barcode')?.invalid;
    if (barcodeInvalid) {
      return;
    }

    const barcode = this.miFormulario.get('barcode')?.value;

    this.boxesService.getBoxBarcode(barcode).subscribe((box) => {
      console.log(box.status);
      if (box.status) {
        this.box = box.caja;
        this.productsService
          .getProduct(this.box.producto_id)
          .subscribe((product) => {
            this.product = product.product;
            this.addDetailsBox();
          });
      }
    });

    this.productsService.getProductBarcode(barcode).subscribe((product) => {
      console.log(product.status);
      if (product.status) {
        this.product = product.product;
        console.log(this.product);
      }
    });
  }

  async addDetailsBox() {
    const { value: kilos } = await Swal.fire({
      title: 'Kilos',
      input: 'number',
      inputPlaceholder: 'Ingrese los kilos',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value >= '0') {
            resolve('');
          } else {
            resolve('El campo kilos es requerido');
          }
        });
      },
    });
    if (kilos) {
      console.log(kilos);
      const arrDetails: any[] = [];
      const subtotal = Number(this.product.costo_kilo) * Number(kilos);
      const details = {
        barcode: this.box.barcode,
        kilos: Number(kilos),
        costo_kilo: this.product.costo_kilo,
        subtotal: Number(subtotal),
        total_cajas: 0,
        total_tapas: 0,
        producto_id: this.product.id,
      };
      arrDetails.push(details);
      this.ls.setItem('details', JSON.stringify(arrDetails));
    }
  }
}
