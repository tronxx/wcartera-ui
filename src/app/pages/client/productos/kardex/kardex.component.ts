import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ProductosService } from '@services/productos.service';
import { AlmacenesService } from '@services/almacenes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { Productos, Kardex, Almacenes } from '@models/index';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { KardexAgregarComponent } from '../kardex-agregar/kardex-agregar.component';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})

export class KardexComponent {

  
  producto?: Productos;
  kardex: Kardex[] = [];
  movimiento?: Kardex;

  codigo = "";
  almacen? : Almacenes;
  numcia = -1;
  iduser = -1;
  idalm = 3;
  idart = 1;
  idcia = 1;
  
  displayedColumns: string[] = ['fecha', 'descri', 'folio', 'serie', 'fechasale', 'descrisale', 'options'];
  
  public headers : Array<string> = ["Fecha", "Descripción", "Folio", "Serie", "Fecha.Sale", "Descripcion Salida"];
  public arrayContent : Array<string> = ["fecha", "descri", "folio", "serie", "fechasale", "descrisale"];
  public body : Array<any> = [];
  public tableName = "Kardex";
  public page : PageIndex;

  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }
  
  
  constructor(
    private productosService : ProductosService,
    private almacenesSerice: AlmacenesService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    public router: ActivatedRoute,
    ) { }
  
    ngOnInit(): void {
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.cia;
      this.iduser = micompania_z.iduser;
      this.idart = Number (String(this.router.snapshot.paramMap.get('idart')));      
      this.buscar_almacen();
      this.buscar_producto();
      this.buscar_kardex();
    }

    buscar_producto() {
      this.productosService.obten_producto(this.numcia, this.idart).subscribe( res => {
        this.producto = res;
      });

    }

    buscar_kardex() {
      this.productosService.obten_kardex(this.numcia, this.idalm, this.idart).subscribe( res => {
        this.kardex = res;
        //this.body = res;
        //console.log(this.productos);
      })
    }


    buscar_almacen() {
      this.almacenesSerice.obten_almacen(this.idalm).subscribe( res => {
        this.almacen = res;
      });

    }

    async agregar_kardex() {
      let ultimofolio = 0;
      const cosita = await this.productosService.obtenLastFolio(this.idcia, this.idart, this.idalm).toPromise().then(
        res => {
          ultimofolio = res;
        }
      )

      const params_z = {
        titulo: "Teclee los datos del Movimiento",
        ultimofolio: ultimofolio,
        tipo: this.producto.tipo

      }
      const dialogref = this.dialog.open(KardexAgregarComponent, {
        width:'350px',
        data: JSON.stringify( params_z)
      });
      dialogref.afterClosed().subscribe(res => {
        console.log("Regresando de Form", res);
        if(res) {
          let movimiento = {
            id:0,
            idalm:this.idalm,
            idserie:0,
            fecha: res.fecha,
            folio: res.folio,
            serie: res.serie,
            descri: res.descri,
            costou:0,
            status: "A",
            salio: "N",
            descrisale: "",
            cia: this.numcia,
          }
          this.productosService.crearMovimientoKardex(this.movimiento).subscribe(mires => {
            this.buscar_kardex();
          })
  
          this.openTimedSnackBar("Se agrega un Movimiento al Kardex", "Agregar Kardex");
        }
      });
  
    }

    delete (movimiento: Kardex) {}
    edit (movimiento: Kardex) {}

    openTimedSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {duration: 3000});
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
         
}
