import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { AlmacenesService } from '@services/almacenes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Almacenes } from '@models/almacenes';
import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { AlmacenesEditComponent } from './almacenes-edit/almacenes-edit.component';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { PidepasswdComponent } from '@components/pidepasswd/pidepasswd.component';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})
export class AlmacenesComponent implements OnInit {

almacenes: Almacenes[] = [];
almacen?: Almacenes;

numcia = -1;
iduser = -1;

displayedColumns: string[] = ['clave', 'nombre', 'direc', 'ciudad', 'estado', 'options'];

public headers : Array<string> = ["Clave", "Nombre", "Dirección", "Ciudad", "Estado"];
public arrayContent : Array<string> = ["clave", "nombre", "direc", "ciudad", "estado"];
public body : Array<any> = [];
public tableName = "Almacenes";
public page : PageIndex;

public tableOptions : TableOptions = {
  edit: true,
  delete: true,
  create: true,
  download: false,
  size: 0
}


constructor(
  private almacenesService : AlmacenesService,
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
    this.obten_lista_almacenes();    
  }

  obten_lista_almacenes() {
    console.log("Estoy en obten_lista_almacenes");
    //const misx = this.almacenesService.mockRequest();
    this.almacenesService.obten_lista_almacenes(this.numcia).subscribe( res => {
      this.almacenes = res;

      //this.body = res;
      //console.log(this.almacenes);

    })
  }

  create () {
    const params_z = {
      titulo: "Teclee los datos del Almacen"
    }
    const dialogref = this.dialog.open(AlmacenesEditComponent, {
      width:'350px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {
      if(res) {
        this.almacen = {
          id: 0,
          clave: res.clave,
          nombre: res.nombre,
          direc: res.direc,
          ciudad: res.ciudad,
          estado: res.estado,
          cia: this.numcia,
          status : 'A',
          createdAt: ''
        }
        this.almacenesService.create_almacenes(this.almacen).subscribe(mires => {
          this.obten_lista_almacenes();
          this.openTimedSnackBar("Se agrega un Almacen", "Agregar Almacen");
        },(error: any) => {
          this.alerta('Error: ' + error.error.message);

        }       
      );
        
        

      }
    });

  }

  edit(mialmacen: Almacenes) {

    const params_z = {
      titulo: "Teclee los datos del Almacen",
      almacen: mialmacen
    }
    const dialogref = this.dialog.open(AlmacenesEditComponent, {
      width:'350px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {
      if(res) {
        this.almacen = {
          id: mialmacen.id,
          clave: res.clave,
          nombre: res.nombre,
          direc: res.direc,
          ciudad: res.ciudad,
          estado: res.estado,
          cia: this.numcia,
          status : 'A',
          createdAt: ''
        }
        this.almacenesService.edit_almacenes(this.almacen).subscribe(mires => {
          this.obten_lista_almacenes();
          this.openTimedSnackBar("Se modifica un Almacen", "Modificar Almacen");

        },(error: any) => {
          this.alerta('Error: ' + error.error.message);

        }

      )}
    });


  }

  fijarAlmacen(mialmacen: Almacenes) {
    const params_z = {
      ubicacion: 'LI'
    }
    const dialogref = this.dialog.open(PidepasswdComponent, {
      width: '500px',
      height: '200px',
      data: JSON.stringify(params_z)

    });
    dialogref.afterClosed().subscribe(res => {
      if(res) {
        const mialmacenseleccionado = { id: mialmacen.id, clave: mialmacen.clave, nombre: mialmacen.nombre};
        localStorage.setItem('mialmacen', JSON.stringify(mialmacenseleccionado));
        this.alerta("Se ha fijado el almacen " + mialmacen.clave + " " + mialmacen.nombre);
      }
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
  
 
  detalles(mialmacen: Almacenes) {

  }


  delete(mialmacen: Almacenes) {
    console.log("Estoy en delete", mialmacen);
    const dialogref = this.dialog.open(DlgyesnoComponent, {
      width:'350px',
      data: "Seguro de Eliminar Almacén: " + mialmacen.clave + " " + mialmacen.nombre
    });
    dialogref.afterClosed().subscribe(res => {
      if(res) {
        this.almacen = {
          id: mialmacen.id,
          clave: res.clave,
          nombre: res.nombre,
          direc: res.direc,
          ciudad: res.ciudad,
          estado: res.estado,
          cia: this.numcia,
          status : 'A',
          createdAt: ''
        }
        this.almacenesService.delete_almacenes(this.almacen).subscribe(mires => {
          this.obten_lista_almacenes();
        })
      }
    });

  }

  openTimedSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  importar () {
    console.log("Estoy en Importar");

    const params_z = {
      titulo: "Seleccione el archivo con los datos a Importar"
    }
    const dialogref = this.dialog.open(DlgimportarComponent, {
      width:'350px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {
      console.log("Almacenes:", res);
      const almacenesaimportar = JSON.parse(res);
      for(let mialm of almacenesaimportar) {
        this.almacen = {
          id: 0,
          clave: mialm.clave,
          nombre: mialm.nombre,
          direc: mialm.direc,
          ciudad: mialm.ciudad,
          estado: mialm.estado,
          cia: this.numcia,
          status : 'A',
          createdAt: ''
        }
        this.almacenesService.create_almacenes(this.almacen).subscribe(mires => {
          const agregado="OK";
        })

      }

    })

  }

}