import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service'
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
        Promotores, Factura, Renfac, FacturaCompleta, PolizasCompletas,
        Movclis, Movcliscsaldo, Metodopago, Usocfdi, Regimenes, Codigocaja } 
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
import { PolizasService } from '@services/polizas.service';
import { FechaDialogComponent } from '@forms/shared-components/fecha-dialog/fecha-dialog.component';

@Component({
  selector: 'app-polizacaja',
  templateUrl: './polizacaja.component.html',
  styleUrls: ['./polizacaja.component.scss']
})

export class PolizacajaComponent implements OnInit {

  fechainicial = "";
  fechafinal = "";
  fecha = "";
  codtda = "";
  polizas : PolizasCompletas[] = [];
  codigoscaja: Codigocaja[] = [];
  codigocaja?:Codigocaja;
  datoslistos = false;
  
  numcia = -1;
  iduser = -1;
  idventa = -1;
  idtienda = -1;
  superusuario = true;

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
    public router: Router

    ) { }
  
    ngOnInit(): void {
      this.idventa = -1;
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.iduser;
      this.fechafinal =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.fechainicial =  this.fechafinal.substring(0,8) + '01';
      this.fecha = this.fechafinal;
      const misdatospoliza  = localStorage.getItem('poliza_' + this.numcia) || "{}";
      const datospoliza =  JSON.parse(misdatospoliza);
      this.codtda = datospoliza.codtda;
      this.buscar_codigos_caja();
    }

    buscar_polizas() {
      this.codigocaja = this.seleccionar_codigo_caja();
      this.idtienda = this.codigocaja.id;
      const datospoliza = {
        codtda: this.codtda
      }
      localStorage.setItem("poliza_" + this.numcia, JSON.stringify(datospoliza));

      this.polizasService.buscar_x_Rango_Fechas(this.fechainicial, this.fechafinal, this.idtienda).subscribe(res => {
        this.polizas = res;
        if(!this.polizas.length) {
          this.alerta("No hay pólizas en esas Fechas");
        }
      })
    }

    buscar_codigos_caja() {
      this.polizasService.buscar_Codigos_Caja().subscribe(res => {
        this.codigoscaja = res;
        this.datoslistos = true;
      })
    }

    seleccionar_codigo_caja() {
      const micod = this.codigoscaja.find(codigocaja => codigocaja.tda === this.codtda);
      //const micod = this.codigoscaja.filter(mi => mi.tda === this.codtda)[0];
      return micod;
    }

    crear_poliza_caja() {

      if(this.superusuario) {
        this.pide_fecha_poliza();
      } else {
        this.procede_a_crear_poliza();
      }

    }

    pide_fecha_poliza() {
      let fmin = new Date();
      fmin.setDate(new Date().getDate() - 60);

      const fechaActual = this.datePipe.transform(new Date(),"yyyy-MM-dd");
      const fechaMinima = this.datePipe.transform(fmin,"yyyy-MM-dd");
      const dialogref = this.dialog.open(FechaDialogComponent, {
        width: '500px',
        data: JSON.stringify({ minDate: fechaMinima, maxDate: fechaActual, title: "Teclee la Fecha de la Póliza" })
      });
      dialogref.afterClosed().subscribe(result => {
        if (result) {
          console.log("Regresando de pedir fecha", result);
          this.fecha = result;
          this.procede_a_crear_poliza();
        } else {
          this.alerta("La fecha no fue proporcionada o no es válida.");
        }
      });
    } 

    procede_a_crear_poliza() {
      this.polizasService.crear_poliza(this.fecha, this.codtda, this.idtienda).subscribe( res => {
        this.poliza_caja(res);
      });

    }


    poliza_caja (poliza: PolizasCompletas) {  
      const idpoliza = poliza.id;
      let url_z = `/app/polizas/detallespoliza/${idpoliza}`;
      console.log("Estoy en detalles poliza voy a url:" + url_z);
      
      this.router.navigateByUrl(url_z).then( (e) => {
        if (e) {
          console.log("Navigation is successful!");
        } else {
          console.log("Navigation has failed!");
        }
      });    
  
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
