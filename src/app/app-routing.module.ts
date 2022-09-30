import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { ClientComponent } from './layouts/client/client.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path:'',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path:'app',
    loadChildren: () => import('./layouts/client/client-layout.module').then(m => m.ClientLayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
