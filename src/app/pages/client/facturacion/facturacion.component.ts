import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { VentasService } from '@services/ventas.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentasCompletas, Ubivtas, Clientes } from '@models/index';
import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PidepasswdComponent } from '@components/pidepasswd/pidepasswd.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent {

  fechainicial = "";
  fechafinal = "";
  idubica = 0;
  numcia = 0;
  iduser = 0;
  ventascompletas : VentasCompletas[] = [];
  venta?:VentasCompletas;
  ubivtas: Ubivtas[] = [];
  miubica?: Ubivtas
  ubivta = "";
  codcartera = "";
  idcliente = 0;
  debug = false;

  displayedColumns: string[] = ['codigo', 
    'nombre', 'compra', 'qom', 'enganc', 'letras', 'impxlet', 'cargos', 
    'abonos', 'saldo',
    'options'];
  
  public headers : Array<string> = ["Código", "Nombre", "Compra", "qom", 
    "Enganche", "Letras", "Cargos", "Abonos", "Saldo" ];
  public body : Array<any> = [];
  public tableName = "Ventas";
  public page : PageIndex;
  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  constructor(
    private ventasService: VentasService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    private configService:  ConfigService,
    public router: ActivatedRoute,
    public route: Router
    ) { }

    ngOnInit(): void {
      let mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.iduser;
      this.fechainicial =  this.datePipe.transform(new Date(),"yyyy-MM" +"-01");
      const dia = new Date().getDate();
      if( dia < 10) {
        const today = new Date();
        const primerdia =  new Date(today.getFullYear(), today.getMonth() - 1, 1);
        this.fechainicial =  this.datePipe.transform(primerdia,"yyyy-MM-dd");
      }
      this.fechafinal =  this.datePipe.transform(new Date(),"yyyy-MM-dd");;
      this.debug = this.configService.debug;
      
      let miregistroventas  = localStorage.getItem(`ventas_${this.numcia}`) || "{}";
      const ubicatemp =JSON.parse(miregistroventas); 
      if(ubicatemp)  this.ubivta =  ubicatemp.ubicacion;
      console.log("ubivta", this.ubivta)
      this.cargaCatalogos();
      this.idcliente = Number(this.router.snapshot.paramMap.get('idcliente'));
      if(this.debug) console.log("Facturacion idcliente", this.idcliente);
      if(this.idcliente > 0) {
        this.buscar_ventas_cliente(this.idcliente);
      }

    }
  
    cargaCatalogos() {
      this.ventasService.buscarUbicaciones().subscribe( res => {
        this.ubivtas = res;
      })
    }

    selecciona_tarjetas_tc() {}    

    agregar() {
      let url_z = '/app/facturacion/crearventa';
      //this.alerta("Estoy en detalles poliza voy a url:" + url_z);
      
      this.route.navigateByUrl(url_z).then( (e) => {
        if (e) {
          console.log("Navigation is successful!", url_z);
        } else {
          console.log("Navigation has failed!", url_z);
        }
      });    

    }

    moverse(hacia: string) {}

    buscar() {
    }

    impresion () {}

    edit(venta: VentasCompletas) {

    }

    delete (venta: VentasCompletas) {
      console.log("Estoy en delete", venta);
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: "Seguro de Eliminar Esta Venta: " + venta.codigo + " " + venta.nombre
      });
      dialogref.afterClosed().subscribe(res => {
        if(res) {
          this.ventasService.delete(venta).subscribe(mires => {
            this.buscar_lista();
          })
        }
      });
  
  
    }

    buscar_ventas_cliente(idcliente: number) {
      this.ventasService.buscarVentaPoridCliente (idcliente).subscribe( res => {
        this.ventascompletas = res;
      })

    }

    buscar_lista() {
      let nombreubica = ""
      let datosregistro  = localStorage.getItem(`ventas_${this.numcia}`) || "{}";
      let ubicatemp =JSON.parse(datosregistro); 
  
      const ubicacionseleccionada =  this.ubivtas.filter(ubicacion => ubicacion.codigo === this.ubivta);
      if(ubicacionseleccionada.length) {
        this.miubica = ubicacionseleccionada[0];
        nombreubica = this.miubica.nombre;
        this.idubica = this.miubica.id;

      }
      ubicatemp.ubicacion =  this.ubivta;
      ubicatemp.idubica =  this.idubica;
      ubicatemp.nombreubica = nombreubica;
      ubicatemp.fechainicial = this.fechainicial;
      ubicatemp.fechafinal =  this.fechafinal;
      localStorage.setItem(`ventas_${this.numcia}`, JSON.stringify( ubicatemp));
      console.log("miregistroventas",  ubicatemp);

      this.ventasService.buscar(this.fechainicial, this.fechafinal, this.ubivta).subscribe( res => {
        this.ventascompletas = res;
        if(this.ventascompletas.length == 0) {
          this._snackBar.open("No se encontraron ventas", "Cerrar", {
            duration: 2000,
          });
        }
      })

    }
    
    Abierto(element: VentasCompletas)  {
      return (element.status == "A");
    }

    detalles_venta(codigo: number) {
      let url_z = `/app/detalleventas/${codigo}`;
      //this.alerta("Estoy en detalles poliza voy a url:" + url_z);
      console.log('Venta', codigo, url_z);
      
      this.route.navigateByUrl(url_z).then( (e) => {
        if (e) {
          console.log("Navigation is successful!");
        } else {
          console.log("Navigation has failed!");
        }
      });    
  
    }
  
}
