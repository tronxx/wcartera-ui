import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { RecoverFormComponent } from './auth/recover-form/recover-form.component';
// Material imports
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlmacenesFormComponent } from './shared-components/almacenes-form/almacenes-form.component';
import { KardexFormComponent } from './shared-components/productos/kardex-form/kardex-form.component';
import { FacturacionFormComponent } from './shared-components/facturacion/facturacion-form/facturacion-form.component';
import { ClientesFormComponent } from './shared-components/clientes/clientes-form/clientes-form.component';
import { MatCardModule } from '@angular/material/card';
import { VentasFormComponent } from './shared-components/ventas/ventas-form/ventas-form.component';
import { SolicitudFormComponent } from './shared-components/solicitud/solicitud-form/solicitud-form.component';
import { MovimientostablaComponent } from './shared-components/ventas/movimientostabla/movimientostabla.component';
import { MatIconModule } from '@angular/material/icon';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { FacturaComponent } from './shared-components/ventas/factura/factura.component';
import { PolizacajaFormComponent } from './shared-components/polizacaja/polizacaja-form/polizacaja-form.component';
import { VencimientosComponent } from './shared-components/vencimientos/vencimientos/vencimientos.component';
import { DatosventaComponent } from './shared-components/ventas/datosventa/datosventa.component';
import { FechaDialogComponent } from './shared-components/fecha-dialog/fecha-dialog.component';
import { SignaturepadComponent } from './shared-components/signaturepad/signaturepad.component';
import { MovclisFormComponent } from './shared-components/movclis/movclis-form/movclis-form.component';
import { AgregarmovtoComponent } from './shared-components/ventas/agregarmovto/agregarmovto.component';
import { MovtoeditComponent } from './shared-components/ventas/movtoedit/movtoedit.component';

const forms = [
  LoginFormComponent,
  RegisterFormComponent,
  RecoverFormComponent,
  KardexFormComponent,
  AlmacenesFormComponent,
  FacturacionFormComponent,
  ClientesFormComponent,
  VentasFormComponent,
  MovimientostablaComponent,
  SolicitudFormComponent,
  MovimientostablaComponent,
  FacturaComponent,
  PolizacajaFormComponent,
  VencimientosComponent,
  DatosventaComponent,
  FechaDialogComponent,

]

const materialImports = [
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatTableModule,
  MatIconModule,
  CdkMenu,
  CdkMenuTrigger,
MatProgressSpinnerModule

]

@NgModule({
  declarations: [
    ...forms,
    SignaturepadComponent,
    MovclisFormComponent,
    AgregarmovtoComponent,
    MovtoeditComponent,
  ],
  imports: [
    CommonModule,
    ...materialImports,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ...forms
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }, // Configura la localización a México
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS }, // Usa el formato de Moment.js
  ],
})
export class FormsModule { }