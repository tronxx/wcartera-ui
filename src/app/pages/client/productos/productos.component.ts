import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ProductosService } from '@services/productos.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Productos } from '@models/index';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent {

productos: Productos[] = [];
producto?: Productos;
codigo = "";

numcia = -1;
iduser = -1;

displayedColumns: string[] = ['codigo', 'descri', 'linea', 'tipo', 'preciou', 'options'];

public headers : Array<string> = ["Código", "Descripción", "Línea", "Tipo", "Precio.U."];
public arrayContent : Array<string> = ["codigo", "descri", "linea", "tipo", "preciou"];
public body : Array<any> = [];
public tableName = "Productos";
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
  private _snackBar: MatSnackBar,
  public dialog: MatDialog,
  public builder : UntypedFormBuilder,
  public router: Router
  ) { }

  ngOnInit(): void {
    var mistorage_z  = localStorage.getItem('token') || "{}";
    const micompania_z =  JSON.parse(mistorage_z);
    this.numcia = micompania_z.usuario.cia;
    this.iduser = micompania_z.usuario.iduser;
  }

  obten_lista_productos() {
    console.log("Estoy en obten_lista_productos");
    //const misx = this.productosService.mockRequest();
    this.productosService.obten_lista_productos_codigo(this.numcia, this.codigo).subscribe( res => {
      this.productos = res;

      //this.body = res;
      //console.log(this.productos);

    })
  }

  kardex (miproducto: Productos) {  
    let url_z = '/app/productos/kardex/' + miproducto.id;
    //this.alerta("Estoy en detalles poliza voy a url:" + url_z);
    console.log('Producto:', miproducto);
    
    this.router.navigateByUrl(url_z).then( (e) => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });    

  }

  create () {  }

  edit(miproducto: Productos) {  }
  delete(miproducto: Productos) {  }

  alerta(mensaje: string) {
    const dialogref = this.dialog.open(DlgyesnoComponent, {
      width:'350px',
      data: mensaje
    });
    dialogref.afterClosed().subscribe(res => {
      //console.log("Debug", res);
    });
  
  }

  openTimedSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }

}
