import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedComponentsModule } from '@components/shared-components.module';
import { NgChartsModule } from 'ng2-charts';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

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
    SharedComponentsModule,
    NgChartsModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule
  ]
})
export class LandingModule { }
