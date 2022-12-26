import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MdbDropdownModule,
    MdbFormsModule,
    MdbValidationModule,
    MdbModalModule,
  ],
})
export class MdbootstrapModule {}
