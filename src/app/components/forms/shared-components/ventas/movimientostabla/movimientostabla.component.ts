import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { Nombres, Clientes, Ciudades } from '@models/index';
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
import { Movclis, Movcliscsaldo } from '@models/movclis';

@Component({
  selector: 'app-movimientostabla',
  templateUrl: './movimientostabla.component.html',
  styleUrls: ['./movimientostabla.component.scss']
})
export class MovimientostablaComponent {

  @Input() public  movimientos: Movcliscsaldo[];
  //datasource = this.movimientos;
  displayedColumns: string[] = ['fecha', 'concepto', 'tipopago', 'recargo', 'bonifica', 'abonos', 'saldo', 'options'];
  
  public headers : Array<string> = ["Fecha", "Concepto", "tipo", "Recargos", "Bonificaciones", "Abonos", "Saldo", "Opciones"];
  public arrayContent : Array<string> = ['fecha', 'concepto', 'tipopago', 'recargo', 'bonifica', 'abonos', 'saldo', 'options'];
  public body : Array<any> = [];
  public tableName = "Movimientos";
  public page : PageIndex;
  public idventa: number;
  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  numcia = -1;
  iduser = -1;
  
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
    }

    edit(movto: Movclis) {}
    delete(movto: Movclis) {}


}
