
import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { KardexFormComponent } from '@forms/shared-components/productos/kardex-form/kardex-form.component';
import { KardexDto } from '@dtos/kardex-dto';
import { MatCard } from '@angular/material/card';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { ProductosService } from '@services/productos.service';


@Component({
  selector: 'app-kardex-agregar',
  templateUrl: './kardex-agregar.component.html',
  styleUrls: ['./kardex-agregar.component.scss']
})

export class KardexAgregarComponent implements OnInit {
  title = "";
  ultimofolio = 0;
  tipo = "";

  public message = "Kardex";
  public movimiento : KardexDto = null;
  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(
      private productosService : ProductosService,
      public dialog: MatDialogRef<KardexAgregarComponent>,
      @Inject(MAT_DIALOG_DATA) public params : string
  
    ) { }
  
    ngOnInit(): void {
      let misparam_z = JSON.parse(this.params);
      this.title = misparam_z.title;
      this.ultimofolio = misparam_z.ultimofolio;
      this.tipo = misparam_z.tipo;
    }
  
  
    aceptar(data : any){
      console.log("called");
      this.dialog.close(data);
    }
  
    closeno() {
      this.dialog.close(false);
    }
  
}