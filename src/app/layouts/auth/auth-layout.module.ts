import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from '@components/shared-components.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const routes : Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import("../../pages/auth/auth.module").then(m => m.AuthModule)
      }
    ]
  }
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class AuthLayoutModule { }
