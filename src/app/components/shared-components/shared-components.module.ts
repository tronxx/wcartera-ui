import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material imports
import {MatIconModule} from '@angular/material/icon'
import { RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { FileDropperComponent } from './file-dropper/file-dropper.component';
import { DirectivesModule } from '@directives/directives.module';

const components = [
  TableComponent,
  FileDropperComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    DirectivesModule
  ],
  exports: [
    ...components
  ]
})
export class SharedComponentsModule { }
