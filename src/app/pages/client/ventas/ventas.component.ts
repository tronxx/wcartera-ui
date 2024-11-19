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
  codigo = "";
  escredito = false;
  compras = "";

  yatengomovclis = false;
  yatengofactura = false;
  
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
      if(this.idventa) this.buscar_mi_venta();
    }

    buscar_mi_venta() {
      console.log("idventa", this.idventa);
      this.ventasService.buscarVentaPorId(this.idventa).subscribe(
        res => {
          this.venta = res;
          this.escredito =  (this.venta.qom != 'C');
          this.buscarcliente(this.venta.idcliente);
          this.buscarvendedor(this.venta.idvendedor);
          this.buscarpromotor(this.venta.idpromotor);
          this.buscarmovclis(this.venta.id);
          this.buscarfactura(this.venta.idfactura);

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
          uuid: "",
          regimen: regimen,
          email: email,
          renglones: this.renglonesfac
        }
        this.yatengofactura = true;
  
      });

    }    
    
}
