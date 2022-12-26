import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MdbootstrapModule } from '../mdbootstrap.module';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MdbootstrapModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class SharedModule { }
