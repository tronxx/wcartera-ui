import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenesComponent } from './imagenes.component';
import { PidefirmaComponent } from './pidefirma/pidefirma.component';
import { TomafotoComponent } from './tomafoto/tomafoto.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card';
import { WebcamModule } from 'ngx-webcam';

const routes : Routes = [
  {
    path: '',
    component: ImagenesComponent
  }
]


@NgModule({
  declarations: [
    ImagenesComponent,
    PidefirmaComponent,
    TomafotoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    WebcamModule,
    RouterModule.forChild(routes)  // Importa RouterModule y configura las rutas
  ]
})
export class ImagenesModule { }
