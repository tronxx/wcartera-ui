import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasComponent } from './ventas.component';
import { VentasEditComponent } from './ventas-edit/ventas-edit.component';



@NgModule({
  declarations: [
    VentasComponent,
    VentasEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VentasModule { }
