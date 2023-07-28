import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UsuariosRoutingModule } from './usuarios-routing.module';

import { ProvidersComponent } from './pages/providers/providers.component';
import { ProviderRegisterComponent } from './pages/provider-register/provider-register.component'
import { ProviderUpdateComponent } from './pages/provider-update/provider-update.component';
;
import { UsersComponent } from './pages/users/users.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { UserUpdateComponent } from './pages/user-update/user-update.component';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { MdbootstrapModule } from '../mdbootstrap.module';
import { FiltroUsersPipe } from './pipes/filtro-users.pipe';
import { FiltroProvidersPipe } from './pipes/filtro-providers.pipe';



@NgModule({
  declarations: [
    ProvidersComponent,
    ProviderRegisterComponent,
    ProviderUpdateComponent,
    UsersComponent,
    UserRegisterComponent,
    UserUpdateComponent,
    FiltroUsersPipe,
    FiltroProvidersPipe
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    SharedModule,
    MaterialModule,
    MdbootstrapModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
