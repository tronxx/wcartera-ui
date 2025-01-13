import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service'
import { ConfigService } from '@services/config.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
        Promotores, Factura, Renfac, FacturaCompleta, PolizasCompletas,
        Renpolcompleto, Vencimientos,
        Movclis, Movcliscsaldo, Metodopago, Usocfdi, Regimenes, Codigocaja } 
       from '@models/index';
import { ComplementosService } from '@services/complementos.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { VencimientosComponent } from '@forms/shared-components/vencimientos/vencimientos/vencimientos.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PolizasService } from '@services/polizas.service';
import { DlgpagosComponent } from '../dlgpagos/dlgpagos.component';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {

  numcia = -1;
  iduser = -1;
  idpoliza = -1;
  idtienda = -1;
  codtda = "";
  codvta = "";
  codigoscaja: Codigocaja[] = [];
  codigocaja?:Codigocaja;
  datoslistos = false;
  fecha = "";
  nuevapoliza = false;
  renglones: Renpolcompleto[] = [];
  renglon?: Renpolcompleto;
  venta: VentasCompletas;
  renglonesfac: Renfac[] = [];

  polizacaja? : PolizasCompletas;
  cliente?: VentasCompletas;
  compra = "";
  letras: Vencimientos[] = [];


  displayedColumns: string[] = ['codigo', 'nombre', 'concepto', 
    'vence', 'dias', 'bonif', 'recar', 'importe', 'neto', 'options'];

public headers : Array<string> = 
["Codigo", "Nombre", "Concepto", "Vence", "Dias",
  "Bonificacion", "Recargos", "Importe", "Efectivo",  "Acciones"];
public arrayContent : Array<string> = [
  'codigo', 'nombre', 'concepto', 
    'vence', 'dias', 'bonif', 'recar', 'importe', 'neto', 
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

public vencimientos: Vencimientos[] = [];
yatengovencimientos = false;

//dataSource = this.productos;


  constructor(
    private clientesService : ClientesService,
    private ventasService: VentasService,
    private facturasSerice: FacturacionService,
    private complementosService: ComplementosService,
    private polizasService: PolizasService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: ActivatedRoute

    ) { }
  
    ngOnInit(): void {
      this.idpoliza = Number (String(this.router.snapshot.paramMap.get('idpoliza')));
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.iduser;
      this.fecha =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      const misdatospoliza  = localStorage.getItem('poliza_' + this.numcia) || "{}";
      const datospoliza =  JSON.parse(misdatospoliza);
      this.codtda = datospoliza.codtda;
      this.buscar_codigos_caja();

      this.nuevapoliza = true;
      if(this.idpoliza != -1)  { 
        this.nuevapoliza = false; this.buscar_mi_poliza(); 
      } 

    }

    crear_poliza() {
      this.codigocaja = this.seleccionar_codigo_caja();
      const idtda = this.codigocaja.id;
      this.polizasService.crear_poliza(this.fecha, this.codtda, idtda).subscribe( res => {
        this.idpoliza = res.id;
        this.alerta("Se ha creado la póliza " + this.idpoliza.toString());
        this.buscar_mi_poliza();
      })
      

    }

    buscar_codigos_caja() {
      this.polizasService.buscar_Codigos_Caja().subscribe(res => {
        this.codigoscaja = res;
        this.datoslistos = true;
      })
    }

    seleccionar_codigo_caja() {
      const micod = this.codigoscaja.filter(mi => mi.tda === this.codtda)[0];
      return micod;
    }


    buscar_mi_poliza() {
        this.polizasService.buscar_x_Id(this.idpoliza).subscribe( res => {
          this.polizacaja = res;
        })
        this.buscar_renglones(this.idpoliza);

    }

    buscar_renglones(idpoliza: number) {
      this.polizasService.buscar_Renglones_Poliza(idpoliza).subscribe( res => {
        this.renglones = res;
      })
    }

    buscar_cliente() {
      this.compra = "";
      this.ventasService.buscarVentaPorCodigo (this.codvta).subscribe(res => {
        this.venta = res;
        if(!res) {
          this.alerta("Código Inexistente");
        }
        this.buscarcompra(this.venta.idfactura);
        const fechavta = this.venta.fecha.substring(0, 10);
        const qom = this.venta.qom;
        const nulets = this.venta.nulets;
        const diasgracia = 0;
        const canle = this.venta.canle;
        let letraspagadas = 0;
        if(canle) {
          letraspagadas = Math.floor ((this.venta.abonos - this.venta.enganc - this.venta.servicio) / canle);
        }
        //console.log("fechavta", fechavta, "qom", qom, "nulets", nulets, "letras pagadas",  letraspagadas, this.venta.abonos, this.venta.enganc, this.venta.servicio );

        this.yatengovencimientos = false;
        const letrasconfechas = this.configService.generavencimientos(fechavta, qom, 1, nulets, diasgracia, letraspagadas);
        this.vencimientos = JSON.parse(letrasconfechas);
        this.yatengovencimientos = true;
        //this.letras = JSON.parse(letrasconfechas);

      });
    }



    buscarcompra(id:number) {
      this.facturasSerice.obtenerRenfac(id).subscribe( res => {
        this.renglonesfac = res;
        this.compra = "";
        for(let mirenfac of this.renglonesfac) {
          this.compra += mirenfac.descri;
          if(mirenfac.folio) this.compra += " # " + mirenfac.folio.toString();
          if(mirenfac.serie) this.compra += " S/" + mirenfac.serie;
          this.compra += " ";
        }
      });

    }

    cobrar(miventa: VentasCompletas) {
      const datospoliza = {
        idpoliza: this.idpoliza,
        venta: this.venta,
        compra: this.compra,
        vencimientos: this.vencimientos,
      }
      const mensaje = JSON.stringify (datospoliza);
      const dialogref = this.dialog.open(DlgpagosComponent, {
        width:'600px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
          if(res) {
            this.buscar_renglones(this.idpoliza);
          }
        //console.log("Debug", res);
  
      });

    }

    edit(renglon: any) {}
    delete(renglon: any) {}

    alerta(mensaje: string) {
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
        //console.log("Debug", res);
  
      });
    
    }

  }
