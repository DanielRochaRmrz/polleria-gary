
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';

import { MaterialModule } from '../material.module';
import { MdbootstrapModule } from '../mdbootstrap.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



import { BoxRegisterComponent } from './pages/box-register/box-register.component';
import { BoxUpdateComponent } from './pages/box-update/box-update.component';
import { BoxesComponent } from './pages/boxes/boxes.component';
import { EntryComponent } from './pages/entry/entry.component';
import { OutputComponent } from './pages/output/output.component';
import { ProductRegisterComponent } from './pages/product-register/product-register.component';
import { ProductUpdateComponent } from './pages/product-update/product-update.component';
import { ProductsComponent } from './pages/products/products.component';

import { FiltroProductsPipe } from './pipes/filtro-products.pipe';
import { FiltroBoxesPipe } from './pipes/filtro-boxes.pipe';





@NgModule({
  declarations: [
    BoxRegisterComponent,
    BoxUpdateComponent,
    BoxesComponent,
    EntryComponent,
    OutputComponent,
    ProductRegisterComponent,
    ProductUpdateComponent,
    ProductsComponent,
    FiltroProductsPipe,
    FiltroBoxesPipe,
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    MaterialModule,
    MdbootstrapModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class InventarioModule { }
