import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service'
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
        Promotores, Factura, Renfac, FacturaCompleta,
        Movclis, Movcliscsaldo, Metodopago, Usocfdi, Regimenes } 
       from '@models/index';
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
import { DlgbusclienteComponent } from '@components/dlgbuscliente/dlgbuscliente.component';
import { MovimientostablaComponent } from '@forms/shared-components/ventas/movimientostabla/movimientostabla.component';
import { FacturaComponent } from '@forms/shared-components/ventas/factura/factura.component';
import { SolicitudFormComponent } from '@forms/shared-components/solicitud/solicitud-form/solicitud-form.component';
import { SolcitudExtendida } from '@dtos/solicitud-dto';
import { CLAVES_SOLICIT } from '@models/solicitud';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {
  clientes: Clientes[] = [];
  cliente?: Clientes;
  ciudades: Ciudades[] = [];
  movclisssaldo: Movclis[] = [];
  movclis: Movcliscsaldo[] = [];
  ventascompletas : VentasCompletas[] = [];
  venta?:VentasCompletas;
  vendedor?: Vendedores;
  promotor?: Promotores;
  renglonesfac: Renfac[] = [];
  metodpago?: Metodopago;
  usocfdi?: Usocfdi;
  factura?: Factura;
  regimen?: Regimenes;
  facturacompleta?: FacturaCompleta;
  public solicitudextendida : SolcitudExtendida = null;
  public modo = "modo inicial";

  codigo = "";
  escredito = false;
  compras = "";

  yatengomovclis = false;
  yatengofactura = false;
  yatengosolicit = false;
  
  fechainicial = "";
  fechafinal = "";
  
  numcia = -1;
  iduser = -1;
  idventa = -1;

  constructor(
    private clientesService : ClientesService,
    private ventasService: VentasService,
    private facturasSerice: FacturacionService,
    private complementosService: ComplementosService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: ActivatedRoute,

    ) { }
  
    ngOnInit(): void {
      this.idventa = Number (String(this.router.snapshot.paramMap.get('idventa')));
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.iduser;
      this.fechainicial =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.fechafinal =  this.fechainicial;
      const datosiniciales = {
        modo:"CONSULTA"
      }
      this.modo = JSON.stringify(datosiniciales);

      if(this.idventa) this.buscar_mi_venta();
    }

    buscar_mi_venta() {
      console.log("idventa", this.idventa);
      this.yatengosolicit = false;

      this.ventasService.buscarVentaPorId(this.idventa).subscribe(
        res => {
          this.venta = res;
          console.log("Venta ", this.venta);
          this.escredito =  (this.venta.qom != 'C');
          this.buscarcliente(this.venta.idcliente);
          this.buscarvendedor(this.venta.idvendedor);
          this.buscarpromotor(this.venta.idpromotor);
          this.buscarmovclis(this.venta.idventa);
          this.buscarfactura(this.venta.idfactura);
          this.buscar_solicitud(this.venta.idcliente);

        }
        
      );
      
      
    }

    buscarvendedor(id:number) {
       this.ventasService.buscarVendedorPorId(id).subscribe( res => {
          this.vendedor = res;
       })

    }

    buscarcliente(id:number) {
      this.clientesService.obten_cliente(id).subscribe( res => {
         this.cliente = res;
         this.obten_regimen (this.cliente.idregimen);
      })

   }

   obten_uso_cfdi(id: number) {
    this.complementosService.obten_usocfdi_x_id(id).subscribe(res => {
      this.usocfdi = res;
    });

   }

   obten_regimen(id: number) {
    this.complementosService.obten_regimen_x_id(id).subscribe(res => {
      this.regimen = res;
    });

   }


   buscarpromotor(id:number) {
      this.ventasService.buscarPromotorPorId(id).subscribe( res => {
         this.promotor = res;
      })

   }

   buscarmovclis(id: number) {
      this.ventasService.buscarMovimientosVentas(id).subscribe( res => {
        this.movclisssaldo = res;
        this.movclis = [];
        this.yatengomovclis = false;

        let saldo = this.venta.cargos;
        for(let mov of this.movclisssaldo) {
          saldo -= mov.abonos;
           const movcli = { ...mov, saldo: saldo}
           this.movclis.push(movcli);
        }
        console.log("movclis", this.movclis);
        this.yatengomovclis = true;
      });

    }    
    
    buscarfactura(id: number) {
      this.facturasSerice.obtenerFacturaPorId(id).subscribe( res => {
        this.factura = res;
        this.buscarRenfac(this.factura.id);
        //this.buscarUsoCfdi(this.factura.idusocfdi);
      });

    }

    buscarUsoCfdi(id: number) {
      this.complementosService.obten_usocfdi_x_id(id).subscribe( res => {
        this.usocfdi = res;
      });

    }
    
    buscarRenfac(id: number) {
      this.yatengofactura = false;
      let rfc = "";
      let email = "";
      let regimen = "";
      let usocfdi = "";
      this.facturasSerice.obtenerRenfac(id).subscribe( res => {
        this.renglonesfac = res;
        this.compras = "";
        if(this.cliente) {
          rfc = this.cliente.rfc;
          email = this.cliente.email;

        }
        if(this.regimen) regimen = this.regimen.clave + " " + this.regimen.nombre;
        for(let mirenfac of this.renglonesfac) {
          this.compras += mirenfac.descri;
          if(mirenfac.folio) this.compras += " # " + mirenfac.folio.toString();
          if(mirenfac.serie) this.compras += " S/" + mirenfac.serie;
          this.compras += " ";
        }
        this.facturacompleta = {
          ...this.factura, 
          rfc:rfc,
          regimen: regimen,
          email: email,
          renglones: this.renglonesfac
        }
        this.yatengofactura = true;
  
      });

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
      //console.log("Estoy en buscar_solcitud", idcliente);
      
      this.clientesService.obtener_solicitud(idcliente).subscribe( res => {
        //console.log("clientesService.obtener_solicitud", res);
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
        console.log("Solicitud extendida", this.solicitudextendida);
        this.yatengosolicit = true;
      });

    }
    
}
