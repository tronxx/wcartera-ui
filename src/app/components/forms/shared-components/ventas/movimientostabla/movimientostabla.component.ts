import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { VentasService } from '@services/ventas.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { ComplementosService } from '@services/complementos.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Movclis, Movcliscsaldo } from '@models/movclis';
import { MovtoeditComponent } from '../movtoedit/movtoedit.component';

@Component({
  selector: 'app-movimientostabla',
  templateUrl: './movimientostabla.component.html',
  styleUrls: ['./movimientostabla.component.scss']
})
export class MovimientostablaComponent {

  @Input() public  movimientos: Movcliscsaldo[];
  @Input() public idventa: number;
  @Input() public cargoscli: number;
  @Input() public status: string;
  //datasource = this.movimientos;
  displayedColumns: string[] = ['fecha', 'concepto', 'tda', 'tipopago', 'cobratario', 'usr', 'recargo', 'bonifica', 'abonos', 'saldo', 'options'];
  
  public headers : Array<string> = ["Fecha", "Concepto", "Póliza" , "tipo", "Cobratario", "Usr", "Recargos", "Bonificaciones", "Abonos", "Saldo", "Opciones"];
  public arrayContent : Array<string> = ['fecha', 'concepto', 'tda', 'tipopago', 'cobratario', 'usuario', 'recargo', 'bonifica', 'abonos', 'saldo', 'options'];
  public body : Array<any> = [];
  public tableName = "Movimientos";
  public page : PageIndex;
  debug = false;
  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  numcia = -1;
  iduser = -1;
  nivel = "";
  superusuario = false;
  ventacerrada = false;
  
  constructor(
    private ventasService : VentasService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: Router
    ) { }
  
    ngOnInit(): void {
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.idusuario;
      this.nivel = micompania_z.usuario.nivel;
      this.superusuario =  (this.nivel == "S");
      this.debug = this.ventasService.debug;
      this.ventacerrada  = (this.status == "CERRADA");
      if(this.debug) {
        console.log("Movimientos Tabla", this.movimientos, "idventa", this.idventa, "cargoscli", this.cargoscli, "status", this.status);
      }
      //this.cargoscli = this.movimientos[0].saldo + this.movimientos[0].importe;

    }

    

    async edit(movto: Movclis) {
      const idventa = this.idventa;

      const params_z = {
        titulo: "Teclee los datos del Movimiento",
        tipo: movto.tipopago,
        concepto: movto.concepto,
        cobratario: movto.cobratario,
        recobon: movto.recobon,
        importe: movto.importe,
        fecha: movto.fecha,
      }
      const dialogref = this.dialog.open(MovtoeditComponent, {
        width:'50%',
        data: JSON.stringify( params_z)
      });
      dialogref.afterClosed().subscribe(res => {
        if(res) {
          if(this.debug) {
            console.log("Regresando de Edit", res, "Movimiento", movto);
          }
          let movimiento = {
            fecha: res.fecha,
            concepto: res.concepto,
            tda: movto.idpoliza,
            tipopago: res.tipo,
            cobratario: res.cobratario,
            recobon: res.recobon,
            importe: res.importe,
            iduser: this.iduser,
            idmovto: movto.id,
            idventa: movto.idventa,
          }
          this.ventasService.modificarMovimientosVentas(movto.id, movimiento).subscribe(mires => {
            this.openTimedSnackBar("Se modificó el Movimiento", "Modificar Movimiento");
            this.buscarmovclis(idventa);
          },(error: any) => {
            this.alerta('Error: ' + error.error.message);
            }
        );
  
        }
      });
  
    }

    async agregar_movto() {
      const idventa = this.idventa;
      const params_z = {
        titulo: "Teclee los datos del Movimiento",
        tipo: "AB",
        concepto: "",
        cobratario: "",
        recobon: 0,
        importe: 0,
        fecha: this.datePipe.transform(new Date(),"yyyy-MM-dd")
      }
      const dialogref = this.dialog.open(MovtoeditComponent, {
        width:'50%',
        data: JSON.stringify( params_z)
      });
      dialogref.afterClosed().subscribe(res => {
        if(res) {
          if(this.debug) {
            console.log("Regresando de Edit", res);
          }
          let movimiento = {
            fecha: res.fecha,
            concepto: res.concepto,
            tda: '-1',
            tipopago: res.tipo,
            cobratario: res.cobratario,
            recobon: res.recobon,
            importe: res.importe,
            iduser: this.iduser,
            idmovto: -1,
            idventa: this.idventa,
          }
          this.ventasService.agregarMovimientosVentas(-1, movimiento).subscribe(mires => {
            this.openTimedSnackBar("Se agregó el Movimiento", "Agregar Movimiento");
            this.buscarmovclis(idventa);
          },(error: any) => {
            this.alerta('Error: ' + error.error.message);
            }
        );
  
        }
      });
  
    }


    delete(movto: Movclis) {
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: "Seguro que desea eliminar el movimiento " + movto.concepto + " ?"
      });
      dialogref.afterClosed().subscribe(res => {
        if(res) {
          this.eliminar(movto);
        }

      });

    }

    async eliminar(movto: Movclis) {
      const idventa = this.idventa;
      const id = movto.id;
      const movclisssaldo = await lastValueFrom(this.ventasService.eliminarMovimientosVentas(id));
      this.openTimedSnackBar("Se Eliminó el Movimiento", "Movimiento eliminado");
      this.buscarmovclis(idventa);

    }

    openTimedSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {duration: 3000});
    }

    async buscarmovclis(id: number) {
      const movclisssaldo = await lastValueFrom(this.ventasService.buscarMovimientosVentas(id));
      const movclis = [];
        let saldo = this.cargoscli;
        for(let mov of movclisssaldo) {
          saldo -= mov.abonos;
           const movcli = { ...mov, saldo: saldo}
           movclis.push(movcli);
        }
        this.movimientos = JSON.parse( JSON.stringify(movclis));
        //console.log("movclis", this.movclis);
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
