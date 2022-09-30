import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./layouts/auth/auth-layout.module').then(m => m.AuthLayoutModule)
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
