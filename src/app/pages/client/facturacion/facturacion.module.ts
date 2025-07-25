import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedComponentsModule } from '@components/shared-components.module';
import { NgChartsModule } from 'ng2-charts';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule  } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule as localforms } from '@forms/forms.module';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { FacturacionComponent } from './facturacion.component';
import { FacturacionEditComponent } from './facturacion-edit/facturacion-edit.component';
import { CrearventaComponent } from './crearventa/crearventa.component';
import { ProductosComponent } from './productos/productos.component';

const routes : Routes = [
  {
    path: '',
    component: FacturacionComponent,

  },
  {
    path: 'cliente/:idcliente',
    component: FacturacionComponent,

  },
  {
    path: 'crearventa',
    component: CrearventaComponent,

  },
  {
    path: 'crearventa/:idcliente',
    component: CrearventaComponent,

  }

]

@NgModule({
  declarations: [
    FacturacionComponent,
    FacturacionEditComponent,
    CrearventaComponent,
    ProductosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    localforms,
    CdkMenu,
    CdkMenuTrigger,
    FormsModule
  ]
})
export class FacturacionModule { }
