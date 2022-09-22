import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

// Material imports
import {MatIconModule} from '@angular/material/icon'
import { RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { FileDropperComponent } from './file-dropper/file-dropper.component';
import { DirectivesModule } from '@directives/directives.module';

const components = [
  SidebarComponent,
  NavbarComponent,
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
