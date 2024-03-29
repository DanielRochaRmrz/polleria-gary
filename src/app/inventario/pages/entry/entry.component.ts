import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import Swal from 'sweetalert2';

import { TicketComponent } from '../ticket/ticket.component';
import { ProductsGetComponent } from '../products-get/products-get.component';
import { EntryUpdateComponent } from '../entry-update/entry-update.component';

import { BoxesService } from './../../services/boxes.service';
import { ProductsService } from '../../services/products.service';
import { EntryService } from '../../services/entry.service';

import { Caja } from '../../interfaces/boxes.interfaces';
import { GetProducts, Producto } from '../../interfaces/products.interface';
import { Data, EntryG } from '../../interfaces/entry.interface';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  public namePage: string = 'ENTRADA';
  public modalRef: MdbModalRef<TicketComponent> | null = null;
  public modalGetPRef: MdbModalRef<ProductsGetComponent> | null = null;
  public modalEntryUpdateRef: MdbModalRef<EntryUpdateComponent> | null = null;

  ls = localStorage;

  box!: Caja;
  product!: Producto;
  products!: GetProducts;

  nameProduct!: string;

  boxOrProduct!: Data;

  miFormulario: FormGroup = this.fb.group({
    barcode: ['', [Validators.required]],
  });

  get details() {
    return JSON.parse(this.ls.getItem('details') || '[]');
  }

  get detailsExist() {
    return JSON.parse(this.ls.getItem('detailsExist') || '[]');
  }

  get nameProducts() {
    return JSON.parse(this.ls.getItem('nameProducts') || '[]');
  }

  get detailsTotal() {
    return this.details.reduce((acc: any, d: any) => acc + d.subtotal, 0);
  }

  constructor(
    private fb: FormBuilder,
    private boxesService: BoxesService,
    private entryService: EntryService,
    private productsService: ProductsService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {}

  getBoxOrProduct() {
    const barcodeInvalid = this.miFormulario.get('barcode')?.invalid;

    if (barcodeInvalid) {
      return;
    }

    const barcode = this.miFormulario.get('barcode')?.value;

    this.entryService
      .getBoxOrProduct(barcode.replace(/\s+/g, ''))
      .subscribe((BoxOrProduct) => {
        if (
          BoxOrProduct.status === true &&
          BoxOrProduct.provider !== 'Grupo Pecuario'
        ) {
          this.boxOrProduct = BoxOrProduct.data;
          this.productsService
            .getProduct(this.boxOrProduct.id)
            .subscribe((product) => {
              this.product = product.product;
              if (BoxOrProduct.type === 'box') {
                this.addDetailsBox(BoxOrProduct.kilos_caja);
              }

              if (BoxOrProduct.type === 'product') {
                this.addDetailsProduct();
              }
            });
        } else if (
          BoxOrProduct.status === true &&
          BoxOrProduct.provider === 'Grupo Pecuario'
        ) {
          const id_proveedor = BoxOrProduct.id_provider;
          this.modalGetPRef = this.modalService.open(ProductsGetComponent, {
            data: { id_proveedor },
            modalClass: 'modal-dialog-centered',
          });
          this.modalGetPRef.onClose.subscribe((id: number) => {
            this.productsService.getProduct(id).subscribe((product) => {
              this.boxOrProduct = product.product;
              this.product = product.product;

              if (BoxOrProduct.type === 'box') {
                this.addDetailsBox(BoxOrProduct.kilos_caja);
              }

              if (BoxOrProduct.type === 'product') {
                this.addDetailsProduct();
              }
            });
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'El barcode ingresado no se encuentra registrado',
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

  async addDetailsBox(kilos: number | undefined) {
    // const { value: kilos } = await Swal.fire({
    //   title: 'Kilos',
    //   input: 'number',
    //   confirmButtonColor: '#0f1765',
    //   confirmButtonText: 'Ingresar',
    //   inputPlaceholder: 'Ingrese los kilos',
    //   inputValidator: (value) => {
    //     return new Promise((resolve) => {
    //       if (value >= '0') {
    //         resolve('');
    //       } else {
    //         resolve('El campo kilos es requerido');
    //       }
    //     });
    //   },
    // });
    // if (kilos) {
    const getDetails = this.details;
    const getDetailsExist = this.detailsExist;
    const getNameProducts = this.nameProducts;

    const existDetails = getDetails
      .map((d: any) => d.product_id)
      .includes(this.boxOrProduct.id);

    const subtotal = Number(this.boxOrProduct.costo_kilo) * Number(kilos);

    const details = {
      kilos: Number(kilos),
      costo_kilo: this.boxOrProduct.costo_kilo,
      subtotal: Number(subtotal.toFixed(2)),
      total_cajas: 1,
      total_tapas: 1,
      product_id: this.boxOrProduct.id,
    };

    const nameProducts = {
      name_product: this.boxOrProduct.nombre,
      product_id: this.boxOrProduct.id
    };

    if (existDetails) {
      if (getDetailsExist) {
        // Insertar cajas y productos en un nuevo key ya que existen en el key principal details
        getDetailsExist.push(details);
        this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

        // Consultar indice del la caja de detalles
        const getDetailsIndex = getDetails
          .map((d: any) => d.product_id)
          .indexOf(this.boxOrProduct.id);

        // Sumar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
        const totalKilos =
          Number(getDetails[getDetailsIndex].kilos) + Number(kilos);
        const subTotal =
          Number(getDetails[getDetailsIndex].subtotal) + Number(subtotal);
        const totalCajas = Number(getDetails[getDetailsIndex].total_cajas) + 1;
        const totalTapas = Number(getDetails[getDetailsIndex].total_tapas) + 1;

        getDetails[getDetailsIndex].kilos = totalKilos;
        getDetails[getDetailsIndex].subtotal = subTotal;
        getDetails[getDetailsIndex].total_cajas = totalCajas;
        getDetails[getDetailsIndex].total_tapas = totalTapas;

        // Actualizar detalles con los nuevos totales
        this.ls.setItem('details', JSON.stringify(getDetails));

        this.miFormulario.reset();
        return;
      }
    }

    if (getDetails) {
      getDetails.push(details);
      this.ls.setItem('details', JSON.stringify(getDetails));

      getDetailsExist.push(details);
      this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

      getNameProducts.push(nameProducts);
      this.ls.setItem('nameProducts', JSON.stringify(getNameProducts));

      this.miFormulario.reset();
      return;
    }
    // }
  }

  async addDetailsProduct() {
    const { value: kilos } = await Swal.fire({
      title: 'Kilos',
      input: 'number',
      confirmButtonColor: '#0f1765',
      confirmButtonText: 'Ingresar',
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
      const getNameProducts = this.nameProducts;

      const existDetails = getDetails
        .map((d: any) => d.product_id)
        .includes(this.boxOrProduct.id);

      const subtotal = Number(this.boxOrProduct.costo_kilo) * Number(kilos);

      const details = {
        kilos: Number(kilos),
        costo_kilo: this.boxOrProduct.costo_kilo,
        subtotal: Number(subtotal.toFixed(2)),
        total_cajas: 0,
        total_tapas: 0,
        product_id: this.boxOrProduct.id,
      };

      const nameProducts = {
        name_product: this.boxOrProduct.nombre,
        product_id:  this.boxOrProduct.id
      };

      if (existDetails) {
        if (getDetailsExist) {
          // Insertar cajas y productos en un nuevo key ya que existen en el key principal details
          getDetailsExist.push(details);
          this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

          // Consultar indice del la caja de detalles
          const getDetailsIndex = getDetails
            .map((d: any) => d.product_id)
            .indexOf(this.boxOrProduct.id);

          // Sumar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
          const totalKilos =
            Number(getDetails[getDetailsIndex].kilos) + Number(kilos);
          const subTotal =
            Number(getDetails[getDetailsIndex].subtotal) + Number(subtotal);

          getDetails[getDetailsIndex].kilos = totalKilos;
          getDetails[getDetailsIndex].subtotal = subTotal;

          // Actualizar detalles con los nuevos totales
          this.ls.setItem('details', JSON.stringify(getDetails));

          this.miFormulario.reset();
          return;
        }
      }

      if (getDetails) {
        getDetails.push(details);
        this.ls.setItem('details', JSON.stringify(getDetails));

        getDetailsExist.push(details);
        this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

        getNameProducts.push(nameProducts);
        this.ls.setItem('nameProducts', JSON.stringify(getNameProducts));

        this.miFormulario.reset();
        return;
      }
    }
  }

  editEntry(i: number, partidaG: EntryG, nameProduct: string) {
    this.modalEntryUpdateRef = this.modalService.open(EntryUpdateComponent, {
      data: { i, partidaG, nameProduct },
      modalClass: 'modal-dialog-centered',
    });
    this.modalEntryUpdateRef.onClose.subscribe((msg: any) => {
      console.log('msg -->', msg);
      if (msg) {

        const getDetails = this.details;
        const subtotal = Number(msg.partidaG.costo_kilo) * Number(msg.partidaG.kilos);
        // Sumar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
        getDetails[msg.i].costo_kilo = Number(msg.partidaG.costo_kilo);
        getDetails[msg.i].subtotal = Number(subtotal.toFixed(2));
        getDetails[msg.i].total_cajas = Number(msg.partidaG.total_cajas);
        getDetails[msg.i].total_tapas= Number(msg.partidaG.total_tapas);

        // Actualizar detalles
        this.ls.setItem('details', JSON.stringify(getDetails));

        Swal.fire({
          icon: 'success',
          title: 'La edición de datos se realizó con exito',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  detailsExistBarcode(product_id: number) {
    return this.detailsExist.filter((b: any) => b.product_id === product_id)
      .length;
  }

  deleteDetails(i: number) {
    // Eliminar de detalles. Nota: solo funciona cuando no tienes detalles existentes.
    const getDetails = this.details;
    getDetails.splice(i, 1);
    this.ls.setItem('details', JSON.stringify(getDetails));

    const getNameProducts = this.nameProducts;
    getNameProducts.splice(i, 1);
    this.ls.setItem('nameProducts', JSON.stringify(getNameProducts));
  }

  deleteDetailsExist(i: number, product_id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f1765',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, elimínalo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar de detalles Existentes
        const getDetailsExist = this.detailsExist;
        const getDetails = this.details;
        const getNameProducts = this.nameProducts;

        // Consultar indice del detalle
        const getDetailsIndex = getDetails
          .map((d: any) => d.product_id)
          .indexOf(product_id);

        // Consultar la cantidad de la key detalles existentes que hay por barcode
        const getDetailsBarcodeExist = getDetailsExist.filter(
          (b: any) => b.product_id === product_id
        ).length;

        // Consultar indice del nombre
        const getNameProductsIndex = getNameProducts
          .map((name: any) => name.product_id)
          .indexOf(product_id);


        if (getDetailsBarcodeExist === 1) {
          //Si solo queda un detalle existente por barcode eliminara y actulizara la key detalles
          const getDetails = this.details;
          getDetails.splice(getDetailsIndex, 1);
          this.ls.setItem('details', JSON.stringify(getDetails));
          //Elimina el ultimo detalle exixtente y actuliza la key detailsExist
          getDetailsExist.splice(i, 1);
          this.ls.setItem('detailsExist', JSON.stringify(getDetailsExist));

          getNameProducts.splice(getNameProductsIndex, 1);
          this.ls.setItem('nameProducts', JSON.stringify(getNameProducts));
          return;
        }

        // Restar y actulizar los datos kilos, subtotal, total, total cajas y total tapas
        const totalKilos =
          Number(getDetails[getDetailsIndex].kilos) -
          Number(getDetailsExist[i].kilos);
        const subTotal =
          Number(getDetails[getDetailsIndex].subtotal) -
          Number(getDetailsExist[i].subtotal);
        const totalCajas = Number(getDetails[getDetailsIndex].total_cajas) - 1;
        const totalTapas = Number(getDetails[getDetailsIndex].total_tapas) - 1;

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
    });
  }

  ticketRegister() {
    this.entryService.ticketPrint().subscribe(res => {
      console.log('res -->', res);
    })

    if (!this.details.length) {
      Swal.fire({
        title: 'Info',
        text: 'No hay mercancía por ingresar',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0f1765',
        customClass: {
          container: 'my-swal',
        },
      });
      return;
    }

    Swal.fire({
      title: '¿Los datos ingresados son correctos?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Guardar',
      confirmButtonColor: '#0f1765',
      denyButtonText: `No guardar`,
      denyButtonColor: '#d33',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const ticket = {
          tipo: 1,
          total: Number(this.detailsTotal.toFixed(2)),
          details: this.details,
        };

        this.entryService.ticketRegister(ticket).subscribe((resp: any) => {
          console.log(resp);

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
              const ticket_id =  resp.ticket_id;
              const ticket_type = resp.type;
              this.modalRef = this.modalService.open(TicketComponent, { data: { ticket_id,  ticket_type} });
              this.modalRef.onClose.subscribe((msg: any) => {
                this.ls.removeItem('details');
                this.ls.removeItem('detailsExist');
                this.ls.removeItem('nameProducts');
              });
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
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Mercacia no registrada',
          icon: 'info',
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
