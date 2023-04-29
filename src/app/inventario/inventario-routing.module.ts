import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxesComponent } from './pages/boxes/boxes.component';
import { EntryComponent } from './pages/entry/entry.component';
import { OutputComponent } from './pages/output/output.component';
import { ProductsComponent } from './pages/products/products.component';
import { TicketsComponent } from './pages/tickets/tickets.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'boxes', component: BoxesComponent },
      { path: 'entry', component: EntryComponent },
      { path: 'output', component: OutputComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: '**', redirectTo: 'products' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
