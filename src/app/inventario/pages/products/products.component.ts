import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { ProductsService } from '../../services/products.service';
import { ProviderService } from 'src/app/usuarios/services/provider.service';

import { ProductRegisterComponent } from '../product-register/product-register.component';
import { ProductUpdateComponent } from '../product-update/product-update.component';

import { Product } from '../../interfaces/products.interface';
import { Provider } from 'src/app/usuarios/interfaces/providers.interface';

const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 van ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

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
  public provider: Provider[] = [];
  public page: number = 0;
  public search: string = '';
  public isLoadingResults = true;

  displayedColumns: string[] = [
    '#',
    'Nombre',
    'Barcode',
    'Proveedor',
    'Codigo proveedor',
    'Costo por kilo',
    'Stock kilos',
    'Acciones',
  ];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productsService: ProductsService,
    private providerService: ProviderService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase().trim();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadProducts() {
    this.providerService.getProviders().subscribe( resp => {
      this.provider = resp.providers;
      this.provider.forEach(p => {
        return { id: p.id, usuario: p.nombre };
       });
      this.productsService.getProducts().subscribe((resp) => {
        this.products = resp.products;
        this.products.forEach( pr => {
          const provider: any = this.provider.find( p => p.id == pr.proveedor_id );
          pr.proveedor_id = provider.nombre;
        });
        this.dataSource = new MatTableDataSource(this.products);
        this.paginator._intl.itemsPerPageLabel = 'productos por página';
        this.paginator._intl.nextPageLabel = 'página siguiente';
        this.paginator._intl.previousPageLabel = 'página anterior';
        this.paginator._intl.getRangeLabel = dutchRangeLabel;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      });
    });
  }

  openModal() {
    this.modalRef = this.modalService.open(ProductRegisterComponent);
    this.modalRef.onClose.subscribe((msg: any) => {
      this.loadProducts();
    });
  }

  openModalUpdate(id_product: number) {
    this.modalRefUpdate = this.modalService.open(ProductUpdateComponent, {
      data: { id_product },
    });
    this.modalRefUpdate.onClose.subscribe((msg: any) => {
      localStorage.removeItem('id_producto');
      this.loadProducts();
    });
  }

  deleteProduct(id_product: number) {
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
        this.productsService.deleteProduct(id_product).subscribe((resp) => {
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
                container: 'my-swal',
              },
            });
          }
        });
      }
    });
  }

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if (this.page > 0) {
      this.page -= 5;
    }
  }

  onSearchProducto(search: string) {
    this.page = 0;
    this.search = search;
  }
}
