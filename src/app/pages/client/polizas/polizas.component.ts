import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service'
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
        Promotores, Factura, Renfac, FacturaCompleta,
        Movclis, Movcliscsaldo, Metodopago, Usocfdi, Regimenes, PolizasCompletas } 
       from '@models/index';
import { ComplementosService } from '@services/complementos.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PiderangofechasComponent } from '@components/piderangofechas/piderangofechas.component';
import { DlgbusclienteComponent } from '@components/dlgbuscliente/dlgbuscliente.component';
import { MovimientostablaComponent } from '@forms/shared-components/ventas/movimientostabla/movimientostabla.component';
import { FacturaComponent } from '@forms/shared-components/ventas/factura/factura.component';
import { PolizasService } from '@services/polizas.service';

@Component({
  selector: 'app-polizas',
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.scss']
})
export class PolizasComponent implements OnInit {

  fechainicial = "";
  fechafinal = "";
  fecha = "";
  codtda = "";
  polizas : PolizasCompletas[] = [];
  
  numcia = -1;
  iduser = -1;
  idventa = -1;
  idtienda = -1;

  displayedColumns: string[] = ['fecha', 'importe', 
    'bonif', 'recar', 'efectivo', 'options'];

public headers : Array<string> = 
["Fecha", "Importe", "Bonificaciones", "Recargos", 
  "Efectivo",  "Acciones"];
public arrayContent : Array<string> = [
  'fecha', 'importe', 'bonif', 'rear', 'efectivo', 
];

public body : Array<any> = [];
public tableName = "Pólizas";
public page : PageIndex;

public tableOptions : TableOptions = {
  edit: false,
  delete: false,
  create: false,
  download: false,
  size: 0
}

//dataSource = this.productos;



  constructor(
    private clientesService : ClientesService,
    private ventasService: VentasService,
    private facturasSerice: FacturacionService,
    private complementosService: ComplementosService,
    private polizasService: PolizasService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: ActivatedRoute,

    ) { }
  
    ngOnInit(): void {
      this.idventa = Number (String(this.router.snapshot.paramMap.get('idventa')));
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.iduser;
      this.fechafinal =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.fechainicial =  this.fechafinal.substring(1,8) + "01";
      
    }

    buscar_polizas() {
      this.polizasService.buscar_x_Rango_Fechas(this.fechainicial, this.fechafinal, this.idtienda).subscribe(res => {
        this.polizas = res;

      })
    }


    alerta(mensaje: string) {
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
        //console.log("Debug", res);
  
      });
    
    }

    edit(poliza: any) {}
    delete(poliza: any) {}
  

}
