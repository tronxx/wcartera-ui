import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ClientesFormComponent } from '@forms/shared-components/clientes/clientes-form/clientes-form.component'
import { ClientesDto, ClienteDtoCompleto } from '@dtos/clientes.dto';
import { ComplementosService } from '@services/complementos.service';
import { NombreDto } from '@dtos/nombres.dto';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-clientes-edit',
  templateUrl: './clientes-edit.component.html',
  styleUrls: ['./clientes-edit.component.scss']
})
export class ClientesEditComponent implements OnInit {
  title = "";
  public message = "Clientes";
  public cliente : ClienteDtoCompleto = null;
  public modo : string;
  listo = false;
  debug = false;

  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(
      public dialog: MatDialogRef<ClientesEditComponent>,
      private configservice: ConfigService,
      @Inject(MAT_DIALOG_DATA) public params : string
  
    ) { }
  
    ngOnInit(): void {
      let misparam_z = JSON.parse(this.params);
      this.title = misparam_z.title;
      this.cliente = misparam_z.cliente;
      this.modo = misparam_z.modo;
      console.log("clientes edit:", misparam_z, this.cliente);
      this.listo = true;
      this.debug = this.configservice.debug;
    }

    aceptar(data : any){
      if(this.debug) console.log("Cerrando con Ok", data);
      if(!data) this.dialog.close(false)
      else this.dialog.close(data);
    }
  
    closeno() {
      if(this.debug) console.log("Cerrando sin aceptar");
      this.dialog.close(false);
    }
   


}
