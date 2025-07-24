import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service'
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
        Promotores, Factura, Renfac, FacturaCompleta, AvalCompleto,
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
import { DlgimpriletrasComponent } from '@components/dlgimpriletras/dlgimpriletras.component';
import { MovimientostablaComponent } from '@forms/shared-components/ventas/movimientostabla/movimientostabla.component';
import { FacturaComponent } from '@forms/shared-components/ventas/factura/factura.component';
import { SolicitudFormComponent } from '@forms/shared-components/solicitud/solicitud-form/solicitud-form.component';
import { SolcitudExtendida } from '@dtos/solicitud-dto';
import { CLAVES_SOLICIT, TIPOS_SOLICIT } from '@models/solicitud';
import { PolizasService } from '@services/polizas.service';
import { Tarjetatc } from '@models/index';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {
  clientes: Clientes[] = [];
  cliente?: Clientes;
  ciudades: Ciudades[] = [];
  ciudad?: Ciudades;
  movclisssaldo: Movclis[] = [];
  movclis: Movcliscsaldo[] = [];
  ventascompletas : VentasCompletas[] = [];
  venta?:VentasCompletas;
  vendedor?: Vendedores;
  promotor?: Promotores;
  aval?: AvalCompleto;
  renglonesfac: Renfac[] = [];
  metodpago?: Metodopago;
  usocfdi?: Usocfdi;
  factura?: Factura;
  regimen?: Regimenes;
  facturacompleta?: FacturaCompleta;
  letrasyaimpresas_z = [0];
  public solicitudextendida : SolcitudExtendida = null;
  public modo = "modo inicial";

  codigo = "";
  escredito = false;
  statuscerrada = "";
  compras = "";
  tarjetatc = "";
  mitarjetatc: Tarjetatc = null;
  debug = false;
  datosventa = "";

  yatengomovclis = false;
  yatengofactura = false;
  yatengosolicit = false;
  ventacerrada = false;
  
  fechainicial = "";
  fechafinal = "";
  fechacierre = "";
  diasgracia = 0;
  
  numcia = -1;
  iduser = -1;
  idventa = -1;
  nivel = "";
  superusuario = false;

  constructor(
    private clientesService : ClientesService,
    private ventasService: VentasService,
    private facturasSerice: FacturacionService,
    private complementosService: ComplementosService,
    private polizasService: PolizasService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: ActivatedRoute,

    ) { }
  
    ngOnInit(): void {
      this.codigo = String(this.router.snapshot.paramMap.get('codigo'));
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.iduser = micompania_z.usuario.iduser;
      this.nivel = micompania_z.usuario.nivel;
      this.superusuario =  (this.nivel == "S");
      this.debug = this.configService.debug;

      this.fechainicial =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.fechafinal =  this.fechainicial;
      const datosiniciales = {
        modo:"CONSULTA"
      }
      this.modo = JSON.stringify(datosiniciales);

      if(this.codigo)  {         this.buscar_mi_venta();       } 
    }

    buscar_por_nombre() {
        const datos = {tipo:'CLIENTE', nombre:''};
        const dialogref = this.dialog.open(DlgbusclienteComponent, {
          width:'600px',
          data: JSON.stringify(datos)
        });
        dialogref.afterClosed().subscribe(res => {
          this.venta = res;
          this.codigo = res.codigo;
          this.buscar_mi_venta();
        }
        )
    }


    async buscar_mi_venta() {
      console.log("codigo", this.codigo);
      this.yatengosolicit = false;

      this.ventasService.buscarVentaPorCodigo(this.codigo).subscribe(
        async res => {
          this.venta = res;
          this.idventa = this.venta.idventa;
          console.log("Venta ", this.venta);
          this.escredito =  (this.venta.qom != 'C');
          const yaleifechacierre = await (this.buscar_fecha_cierre(this.venta.idventa));
          this.buscarcliente(this.venta.idcliente);
          this.buscarvendedor(this.venta.idvendedor);
          this.buscarpromotor(this.venta.idpromotor);
          this.buscarmovclis(this.venta.idventa);
          this.buscarfactura(this.venta.idfactura);
          this.buscar_solicitud(this.venta.idcliente);
          if(this.escredito) {
            this.buscaraval(this.venta.idventa);
          }
          this.buscar_clavetc(this.venta.idventa);

        }
        
      );
      
      
    }

    async moverse_cliente(hacia: string) {
      const miventa = await lastValueFrom(this.ventasService.desplazarVentaPorCodigo(this.codigo, hacia));
      this.codigo = miventa.codigo;
      this.buscar_mi_venta()
    }

    async buscarvendedor(id:number) {
      this.vendedor = await lastValueFrom(this.ventasService.buscarVendedorPorId(id));
    }

    async buscarcliente(id:number) {
      this.cliente = await lastValueFrom(this.clientesService.obten_cliente(id));
      this.obten_regimen (this.cliente.idregimen);
      this.obtenCiudad(this.cliente.idciudad);

   }

  async buscaraval(id:number) {
    this.aval = await lastValueFrom(this.ventasService.buscarAvalporIdventa (id));
  }

  async buscar_fecha_cierre(id:number) {
    this.ventacerrada = false;
    this.fechacierre = "";
    const datofechacierre = await lastValueFrom(this.ventasService.obtener_fecha_cierre (id));
    if (this.debug) console.log("buscar_fecha_cierre", datofechacierre);
    if(datofechacierre.concepto != "false") {
      this.fechacierre = datofechacierre.concepto;
      this.ventacerrada = true;
    }
    this.statuscerrada = this.ventacerrada ? "CERRADA" : "ABIERTA";
    return (this.ventacerrada);
    
  }

  async buscar_clavetc(id:number) {
    this.tarjetatc = "";
    const datotc = await lastValueFrom(this.ventasService.obtener_clave_tc_venta (id));
    
    if(datotc) {
      this.tarjetatc = datotc.concepto;
    }
    
  }

  async obtenCiudad(id: number) {
   this.ciudad = await lastValueFrom(this.complementosService.obten_ciudad_x_id(id));
  }

  async obten_uso_cfdi(id: number) {
    this.usocfdi = await lastValueFrom(this.complementosService.obten_usocfdi_x_id(id));
  }

  async obten_regimen(id: number) {
    this.regimen = await lastValueFrom(this.complementosService.obten_regimen_x_id(id));
 }


   async buscarpromotor(id:number) {
      this.promotor = await lastValueFrom(this.ventasService.buscarPromotorPorId(id));
   }

   async buscarmovclis(id: number) {
      this.movclisssaldo = await lastValueFrom(this.ventasService.buscarMovimientosVentas(id));
        this.movclis = [];
        this.yatengomovclis = false;

        let saldo = this.venta.cargos;
        for(let mov of this.movclisssaldo) {
          saldo -= mov.abonos;
           const movcli = { ...mov, saldo: saldo}
           this.movclis.push(movcli);
        }
        //console.log("movclis", this.movclis);
        this.yatengomovclis = true;
    }    
    
    async buscarfactura(id: number) {
      this.factura = await lastValueFrom(this.facturasSerice.obtenerFacturaPorId(id));
      this.buscarRenfac(this.factura.id);
    }

    async buscarUsoCfdi(id: number) {
      this.usocfdi = await lastValueFrom(this.complementosService.obten_usocfdi_x_id(id));
    }
    
    async buscarRenfac(id: number) {
      this.yatengofactura = false;
      let rfc = "";
      let email = "";
      let regimen = "";
      let usocfdi = "";
      this.renglonesfac = await lastValueFrom(this.facturasSerice.obtenerRenfac(id));
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
          codigoregimen : this.regimen.clave,
          renglones: this.renglonesfac
      }
      const misdatosventa = {
        servicio: this.venta.servicio,
        idventa: this.venta.idventa,
        idcliente: this.venta.idcliente,
        cerrada: this.ventacerrada,
        precon: this.venta.precon,
        cargos: this.venta.cargos,
        piva: this.venta.piva,
      }
      this.datosventa = JSON.stringify(misdatosventa);
      this.yatengofactura = true;
    }    

    buscar_solicitud(idcliente: number) {
      this.diasgracia = 0;
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
      const tipo = TIPOS_SOLICIT.VENTA;
      
      this.clientesService.obtener_solicitud(idcliente, tipo).subscribe( res => {
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
            case  CLAVES_SOLICIT.DIAS_GRACIA_CLIENTE:
                      this.diasgracia = mires.concepto; break;
          }
        }
        console.log("Solicitud extendida", this.solicitudextendida);
        this.yatengosolicit = true;
      });

    }

    async imprime_letras() {
      const letrasimpresas = await this.buscar_letras_impresas();
      this.letrasyaimpresas_z = letrasimpresas;
      let nletrasimpresas = this.letrasyaimpresas_z.length;
      const nulets = this.venta.nulets;
  
      if(nletrasimpresas >= nulets) {
         this.alerta("Ya se han impreso todas las letras");
         return;
      }
      let ltaini_z = nulets;
      let ltafin_z = 0;
      for (let mii_z = 1; mii_z <= nulets; mii_z++) {
         if (!this.letrasyaimpresas_z.includes(mii_z) ) {
           if(mii_z < ltaini_z) ltaini_z = mii_z;
           if(mii_z > ltafin_z) ltafin_z = mii_z;
         } 
      }
                
      let params_z = {
        ltainicial: ltaini_z,
        ltafinal: ltafin_z,
        letrasimpresas: true,
        title: "Seleccione Las letras a Imprimir"
      }
      const dialogref = this.dialog.open(DlgimpriletrasComponent, {
        width:'350px',
        data: JSON.stringify( params_z)
      });
      let yaimprimi_z = 0;
      dialogref.afterClosed().subscribe(res => {
        if(res) {
          let valido = true;
          for (let mii_z = res.ltainicial; mii_z <= res.ltafinal; mii_z++) {
             
             if(valido) {
              if (this.letrasyaimpresas_z.includes(mii_z) ) {
                valido = false; yaimprimi_z = mii_z;
              } 
             }
          }
          if(!valido) {
            this.alerta("La letra " + yaimprimi_z.toString() + " Ya fue impresa previamente");
            return;
          }          
          const misletras = this.imprimirletras(res); 
        }
      });
    
    }

    async cerrar_venta(idventa: number) {
      if(this.venta.status == "C") {
        this.alerta("Esta venta ya ha sido cerrada previamente");
      }
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: "Seguro de Cerrar esta Venta ?"
      });
      dialogref.afterClosed().subscribe( async res => {
        if(res) {
        const fecha = this.datePipe.transform(new Date(),"yyyy-MM-ddThh:mm:ss");
        const fechacierre = await lastValueFrom( this.ventasService.grabar_dato_solicit(idventa, CLAVES_SOLICIT.FECHA_CIERRE_VENTA, fecha ));
        this.alerta("Se ha cerrado " );

        }
      });
  }


    async buscar_letras_impresas() {
      let result = [];
      if(!this.venta) {
        this.alerta("Aun no ha accesado ningun cliente");
      } else {
        const id  = this.venta.idventa;        
        try {
            let res = await this.ventasService.buscarLetrasImpresas(id).toPromise();
            for(let mii_z of res) {
              result.push(mii_z.iddato - CLAVES_SOLICIT.LETRASIMPRESAS);
            }
            
        } catch(err) {
            console.log(err); // you might not actually want to eat this exception.
        }        
    
      }
      return result;
     
    }

    async estadoCuenta() {
      let aval = {
        nombre:"",
        dir:""
      }
      if(this.aval) {
        aval.nombre = this.aval.nombre;
        aval.dir = this.aval.calle + " N." + this.aval.numpredio + " " + this.aval.ciudad;
      }

      const venta = { ...this.venta, 
        compra: this.compras,
        direccion: this.cliente.calle + " N." + this.cliente.numpredio +
          this.cliente.colonia + this.cliente.codpostal,
        ciudad: this.ciudad.ciudad,
        aval: aval.nombre,
        diraval: aval.dir,
        vendedor: this.vendedor.nombre,
        promotor: this.promotor.nombre,

        
      }
      const datoscli = {
        modo: "impresion_edo_cuenta",
        datoscli: venta,
        movtos: this.movclis,
        solicitud: this.solicitudextendida,
      }
      const edocta = await lastValueFrom (this.ventasService.imprimiEdoCta(JSON.stringify(
        datoscli
      )));
      this.polizasService.descargaArchivo(edocta.reporte);

    }

    async imprimirletras(letras: any) {
      const dircliente = this.cliente.calle + " N." + this.cliente.numpredio +
        this.cliente.colonia;
      const diraval = this.aval.calle;
      const poblac = this.ciudad.ciudad;
      const pobaval = this.aval.ciudad;
      const nombreaval = this.aval.nombre;
      let ltaini = letras.ltainicial;
      let ltafin = letras.ltafinal;
      if(!ltaini) ltaini = 1;
      if(!ltafin) ltafin = 1;

      const datos = {
        codigo: this.venta.codigo,
        idcli: this.venta.idventa,
        letrainicial: ltaini,
        letrafinal: ltafin,
        fechavta: this.venta.fecha,
        diasprom: 0,
        nombrecliente: this.venta.nombre,
        dircliente: dircliente,
        diraval: diraval,
        poblac: poblac,
        pobaval: pobaval,
        nombreaval: nombreaval,
        impletra: this.venta.canle,
        totletras: this.venta.nulets
      }
      const datosletras = JSON.stringify(datos);
      try {
          this.ventasService.impresionLetras(datosletras);
          const id = this.venta.idventa;
          this.ventasService.grabarLetrasImpresas(id, ltaini, ltafin).subscribe( res => {
            const datos = res;
          }
            
          );
          //console.log(resultado);
      } catch (error) {
          console.error("Error al obtener los datos:", error);
      }
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
