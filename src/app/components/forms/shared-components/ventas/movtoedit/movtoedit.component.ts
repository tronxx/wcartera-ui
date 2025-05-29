import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatCard } from '@angular/material/card';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Message } from '@models/message';
import { MovclisDto } from '@dtos/movclis.dto';
import { VentasService } from '@services/ventas.service';
import { ClientesService } from '@services/clientes.service';
import  { MovclisFormComponent } from '@forms/shared-components/movclis/movclis-form/movclis-form.component';

@Component({
  selector: 'app-movtoedit',
  templateUrl: './movtoedit.component.html',
  styleUrls: ['./movtoedit.component.scss']
})
export class MovtoeditComponent implements OnInit {
  title = "";

  debug = false;
  public message : Message = {name:"Movimiento",  message: ""};
  public movimiento : MovclisDto = null;
  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(
      private clienteService : ClientesService,
      private datePipe: DatePipe,
      public dialog: MatDialogRef<MovtoeditComponent>,
      @Inject(MAT_DIALOG_DATA) public params : string
  
    ) { }
  
    ngOnInit(): void {
      this.debug = this.clienteService.debug;
      let misparam_z = JSON.parse(this.params);
      if(this.debug){
        console.log("MovtoeditComponent: ", misparam_z);
      }

      this.title = misparam_z.title;
      let datosiniciales = {
        fecha: misparam_z.fecha,
        concepto: misparam_z.concepto,
        tipo: misparam_z.tipo,
        cobratario: misparam_z.cobratario,
        recobon: misparam_z.recobon,
        importe: misparam_z.importe,
      }
      this.message.message = JSON.stringify(datosiniciales);
    }
  
    aceptar(data : any){
      this.dialog.close(data);
    }
  
    closeno() {
      this.dialog.close(false);
    }


}
