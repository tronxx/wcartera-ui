import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedComponentsModule } from '@components/shared-components.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

const routes : Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        loadChildren: () => import("../../pages/client/client.module").then(m => m.ClientModule)
      }
    ]
  }
]

@NgModule({
  declarations: [
    ClientComponent,
    NavbarComponent,
    SidebarComponent,
    PageHeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatSidenavModule,
    SharedComponentsModule,
    MatIconModule,
    MatDividerModule,
  ]
})
export class ClientLayoutModule { }
