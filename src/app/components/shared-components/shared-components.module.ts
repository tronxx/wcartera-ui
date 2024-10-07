import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import {MatIconModule} from '@angular/material/icon'
import { RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { FileDropperComponent } from './file-dropper/file-dropper.component';
import { DirectivesModule } from '@directives/directives.module';
import { InfoCardComponent } from './info-card/info-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DlgyesnoComponent } from './dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from './dlgimportar/dlgimportar.component';
import { PidepasswdComponent } from './pidepasswd/pidepasswd.component';
import { PiderangofechasComponent } from './piderangofechas/piderangofechas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DlgbusarticuloComponent } from './dlgbusarticulo/dlgbusarticulo.component';
import { DlgbusclienteComponent } from './dlgbuscliente/dlgbuscliente.component';

const components = [
  TableComponent,
  FileDropperComponent,
  InfoCardComponent
]

@NgModule({
  declarations: [
    ...components,
    DlgyesnoComponent,
    DlgimportarComponent,
    PidepasswdComponent,
    PiderangofechasComponent,
    DlgbusarticuloComponent,
    DlgbusclienteComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule
  ],
  exports: [
    ...components
  ]
})
export class SharedComponentsModule { }
