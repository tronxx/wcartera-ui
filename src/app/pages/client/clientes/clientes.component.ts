import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { Nombres, Clientes, Ciudades, ClienteCompleto } from '@models/index';
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
import { DlgbusclienteComponent } from '@components/dlgbuscliente/dlgbuscliente.component';
import { DatosolicitudComponent } from './datosolicitud/datosolicitud.component';
import { ClienteDtoCompleto } from '@dtos/clientes.dto';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent {

  clientes: Clientes[] = [];
  cliente?: Clientes;
  clientecompleto?: ClienteCompleto;
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
    private configservice: ConfigService,
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
      this.buscar_lista_clientes();
    }
  
  agregar_cliente() {
    this.cliente = {
      id: -1,
      codigo: "",
      idciudad: -1,
      codpostal: "",
      idnombre: -1,
      nombre: "",
      calle: "",
      numpredio: "",
      colonia: "",
      telefono: "",
      email: "",
      idregimen: -1,
      rfc: "",
      status: "",
      cia: 1,
      created_at: "",
      updated_at: ""
  
    }
    const params_z = {
      titulo: "Teclee los datos del Cliente",
      cliente : this.cliente,
      modo: "NUEVO"

    }
    const dialogref = this.dialog.open(ClientesEditComponent, {
      width:'600px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {
      if(res) {
        const idcli = this.configservice.calcula_idcli(res.codigo);
        const nvocliente = {
          id: idcli,
          idnombre: 0,
          nombre: "",
          appat: res.appat,
          apmat: res.apmat,
          nombre1: res.nompil1,
          nombre2: res.nompil2,
          codigo: res.codigo,
          idciudad: res.ciudad,
          codpostal: res.codpostal,
          calle: res.calle,
          numpredio: res.numpredio,
          colonia: res.colonia,
          telefono: res.telefono,
          email: res.email,
          idregimen: res.regimen,
          rfc: res.rfc,
          status: 'A',
          cia: this.numcia,
          created_at: "",
          updated_at: ""
        }
        console.log("nvocliente", nvocliente);
        this.clientesService.crear_cliente(nvocliente).subscribe(mires => {
          this.buscar_lista_clientes();
          this.openTimedSnackBar("Se agregó un Cliente", "Agregar Cliente");
        },(error: any) => {
          this.alerta('Error: ' + error.error.message);

        }       
      );
      }

    })

  }

  buscar_lista_clientes() {
    this.clientesService.obten_lista_clientes().subscribe(res => {
      this.clientes = res;
    })

  }

  buscar_cliente() {
    const datos = {tipo:'CLIENTE', nombre:''};
    const dialogref = this.dialog.open(DlgbusclienteComponent, {
      width:'600px',
      data: JSON.stringify(datos)
    });
    dialogref.afterClosed().subscribe(res => {
      this.cliente = res;
     
    }
    )
  }

  moverse_cliente(hacia: string) {}

  impresionCliente() {}

  async detalles(cliente: Clientes) {
    const nombres = await this.clientesService.obtenerNombresAsync(cliente.idnombre);
    this.clientecompleto = { ...cliente, ...nombres}
    const idcli = cliente.id;
    const params_z = {
      titulo: "Datos del Cliente",
      cliente: this.clientecompleto,
      modo: "DETALLES"
    }
    const dialogref = this.dialog.open(ClientesEditComponent, {
      width:'600px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {});
  }


  edit(cliente: Clientes) {
    console.log("Estoy en Edit", cliente);
    const idcli = cliente.id;
    const params_z = {
      titulo: "Teclee los datos del Cliente",
      cliente: cliente,
      modo: "EDIT"
    }
    const dialogref = this.dialog.open(ClientesEditComponent, {
      width:'600px',
      data: JSON.stringify( params_z)
    });
    dialogref.afterClosed().subscribe(res => {
      console.log("Regreso del Edit", res);
      if(res.nompil1 == "CANCELADO") res = null;
      if(res) {

        const nvocliente = {
          id: idcli,
          idnombre: 0,
          nombre: "",
          appat: res.appat,
          apmat: res.apmat,
          nombre1: res.nompil1,
          nombre2: res.nompil2,
          codigo: res.codigo,
          idciudad: res.ciudad,
          codpostal: res.codpostal,
          calle: res.calle,
          numpredio: res.numpredio,
          colonia: res.colonia,
          telefono: res.telefono,
          email: res.email,
          idregimen: res.regimen,
          rfc: res.rfc,
        }
        console.log("cliente editado", nvocliente);
        this.clientesService.edit_cliente(nvocliente).subscribe(mires => {
          this.buscar_lista_clientes();
          this.openTimedSnackBar("Se modificó un Cliente", "Agregar Cliente");
        },(error: any) => {
          this.alerta('Error: ' + error.error.message);

        }       
      );
      }

    })


  }

  delete (cliente: Clientes) {
    console.log("Estoy en delete", cliente);
    const dialogref = this.dialog.open(DlgyesnoComponent, {
      width:'350px',
      data: "Seguro de Eliminar Cliente: " + cliente.codigo + " " + cliente.nombre
    });
    dialogref.afterClosed().subscribe(res => {
      if(res) {
        this.clientesService.delete_cliente(cliente).subscribe(mires => {
          this.buscar_lista_clientes();
        })
      }
    });


  }

  datosolicitud (cliente: Clientes) {

    console.log("Estoy en datosolicitud", cliente);
    let url_z = `/app/clientes/solicitud/${cliente.id}`;
    //this.alerta("Estoy en detalles poliza voy a url:" + url_z);
    
    this.router.navigateByUrl(url_z).then( (e) => {
      if (e) {
        console.log("Navigation is successful!", url_z);
      } else {
        console.log("Navigation has failed!");
      }
    });    

  }

  
  clienteAbierto(element: Clientes)  {
    return (element.status == "A");
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

  openTimedSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }

}
