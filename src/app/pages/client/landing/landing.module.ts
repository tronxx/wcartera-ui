import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedComponentsModule } from '@components/shared-components.module';

const routes : Routes = [
  {
    path: '',
    component: LandingComponent
  }
]

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    SharedComponentsModule
  ]
})
export class LandingModule { }
