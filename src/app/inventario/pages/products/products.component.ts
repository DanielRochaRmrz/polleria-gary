import { Component, OnInit } from '@angular/core';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { ProductsService } from '../../services/products.service';
import { ProductRegisterComponent } from '../product-register/product-register.component';
import { Product } from '../../interfaces/products.interface';
import { ProductUpdateComponent } from '../product-update/product-update.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public namePage: string = 'PRODUCTOS';
  public modalRef: MdbModalRef<ProductRegisterComponent> | null = null;
  public modalRefUpdate: MdbModalRef<ProductUpdateComponent> | null = null;
  public products: Product[] = [];
  public page: number = 0;
  public search: string = '';

  constructor(
    private productsService: ProductsService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts() {
    this.productsService.getProducts().subscribe(resp => {
      this.products = resp.products;
   });
  }

  openModal() {
    this.modalRef = this.modalService.open(ProductRegisterComponent);
    this.modalRef.onClose.subscribe((msg: any) => {
      this.loadProducts();
    });
  }

  openModalUpdate(id_product: number) {
    this.modalRefUpdate = this.modalService.open(ProductUpdateComponent, { data: { id_product } });
    this.modalRefUpdate.onClose.subscribe((msg: any) => {
      localStorage.removeItem('id_producto');
      this.loadProducts();
    });
  }

  deleteProduct(id_product: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f1765',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, elimínalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(id_product).subscribe( resp => {
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
              this.loadProducts();
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

        });
      }
    });
  }

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if ( this.page > 0 ) {
      this.page -= 5;
    }
  }

  onSearchProducto( search: string  ) {
    this.page = 0;
    this.search = search;
  }
}
