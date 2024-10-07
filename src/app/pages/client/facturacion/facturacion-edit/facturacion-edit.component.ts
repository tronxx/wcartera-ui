import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FacturacionFormComponent } from '@forms/shared-components/facturacion/facturacion-form/facturacion-form.component';
import { FacturasDto } from '@dtos/facturas.dto';
import { FacturacionService } from '@services/facturacion.service';
import { ComplementosService } from '@services/complementos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-facturacion-edit',
  templateUrl: './facturacion-edit.component.html',
  styleUrls: ['./facturacion-edit.component.scss']
})
export class FacturacionEditComponent implements OnInit {
  title = "";
  public message = "Clientes";
  public factura : FacturasDto = null;
  public modo = "NUEVAFACTURA";

  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(
      public dialog: MatDialogRef<FacturacionEditComponent>,
      @Inject(MAT_DIALOG_DATA) public params : string,
      private facturasservice: FacturacionService,
      private datePipe : DatePipe,

  
    ) { }
  
    ngOnInit(): void {
      let misparam_z = JSON.parse(this.params);
      this.title = misparam_z.title;
      this.factura = misparam_z.factura;
      console.log("Edit Factura Modo:", misparam_z.modo);

    }

    crear_nueva_factura(seriefac: string) {
      const sigfolio = this.buscaUltimoFolioFactura(seriefac);
      const fechahoy =  this.datePipe.transform(new Date(),"yyyy-MM-ddThh:mm");
      console.log("Siguiente Folio", sigfolio, seriefac);
      this.factura = {
        serie: seriefac,
        numero: sigfolio,
        idventa: -1,
        fecha: fechahoy,
        iduuid: -1,
        idusocfdi: -1,
        idmetodopago: -1,
        importe: 0,
        iva: 0,
        total: 0,
        status: "A",
        cia: -1,
        usocfdi: "",
        metodopago: ""
    
      }
      console.log("Nueva Factura", this.factura);

    }

    buscaUltimoFolioFactura(serie: string){
      let folio = 1;
      this.facturasservice.buscarUltimoFolio(serie).subscribe(
        respu => {
          folio = respu.ultimo || 0;
          folio++;
          this.factura.numero = folio;
        }
      );
      return (folio);

    }

    aceptar(data : any){
      this.dialog.close(data);
    }
  
    closeno() {
      this.dialog.close(false);
    }
   

}
