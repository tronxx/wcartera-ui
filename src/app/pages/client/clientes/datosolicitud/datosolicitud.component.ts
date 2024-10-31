import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ClientesDto } from '@dtos/clientes.dto';
import { ComplementosService } from '@services/complementos.service';
import { NombreDto } from '@dtos/nombres.dto'
import { SolicitudFormComponent } from '@forms/shared-components/solicitud/solicitud-form/solicitud-form.component';

@Component({
  selector: 'app-datosolicitud',
  templateUrl: './datosolicitud.component.html',
  styleUrls: ['./datosolicitud.component.scss']
})
export class DatosolicitudComponent  implements OnInit {
  title = "";
  public message = "Clientes";
  public cliente : ClientesDto = null;
  public modo : string;

  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(

    ) { }
  
    ngOnInit(): void {
    }

    aceptar(data : any){
    }
  
    closeno() {
    }
   
}
