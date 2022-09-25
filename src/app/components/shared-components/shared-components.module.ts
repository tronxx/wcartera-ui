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

const components = [
  TableComponent,
  FileDropperComponent,
  InfoCardComponent
]

@NgModule({
  declarations: [
    ...components,
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
    MatIconModule
  ],
  exports: [
    ...components
  ]
})
export class SharedComponentsModule { }
