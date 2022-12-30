import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { ProviderRegisterComponent } from '../provider-register/provider-register.component';
import { ProviderUpdateComponent } from '../provider-update/provider-update.component';

import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../interfaces/providers.interface';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

  public namePage: string = 'PROVEEDORES';
  public modalRef: MdbModalRef<ProviderRegisterComponent> | null = null;
  public modalRefUpdate: MdbModalRef<ProviderUpdateComponent> | null = null;
  public provider: Provider[] = [];
  public page: number = 0;
  public search: string = '';

  constructor(private providerService: ProviderService, private modalService: MdbModalService) { }

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders() {
    this.providerService.getProviders().subscribe( resp => {
      this.provider = resp.providers;
      console.log('provider -->', this.provider);

    });
  }

  deleteProvider(id_user: number) {
    this.providerService.providerDelete(id_user).subscribe( resp => {
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
          this.loadProviders();
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

  openModal() {
    this.modalRef = this.modalService.open(ProviderRegisterComponent);
    this.modalRef.onClose.subscribe((msg: any) => {
      this.loadProviders();
    });
  }

  openModalUpdate(id_provider: number) {
    this.modalRefUpdate = this.modalService.open(ProviderUpdateComponent, { data: { id_provider } });
    this.modalRefUpdate.onClose.subscribe((msg: any) => {
      localStorage.removeItem('id_provider');
      this.loadProviders();
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

  onSearchProvider( search: string  ) {
    this.page = 0;
    this.search = search;
  }


}
