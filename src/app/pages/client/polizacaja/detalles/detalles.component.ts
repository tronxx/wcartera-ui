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
import { DatosventaComponent } from '@forms/shared-components/ventas/datosventa/datosventa.component';
import { DlgbusclienteComponent } from '@components/dlgbuscliente/dlgbuscliente.component';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {

  numcia = -1;
  idusuario = -1;
  idpoliza = -1;
  idtienda = -1;
  iniciales = "";
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
  cobratarios: Promotores[] = [];
  cobratario?: Promotores;

  polizacaja? : PolizasCompletas;
  cliente?: VentasCompletas;
  compra = "";
  letras: Vencimientos[] = [];


  displayedColumns: string[] = ['codigo', 'nombre', 'concepto', 
    'vence', 'dias', 'tipo', 'bonificacion', 'recargos', 'importe', 'neto', 'options'];

public headers : Array<string> = 
["Codigo", "Nombre", "Concepto", "Vence", "Dias", "Tipo",
  "Bonificacion", "Recargos", "Importe", "Efectivo",  "Acciones"];
public arrayContent : Array<string> = [
  'codigo', 'nombre', 'concepto', 
    'vence', 'dias', 'tipo', 'bonificacion', 'recargos', 'importe', 'neto', 
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
public miventa: VentasCompletas;

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
      this.idusuario = micompania_z.usuario.idusuario;
      this.iniciales = micompania_z.usuario.iniciales;
      this.fecha =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      const misdatospoliza  = localStorage.getItem('poliza_' + this.numcia) || "{}";
      const datospoliza =  JSON.parse(misdatospoliza);
      this.codtda = datospoliza.codtda;
      this.buscar_codigos_caja();
      this.obtencobratarios();

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

    obtencobratarios() {
      this.ventasService.buscarPromotores().subscribe( res => {
        this.cobratarios = res;
        this.cobratario = this.cobratarios.filter(mi => mi.codigo === this.iniciales)[0];
  
      });
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
      this.facturasSerice.obtenerCompra(id).subscribe( res => {
        const compra = res;
        this.compra = compra.compra,
        this.venta.compra = this.compra;
      });
    }

    buscar_por_nombre() {
        const datos = {tipo:'CLIENTE', nombre:''};
        const dialogref = this.dialog.open(DlgbusclienteComponent, {
          width:'600px',
          data: JSON.stringify(datos)
        });
        dialogref.afterClosed().subscribe(res => {
          this.venta = res;
          this.codvta = res.codigo;
          this.buscar_cliente();
        }
        )
      }
    

    cobrar(miventa: VentasCompletas) {
      const datospoliza = {
        idpoliza: this.idpoliza,
        idusuario: this.idusuario,
        iniciales: this.iniciales,
        venta: this.venta,
        compra: this.compra,
        vencimientos: this.vencimientos,
        cobratario: this.cobratario
      }
      const mensaje = JSON.stringify (datospoliza);
      const dialogref = this.dialog.open(DlgpagosComponent, {
        width:'600px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
          if(res) {
            let datospago = res;
            datospago = {...datospago, idpoliza: this.idpoliza, tienda: this.polizacaja.tda, fecha: this.polizacaja.fecha};
            this.agregar_renglon(datospago);
          }
      });

    }

    agregar_renglon(datospago: any) {
      //console.log("agrego renpol", datospago);
      this.polizasService.agrega_Renglon_Poliza(datospago).subscribe( res => {
        this.buscar_renglones(this.idpoliza);
        this.venta = null;
      },(error: any) => {
        this.alerta('Error: ' + error.error.message);
      }
      );
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
