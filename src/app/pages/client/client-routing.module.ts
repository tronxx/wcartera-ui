import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
  },
  {
    path: 'table-list',
    loadChildren: () => import('./table-list/table-list.module').then(m => m.TableListModule),
  },
  {
    path: 'typography',
    loadChildren: () => import('./typography/typography.module').then(m => m.TypographyModule),
  },
  {
    path: 'icons',
    loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule),
  },
  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule),
  },
  {
    path: 'almacenes',
    loadChildren: () => import('./almacenes/almacenes.module').then(m => m.AlmacenesModule),
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule),
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule),
  },
  {
    path: 'facturacion',
    loadChildren: () => import('./facturacion/facturacion.module').then(m => m.FacturacionModule),
  },
  {
    path: '**',
    redirectTo: 'landing',
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class ClientRoutingModule { }
