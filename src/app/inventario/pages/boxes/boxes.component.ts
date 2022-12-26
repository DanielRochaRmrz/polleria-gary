import { Component, OnInit } from '@angular/core';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';

import { Caja } from '../../interfaces/boxes.interfaces';
import { BoxesService } from '../../services/boxes.service';

import { BoxRegisterComponent } from '../box-register/box-register.component';
import { BoxUpdateComponent } from '../box-update/box-update.component';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent implements OnInit {
  public namePage: string = 'CAJAS';
  public modalRef: MdbModalRef<BoxRegisterComponent> | null = null;
  public modalRefUpdate: MdbModalRef<BoxUpdateComponent> | null = null;
  public boxes: Caja[] = [];
  public page: number = 0;
  public search: string = '';

  constructor(private boxesService: BoxesService, private modalService: MdbModalService) {}

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes() {
    this.boxesService.getBoxes().subscribe((resp) => {
      this.boxes = resp.cajas;
    });
  }

  openModal() {
    this.modalRef = this.modalService.open(BoxRegisterComponent);
    this.modalRef.onClose.subscribe((msg: any) => {
      this.loadBoxes();
    });
  }

  openModalUpdate(id_box: number) {
    this.modalRefUpdate = this.modalService.open(BoxUpdateComponent, { data: { id_box } });
    this.modalRefUpdate.onClose.subscribe((msg: any) => {
      localStorage.removeItem('id_box');
      this.loadBoxes();
    });
  }

  deleteBox(id_box: number) {
    this.boxesService.deleteBox(id_box).subscribe( resp => {
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
          this.loadBoxes();
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

  nextPage() {
    this.page += 5;
  }

  prevPage() {
    if ( this.page > 0 ) {
      this.page -= 5;
    }
  }

  onSearchBox( search: string  ) {
    this.page = 0;
    this.search = search;
  }
}
