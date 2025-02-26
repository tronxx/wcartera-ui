import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesDto } from '@dtos/clientes.dto';
import { ComplementosService } from '@services/complementos.service';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { NombreDto } from '@dtos/nombres.dto'
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { SolicitudFormComponent } from '@forms/shared-components/solicitud/solicitud-form/solicitud-form.component';
import { SolcitudExtendida } from '@dtos/solicitud-dto';
import { Solicitudcompleta } from '@models/solicitud';
import { CLAVES_SOLICIT, TIPOS_SOLICIT } from '@models/solicitud';

@Component({
  selector: 'app-datosolicitud',
  templateUrl: './datosolicitud.component.html',
  styleUrls: ['./datosolicitud.component.scss']
})
export class DatosolicitudComponent  implements OnInit {
  title = "";
  public message = "Clientes";
  public solicitudextendida : SolcitudExtendida = null;
  public modo = "modo inicial";
  
  idcliente = 1;
  cia = 1;
  yatengodatos = false;

  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(
      private router: ActivatedRoute,
      private clientesService : ClientesService,
      public dialog: MatDialog,
      private ventasService: VentasService,
  
    ) { }
  
    ngOnInit(): void {
      this.idcliente = Number (String(this.router.snapshot.paramMap.get('idcliente')));
      this.cia = this.ventasService.cia;

      const datosiniciales = {
        modo:"CONSULTA"
      }
      this.modo = JSON.stringify(datosiniciales);
      //console.log("datosolicitud modo", this.modo, "idcliente", this.idcliente);
      this.buscar_solicitud(this.idcliente);
    }

    buscar_solicitud(idcliente: number) {
      this.solicitudextendida = {
        idcliente : idcliente,
        ocupacion : "",
        ingresos:  "",
        sexo:  "",
        edad:  "",
        edocivil:  "",
        clientelugartrabajo:  "",
        clienteteltrabajo:  "",
        clientedirectrabajo:  "",
        clienteantiguedadtrabajo:  "",
        clienteconyugenombre:  "",
        clienteconyugeocupacion:  "",
        clienteconyugeteltrabajo:  "",
        clienteconyugeantiguedad:  "",
        clienteconyugetrabajo: "",
        clienteconyugedirectrabajo: "",
        avalgenerales: "",
        avalocupacion: "",
        avaltelefono: "",
        avalantiguedad: "",
        avaltrabajo: "",
        avalconyugenombre:  "",
        avalconyugeocupacion:  "",
        avalconyugeingresos:  "",
        avalconyugetrabajo:  "",
        avalconyugedirectrabajo: "",
        avalconyugeantiguedad:  "",
        avalconyugetelefono:  "",
        familiarnombre: "",
        familiardirec: "",
        conocidonombre: "",
        conocidodirec: "",
        referencia1: "",
        referencia2: "",
        observaciones: "",
    
      }

      this.solicitudextendida.idcliente = idcliente;
      console.log("Estoy en buscar_solcitud", idcliente);
      const tipo = TIPOS_SOLICIT.VENTA;

      this.clientesService.obtener_solicitud(idcliente, tipo).subscribe( res => {
        console.log("clientesService.obtener_solicitud", res);
        for(let mires of res) {
          switch (mires.iddato) {
            case  CLAVES_SOLICIT.OCUPACION:
              this.solicitudextendida.ocupacion = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_LGAR_TRABAJO:
              this.solicitudextendida.clientelugartrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_TEL_TRABAJO:
              this.solicitudextendida.clienteteltrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_DIREC_TRABAJO:
              this.solicitudextendida.clientedirectrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_CONYUGE_NOMBRE:
                this.solicitudextendida.clienteconyugenombre = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_CONYUGE_OCUPACION:
                this.solicitudextendida.clienteconyugeocupacion = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_CONYUGE_TRABAJO:
                this.solicitudextendida.clienteconyugetrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_CONYUGE_NOMBRE:
                this.solicitudextendida.clienteconyugenombre = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_CONYUGE_TEL_TRABAJO:
                this.solicitudextendida.clienteconyugeteltrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_CONYUGE_DIREC_TRABAJO:
                this.solicitudextendida.clienteconyugedirectrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_GENERALES:
                this.solicitudextendida.avalgenerales = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_CONYUGE_NOMBRE:
                this.solicitudextendida.avalconyugenombre = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_CONYUGE_TRABAJO:
                this.solicitudextendida.avalconyugetrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_OCUPACION:
                this.solicitudextendida.avalocupacion = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_TELFONO:
                this.solicitudextendida.avaltelefono = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_TRABAJO:
                this.solicitudextendida.avaltrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CONOCIDO_NOMBRE:
                this.solicitudextendida.conocidonombre = mires.concepto; break;
            case  CLAVES_SOLICIT.CONOCIDO_DIREC:
                  this.solicitudextendida.conocidodirec = mires.concepto; break;
            case  CLAVES_SOLICIT.FAMILIAR_NOMBRE:
                  this.solicitudextendida.familiarnombre = mires.concepto; break;
            case  CLAVES_SOLICIT.FAMILIAR_DIREC:
                  this.solicitudextendida.familiardirec = mires.concepto; break;          
            case  CLAVES_SOLICIT.AVAL_CONYUGE_OCUPACION:
                  this.solicitudextendida.avalconyugeocupacion = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_CONYUGE_TELEFONO:
                    this.solicitudextendida.avalconyugetelefono = mires.concepto; break;
            case  CLAVES_SOLICIT.AVAL_CONYUGE_DIREC_TRABAJO:
                  this.solicitudextendida.avalconyugedirectrabajo = mires.concepto; break;
            case  CLAVES_SOLICIT.CLIENTE_INGRESOS:
                  this.solicitudextendida.ingresos = mires.concepto; break; 
            case  CLAVES_SOLICIT.CLIENTE_SEXO:
                  this.solicitudextendida.sexo = mires.concepto; break;   
            case  CLAVES_SOLICIT.CLIENTE_EDAD:
                  this.solicitudextendida.edad = mires.concepto; break;   
            case  CLAVES_SOLICIT.CLIENTE_EDOCIVIL:
                  this.solicitudextendida.edocivil = mires.concepto; break;   
            case  CLAVES_SOLICIT.CLIENTE_ANTIGUEDAD_TRABAJO:
                  this.solicitudextendida.clienteantiguedadtrabajo = mires.concepto; break;   
            case  CLAVES_SOLICIT.AVAL_ANTIGUEDAD_TRABAJO:
                  this.solicitudextendida.avalantiguedad = mires.concepto; break;   
            case  CLAVES_SOLICIT.AVAL_CONYUGE_ANTIGUEDAD:
                  this.solicitudextendida.avalconyugeantiguedad = mires.concepto; break;   
            case  CLAVES_SOLICIT.REFERENCIA1:
                  this.solicitudextendida.referencia1 = mires.concepto; break;   
            case  CLAVES_SOLICIT.REFERENCIA2:
                    this.solicitudextendida.referencia2 = mires.concepto; break;   
            case  CLAVES_SOLICIT.OBSERVACIONES:
                      this.solicitudextendida.observaciones = mires.concepto; break;   
          }
        }
        //console.log("Solicitud extendida", this.solicitudextendida);
        this.yatengodatos = true;
      });

    }

    aceptar(data : any){
      let datossolicit = [
        {id: CLAVES_SOLICIT.OCUPACION, concepto: data.ocupacion},
        {id: CLAVES_SOLICIT.CLIENTE_LGAR_TRABAJO, concepto: data.clientelugartrabajo},
        {id: CLAVES_SOLICIT.CLIENTE_TEL_TRABAJO, concepto: data.clienteteltrabajo},
        {id: CLAVES_SOLICIT.CLIENTE_DIREC_TRABAJO, concepto: data.clientedirectrabajo},
        {id: CLAVES_SOLICIT.CLIENTE_CONYUGE_NOMBRE, concepto: data.clienteconyugenombre},
        {id: CLAVES_SOLICIT.CLIENTE_CONYUGE_OCUPACION, concepto: data.clienteconyugeocupacion},
        {id: CLAVES_SOLICIT.CLIENTE_CONYUGE_TRABAJO, concepto: data.clienteconyugetrabajo},
        {id: CLAVES_SOLICIT.CLIENTE_CONYUGE_TEL_TRABAJO, concepto: data.clienteconyugeteltrabajo},
        {id: CLAVES_SOLICIT.CLIENTE_CONYUGE_DIREC_TRABAJO, concepto: data.clienteconyugedirectrabajo},
        {id: CLAVES_SOLICIT.AVAL_GENERALES, concepto: data.avalgenerales},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_OCUPACION, concepto: data.avalconyugeocupacion},
        {id: CLAVES_SOLICIT.AVAL_OCUPACION, concepto: data.avalocupacion},
        {id: CLAVES_SOLICIT.AVAL_TELFONO, concepto: data.avaltelefono},
        {id: CLAVES_SOLICIT.AVAL_TRABAJO, concepto: data.avaltrabajo},
        {id: CLAVES_SOLICIT.CONOCIDO_NOMBRE, concepto: data.conocidonombre},
        {id: CLAVES_SOLICIT.CONOCIDO_DIREC, concepto: data.conocidodirec},
        {id: CLAVES_SOLICIT.FAMILIAR_NOMBRE, concepto: data.familiarnombre},
        {id: CLAVES_SOLICIT.FAMILIAR_DIREC, concepto: data.familiardirec},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_NOMBRE, concepto: data.avalconyugenombre},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_OCUPACION, concepto: data.avalconyugeocupacion},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_TRABAJO, concepto: data.avalconyugetrabajo},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_TELEFONO, concepto: data.avalconyugetelefono},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_DIREC_TRABAJO, concepto: data.avalconyugedirectrabajo},
        {id: CLAVES_SOLICIT.CLIENTE_INGRESOS, concepto: data.ingresos},
        {id: CLAVES_SOLICIT.CLIENTE_SEXO, concepto: data.sexo},
        {id: CLAVES_SOLICIT.CLIENTE_EDAD, concepto: data.edad},
        {id: CLAVES_SOLICIT.CLIENTE_EDOCIVIL, concepto: data.edocivil},
        {id: CLAVES_SOLICIT.CLIENTE_ANTIGUEDAD_TRABAJO, concepto: data.clienteantiguedadtrabajo},
        {id: CLAVES_SOLICIT.AVAL_ANTIGUEDAD_TRABAJO, concepto: data.avalantiguedad},
        {id: CLAVES_SOLICIT.AVAL_CONYUGE_ANTIGUEDAD, concepto: data.avalconyugeantiguedad},
        {id: CLAVES_SOLICIT.REFERENCIA1, concepto: data.referencia1},
        {id: CLAVES_SOLICIT.REFERENCIA2, concepto: data.referencia2},
        {id: CLAVES_SOLICIT.OBSERVACIONES, concepto: data.observaciones},
      ];
      const tipo = TIPOS_SOLICIT.VENTA;
      const solicitud = {
        cia: this.cia,
        tipo: tipo,
        idcliente: this.idcliente,
        datos: datossolicit
      }
      console.log("Hiciste click en aceptar", solicitud);
      this.clientesService.crear_solicitud(solicitud).subscribe( res => {
        console.log("Resultado Grabar Solicitid", res);
        this.alerta("Solicitud Creada");
        

      });
    }
  
    closeno() {
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

    aceptarSolicit(data : any){}
   
}
