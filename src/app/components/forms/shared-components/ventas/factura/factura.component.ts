import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { Nombres, Clientes, Ciudades, Regimenes, Ventas } from '@models/index';
import { ComplementosService } from '@services/complementos.service';
import { FacturacionService } from '@services/facturacion.service';
import { ConfigService } from '@services/config.service';
import { VentasService } from '@services/ventas.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { FechaDialogComponent } from '@forms/shared-components/fecha-dialog/fecha-dialog.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Movclis, Movcliscsaldo } from '@models/movclis';
import { FacturaCompleta, Renfac } from '@models/index';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent {

  @Input() public factura: FacturaCompleta;
  displayedColumns: string[] = ['codigo', 'descri', 'canti', 'preciou', 'importe', 'folio', 'serie', 'options'];
  
  public headers : Array<string> = ["Fecha", "Concepto", "tipo", "Recargos", "Bonificaciones", "Abonos", "Saldo", "Opciones"];
  public arrayContent : Array<string> = ['fecha', 'concepto', 'tipopago', 'recargo', 'bonifica', 'abonos', 'saldo', 'options'];
  public body : Array<any> = [];
  public tableName = "Renglones";
  public page : PageIndex;
  public idventa: number;

  fechacierre = "";
  statusfac = "";
  facturacerrada = false;

  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  numcia = -1;
  iduser = -1;
  cliente? : Clientes;
  regimen? : Regimenes;
  venta?: Ventas;
  

  constructor(
    private clientesService : ClientesService,
    private complementosService: ComplementosService,
    private facturasService: FacturacionService,
    private configService: ConfigService,
    private ventasService: VentasService,
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
      this.facturacerrada = (this.factura.status == 'C');
    }

    edit(renglon: Renfac) {}
    delete(renglon: Renfac) {}

    async imprimir_factura() {
      const pararms = {
        uuid: this.factura.uuid,
        rotar: 'N'
      }
      this.facturasService.obten_pdf_cfdi_factura(JSON.stringify(pararms));
    }


    async cerrar_factura() {
      if(this.factura.status == "C") {
        this.alerta("Esta factura ya ha sido cerrada previamente");
        return;
      }
      let fmin = new Date();
      fmin.setDate(new Date().getDate() - 3);
      const fechaFactura = this.factura.fecha;
      const fechaActual = this.datePipe.transform(new Date(),"yyyy-MM-dd");
      const fechaMinima = this.datePipe.transform(fmin,"yyyy-MM-dd");
      this.fechacierre = this.factura.fecha;
      const idventa = this.factura.idventa;

      if (fechaFactura < fechaMinima || fechaFactura > fechaActual) {
        const dialogRef = this.dialog.open(FechaDialogComponent, {
          width: '500px',
          data: JSON.stringify({ minDate: fechaMinima, maxDate: fechaActual, title: "Teclee la Fecha de Cierre" })
        });
         dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log("Regresando de pedir fecha", result);
            this.fechacierre = result;
            this.continuaConElTimbrado();
          } else {
            this.alerta("La fecha no fue proporcionada o no es válida.");
          }
        });
      } else {
        this.continuaConElTimbrado();
      }
    }

    async continuaConElTimbrado() {
      const machote = await this.generar_json();
      const timbre = await this.manda_a_timbrar(machote);

    }

    async manda_a_timbrar(documento: any) {
      const strdocto = JSON.stringify(documento);
      const mitimbrado = await this.manda_el_timbrado(strdocto);
      const idfactura = this.factura.id;
      console.log("Regreso de timbrado", mitimbrado);
      if (mitimbrado.data[0].cfdi_respuesta.timbrada == "true") {
        const uuid = mitimbrado.data[0].cfdi_complemento.uuid;
        this.factura.uuid = uuid;
        this.facturasService.grabar_uuid_en_factura(idfactura, uuid).subscribe( res => {
          this.alerta("Se ha timbrado la factura con uuid:" + uuid );
        })
      } else {
        const error = mitimbrado.data[0].cfdi_respuesta.error.descripcion;
        this.alerta("Error " + error);
        this.facturasService.cerrar_factura(idfactura).subscribe(res => {
          const cerrada = res;
        });
      }
    }

    async manda_el_timbrado(docto: string): Promise<any> {
      return await lastValueFrom (this.facturasService.generarTimbrefactura(docto));
    }

    async generar_json() {

      let fac_importe = 0;
      let fac_total = 0;
      let fac_iva = 0;
      let nombrefac = "";
      let regimen = "616";
      this.fechacierre = this.configService.ajustaFechaCierre(this.fechacierre);
      const idventa = this.factura.idventa;
      this.venta = await this.busca_venta(idventa);
      const idcli = this.venta.idcliente;
      this.cliente = await this.busca_cliente(idcli);
      const idnombre = this.cliente.idnombre;
      const nombres = await  this.clientesService.obtenerNombresAsync(idnombre);
      nombrefac = this.cliente.nombre;
      let usdocfdi = this.factura.codigousocfdi;
      if(nombres) {
        const apellidos = (nombres.appat + " " + nombres.apmat).trim();
        const nompil = (nombres.nompil1 + " " + nombres.nompil2 ).trim();
        nombrefac = (nompil + " " + apellidos ).trim();
      }
      if(this.factura.codigoregimen.length) {
        regimen = this.factura.codigoregimen;
      }

      let codpostalempresa = this.configService.obtenCodigoPostalCia();
      let machote = this.facturasService.crearJsonTimbreVenta();
      let rfccliente = this.factura.rfc;
      let codpostreceptor = this.cliente.codpostal;
      if(rfccliente == "") rfccliente = "XAXX010101000";
      if( rfccliente == "XAXX010101000") {
        codpostreceptor = codpostalempresa;
        regimen = "616";
        usdocfdi = "S01";
      }

      machote.cfdi__comprobante.folio = this.factura.numero.toString();
      machote.cfdi__comprobante.serie = this.factura.serie;
      machote.cfdi__comprobante.tipo_comprobante = "I";
      machote.cfdi__comprobante.lugar_expedicion = codpostalempresa;
      if(this.factura.codigometodopago == "") this.factura.codigometodopago = "PUE";
      const forma_pago = "01";
      machote.cfdi__comprobante.metodo_pago = this.factura.codigometodopago;
      machote.cfdi__comprobante.forma_pago = forma_pago;
      machote.cfdi__comprobante.fecha = this.fechacierre;

      machote.cfdi__comprobante.cfdi__receptor.rfc = rfccliente;
      machote.cfdi__comprobante.cfdi__receptor.nombre = nombrefac;
      machote.cfdi__comprobante.cfdi__receptor.domicilio_fiscal = codpostreceptor;
      machote.cfdi__comprobante.cfdi__receptor.email = this.factura.email;
      machote.cfdi__comprobante.cfdi__receptor.regimen_fiscal = regimen;
      machote.cfdi__comprobante.cfdi__receptor.uso_cfdi = usdocfdi;
      let conceptoInicial = JSON.parse(JSON.stringify(machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto[0]));
      machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto = [];
      let ii_z = 0;
      const misren = JSON.parse( JSON.stringify(this.factura.renglones));
      const losrenglones = this.procesarconceptoFactura(misren);
      const renglones = JSON.parse(JSON.stringify(await this.buscarCodSat(losrenglones))) ;
      // console.log ("Renglones combinados", renglones);
      for(let miren of renglones) {
        const importe =  Math.round( (miren.canti * miren.preciou * 1000)) /1000;
        const iva = Math.round ( ( importe * miren.piva / 100) * 1000) /1000;
        const total = importe + iva;
        let concepto = JSON.parse(JSON.stringify(conceptoInicial));
        concepto.cantidad = miren.canti.toString();
        ii_z += 1;
        concepto.clave_unidad = "H87";
        concepto.clave_producto_servicio = miren.catprodsat;
        concepto.descripcion = miren.descri;
        if(miren.serie != "")  miren.descri + " SERIE " + miren.serie;
        concepto.valor_unitario = miren.preciou.toFixed(4).toString();
        concepto.importe = importe.toFixed(3);
        concepto.cfdi__impuestos.total_impuestos_trasladados = iva.toFixed(3);
        let imptos = {
          base: importe.toFixed(3),
          impuesto: "002",
          tipo_factor: "Tasa",
          tasa_cuota: (miren.piva / 100).toFixed(6),
          importe: iva.toFixed(3)
        }
        concepto.cfdi__impuestos.cfdi__traslados.cfdi__traslado[0] = (imptos)
        machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto.push(concepto);
        //console.log("Concepto", miren.conse, concepto)
        fac_importe += importe;
        fac_iva += iva;
      }
      machote.cfdi__comprobante.subtotal = fac_importe.toFixed(2);
      machote.cfdi__comprobante.total = (fac_importe + fac_iva).toFixed(2);
      machote.cfdi__comprobante.cfdi__impuestos.total_impuestos_trasladados = (fac_iva).toFixed(2);
      machote.cfdi__comprobante.cfdi__impuestos.cfdi__traslados.cfdi__traslado[0].base = (fac_importe).toFixed(2);
      machote.cfdi__comprobante.cfdi__impuestos.cfdi__traslados.cfdi__traslado[0].importe = (fac_iva).toFixed(2);
      return (machote);
    }

    procesarconceptoFactura(renglones: Renfac[]): Renfac[] {
      return renglones
        .filter((mirenfac, index) => {
          if (mirenfac.importe !== 0) {
            // Concatenar las descripciones de los renglones posteriores con importe == 0
            if(mirenfac.serie != "") mirenfac.descri += " SERIE " + mirenfac.serie;
            for (let ii = index + 1; ii < renglones.length; ii++) {
              if (renglones[ii].importe === 0) {
                mirenfac.descri += ` ${renglones[ii].descri}`;
              } else {
                break; // Salir del bucle cuando encuentres un renglón con importe != 0
              }
            }
            return true; // Incluir este renglón en el resultado
          }
          return false; // Excluir este renglón del resultado
        });

        
    }


    async buscarCodSat(renglones: Renfac[]): Promise<any[]> {
      const promesas = renglones.map(async (miren) => {
        const parametros = JSON.stringify({ codigo: miren.codigo });
        const respuesta = await lastValueFrom(this.ventasService.busca_codigo_inven(parametros));
        let catprodsat = '56101500';
        if(respuesta) {
          catprodsat = respuesta.catprodsat
        }
        return { ...miren, catprodsat: catprodsat }; // Usa la respuesta para asignar el valor correcto a catprodtsat
      });
    
      const nvorenglones = await Promise.all(promesas);
      return nvorenglones;
    }

    async busca_venta(idventa: number): Promise<Ventas> {
      return await lastValueFrom( this.ventasService.buscarVentaPorId(idventa));
    }

    async busca_cliente(idcli: number): Promise<Clientes> {
        return await lastValueFrom (this.clientesService.obten_cliente(idcli));
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
