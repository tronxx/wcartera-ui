import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { Clientes, Ciudades } from '@models/index';
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
import { ClientesEditComponent } from './clientes-edit/clientes-edit.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent {

  clientes: Clientes[] = [];
  cliente?: Clientes;
  ciudades: Ciudades[] = [];
  codigo = "";
  
  fechainicial = "";
  fechafinal = "";
  
  numcia = -1;
  iduser = -1;
  
  displayedColumns: string[] = ['codigo', 'nombre', 'direc', 'telefono', 'email', 'options'];
  
  public headers : Array<string> = ["Código", "Nombre", "Dirección", "Teléfono", "Email"];
  public arrayContent : Array<string> = ["codigo", "nombre", "direc", "telefono", "email"];
  public body : Array<any> = [];
  public tableName = "Clientes";
  public page : PageIndex;
  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  constructor(
    private clientesService : ClientesService,
    private complementosService: ComplementosService,
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
      this.iduser = micompania_z.usuario.iduser;
      this.fechainicial =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.fechafinal =  this.fechainicial;
    }
  
  agregar_cliente() {
    const params_z = {
      titulo: "Teclee los datos del Cliente"
    }
    const dialogref = this.dialog.open(ClientesEditComponent, {
      width:'600px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {})

  }

  buscar_cliente() {}

  moverse_cliente(hacia: string) {}

  impresionCliente() {}

  edit(cliente: Clientes) {}

  delete (cliente: Clientes) {}
  
  clienteAbierto(element: Clientes)  {
    return true;
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
