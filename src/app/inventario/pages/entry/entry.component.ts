import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { BoxesService } from './../../services/boxes.service';
import { ProductsService } from '../../services/products.service';

import { Caja } from '../../interfaces/boxes.interfaces';
import { Producto } from '../../interfaces/products.interface';
import { EntryService } from '../../services/entry.service';

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

  get detailsExist() {
    return JSON.parse(this.ls.getItem('detailsExist') || '[]');
  }

  get detailsTotal() {
    return this.details.reduce((acc: any, d:any) => acc + d.subtotal, 0);
  }

  constructor(
    private fb: FormBuilder,
    private boxesService: BoxesService,
    private entryService: EntryService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {}

  getBoxOrProduct() {
    const barcodeInvalid = this.miFormulario.get('barcode')?.value;
    if (barcodeInvalid.trim().length === 0) {
      return;
    }

    const barcode = this.miFormulario.get('barcode')?.value;

    this.boxesService.getBoxBarcode(barcode.trim()).subscribe((box) => {
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

    this.productsService
      .getProductBarcode(barcode.trim())
      .subscribe((product) => {
        if (product.status) {
          this.product = product.product;
          this.addDetailsProduct()
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
      const getDetails = this.details;
      const getDetailsExist = this.detailsExist;

      const existDetails = getDetails
        .map((d: any) => d.barcode)
        .includes(this.box.barcode);

      const subtotal = Number(this.product.costo_kilo) * Number(kilos);

      const details = {
        barcode     : this.box.barcode,
        kilos       : Number(kilos),
        costo_kilo  : this.product.costo_kilo,
        subtotal    : Number(subtotal),
        total_cajas : Number(this.box.stock_cajas) + 1,
        total_tapas : Number(this.box.stock_tapas) + 1,
        box_id      : this.box.id,
        product_id : this.product.id,
      };

      if (existDetails) {
        if (getDetailsExist) {
          // Insertar cajas y productos en un nuevo key ya que existen en el key principal details
          getDetailsExist.push(details);
          this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

          // Consultar indice del la caja de detalles
          const getDetailsIndex = getDetails
            .map((d: any) => d.barcode)
            .indexOf(this.box.barcode);

          // Sumar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
          const totalKilos = Number( getDetails[getDetailsIndex].kilos ) + Number(kilos);
          const subTotal   = Number( getDetails[getDetailsIndex].subtotal ) + Number(subtotal);
          const totalCajas = Number( getDetails[getDetailsIndex].total_cajas ) + 1;
          const totalTapas = Number( getDetails[getDetailsIndex].total_tapas ) + 1;

          getDetails[getDetailsIndex].kilos = totalKilos;
          getDetails[getDetailsIndex].subtotal = subTotal;
          getDetails[getDetailsIndex].total_cajas = totalCajas;
          getDetails[getDetailsIndex].total_tapas = totalTapas;

          // Actualizar detalles con los nuevos totales
          this.ls.setItem('details', JSON.stringify(getDetails));
          return;
        }
      }

      if (getDetails) {
        getDetails.push(details);
        this.ls.setItem('details', JSON.stringify(getDetails));

        getDetailsExist.push(details);
        this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));
        return;
      }
    }
  }

  async addDetailsProduct() {
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
      const getDetails = this.details;
      const getDetailsExist = this.detailsExist;

      const existDetails = getDetails
        .map((d: any) => d.barcode)
        .includes(this.product.barcode);

      const subtotal = Number(this.product.costo_kilo) * Number(kilos);

      const details = {
        barcode     : this.product.barcode,
        kilos       : Number(kilos),
        costo_kilo  : this.product.costo_kilo,
        subtotal    : Number(subtotal),
        total_cajas : 0,
        total_tapas : 0,
        product_id : this.product.id,
      };

      if (existDetails) {
        if (getDetailsExist) {
          // Insertar cajas y productos en un nuevo key ya que existen en el key principal details
          getDetailsExist.push(details);
          this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

          // Consultar indice del la caja de detalles
          const getDetailsIndex = getDetails
            .map((d: any) => d.barcode)
            .indexOf(this.product.barcode);

          // Sumar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
          const totalKilos = Number( getDetails[getDetailsIndex].kilos ) + Number(kilos);
          const subTotal   = Number( getDetails[getDetailsIndex].subtotal ) + Number(subtotal);

          getDetails[getDetailsIndex].kilos = totalKilos;
          getDetails[getDetailsIndex].subtotal = subTotal;


          // Actualizar detalles con los nuevos totales
          this.ls.setItem('details', JSON.stringify(getDetails));
          return;
        }
      }

      if (getDetails) {
        getDetails.push(details);
        this.ls.setItem('details', JSON.stringify(getDetails));

        getDetailsExist.push(details);
        this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

        return;
      }
    }
  }

  detailsExistBarcode(barcode : string) {
    return this.detailsExist.filter((b: any) => b.barcode === barcode).length;
  }

  deleteDetails(i: number) {
    // Eliminar de detalles. Nota: solo funciona cuando no tienes detalles existentes.
    const getDetails =  this.details;
    getDetails.splice(i, 1);
    this.ls.setItem('details', JSON.stringify(getDetails));
  }

  deleteDetailsExist(i: number, barcode: string) {
    // Eliminar de detalles Existentes
    const getDetailsExist =  this.detailsExist;
    const getDetails = this.details;

    // Consultar indice del detalle
    const getDetailsIndex = getDetails
    .map((d: any) => d.barcode)
    .indexOf(barcode);

    // Consultar la cantidad de la key detalles existentes que hay por barcode
    const getDetailsBarcodeExist = getDetailsExist.filter((b: any) => b.barcode === barcode).length;

    if (getDetailsBarcodeExist === 1) {
      //Si solo queda un detalle existente por barcode eliminara y actulizara la key detalles
      const getDetails = this.details;
      getDetails.splice(getDetailsIndex, 1);
      this.ls.setItem('details', JSON.stringify(getDetails));
      //Elimina el ultimo detalle exixtente y actuliza la key detailsExist
      getDetailsExist.splice(i, 1);
      this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));
      return;
    }

    // Restar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
    const totalKilos = Number( getDetails[getDetailsIndex].kilos ) - Number( getDetailsExist[i].kilos );
    const subTotal   = Number( getDetails[getDetailsIndex].subtotal ) - Number( getDetailsExist[i].subtotal );
    const totalCajas = Number( getDetails[getDetailsIndex].total_cajas ) - 1;
    const totalTapas = Number( getDetails[getDetailsIndex].total_tapas ) - 1;

    getDetails[getDetailsIndex].kilos = totalKilos;
    getDetails[getDetailsIndex].subtotal = subTotal;
    if (getDetailsExist[i].total_cajas !== 0) {
      getDetails[getDetailsIndex].total_cajas = totalCajas;
      getDetails[getDetailsIndex].total_tapas = totalTapas;
    }

    // Actualizar detalles con los nuevos totales
    this.ls.setItem('details', JSON.stringify(getDetails));

    getDetailsExist.splice(i, 1);
    this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));
  }

  ticketRegister() {
    const ticket = {
      tipo: 1,
      total: this.detailsTotal,
      details: this.details
    }

    this.entryService.ticketRegister(ticket).subscribe((resp) => {
      if (resp.status) {
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
