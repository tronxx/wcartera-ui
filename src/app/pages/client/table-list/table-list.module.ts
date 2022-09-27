import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from './table-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedComponentsModule } from '@components/shared-components.module';

const routes : Routes = [
  {
    path: '',
    component: TableListComponent
  }
]

@NgModule({
  declarations: [
    TableListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    SharedComponentsModule
  ]
})
export class TableListModule { }
