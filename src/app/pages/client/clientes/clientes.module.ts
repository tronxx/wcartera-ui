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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule as localforms } from '@forms/forms.module';
import {MatRadioModule} from '@angular/material/radio';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { ClientesComponent } from './clientes.component';
import { ClientesEditComponent } from './clientes-edit/clientes-edit.component';
import { DatosolicitudComponent } from './datosolicitud/datosolicitud.component';

const routes : Routes = [
  {
    path: '',
    component: ClientesComponent
  },
  {
    path: 'solicitud/:idcliente',
    component: DatosolicitudComponent
  }

]


@NgModule({
  declarations: [
    ClientesComponent,
    ClientesEditComponent,
    DatosolicitudComponent
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
    localforms,
    MatRadioModule,
    CdkMenu,
    CdkMenuTrigger,
    FormsModule
  ]

})
export class ClientesModule { }
