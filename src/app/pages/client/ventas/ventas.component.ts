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
      this.codigo = String(this.router.snapshot.paramMap.get('codigo'));
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

      if(this.codigo)  {         this.buscar_mi_venta();       } 
    }

    buscar_mi_venta() {
      console.log("codigo", this.codigo);
      this.yatengosolicit = false;

      this.ventasService.buscarVentaPorCodigo(this.codigo).subscribe(
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
          if(this.escredito) {
            this.buscaraval(this.venta.idventa);
          }

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
         this.obtenCiudad(this.cliente.idciudad);
      })

   }

   buscaraval(id:number) {
    this.ventasService.buscarAvalporIdventa (id).subscribe( res => {
       this.aval = res;
    })

 }

 obtenCiudad(id: number) {
    this.complementosService.obten_ciudad_x_id(id).subscribe( res => {
      this.ciudad = res;
    });
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
        //console.log("movclis", this.movclis);
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
