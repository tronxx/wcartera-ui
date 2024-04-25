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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule as localforms } from '@forms/forms.module';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { ProductosComponent } from './productos.component';
import { KardexComponent } from './kardex/kardex.component';
import { KardexAgregarComponent } from './kardex-agregar/kardex-agregar.component';
import { DatePipe } from '@angular/common';
import { KardexSalidasComponent } from './kardex-salidas/kardex-salidas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import {MAT_DATE_LOCALE} from '@angular/material/core';

const routes : Routes = [
  {
    path: '',
    component: ProductosComponent
  },
  {
    path: 'kardex/:idart',
    component: KardexComponent

  }
]

export const MAT_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: 'dd-MM-yyyy'},
  display: {
    dateInput: 'dd-MM-yyyy',
    monthYearLabel:'MM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'yyyy'
  }
}


@NgModule({
  declarations: [
    ProductosComponent,
    KardexAgregarComponent,
    KardexComponent,
    KardexSalidasComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    localforms,
    CdkMenu,
    CdkMenuTrigger,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DatePipe,
    ],
 
})
export class ProductosModule { }
