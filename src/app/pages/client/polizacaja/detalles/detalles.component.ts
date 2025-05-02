import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service'
import { ConfigService } from '@services/config.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
        Promotores, Factura, Renfac, FacturaCompleta, PolizasCompletas,
        Renpolcompleto, Vencimientos, TIPOS_FAC, CLAVES_SOLICIT,
        Movclis, Movcliscsaldo, Metodopago, Usocfdi, Regimenes, Codigocaja } 
       from '@models/index';
import { ComplementosService } from '@services/complementos.service';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { VencimientosComponent } from '@forms/shared-components/vencimientos/vencimientos/vencimientos.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PolizasService } from '@services/polizas.service';
import { DlgpagosComponent } from '../dlgpagos/dlgpagos.component';
import { DatosventaComponent } from '@forms/shared-components/ventas/datosventa/datosventa.component';
import { DlgbusclienteComponent } from '@components/dlgbuscliente/dlgbuscliente.component';
import { reduceRight } from 'lodash';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {

  numcia = -1;
  idusuario = -1;
  idpoliza = -1;
  idtienda = -1;
  iniciales = "";
  codtda = "";
  codvta = "";
  codigoscaja: Codigocaja[] = [];
  codigocaja?:Codigocaja;
  datoslistos = false;
  fecha = "";
  nuevapoliza = false;
  renglones: Renpolcompleto[] = [];
  renglon?: Renpolcompleto;
  venta: VentasCompletas;
  renglonesfac: Renfac[] = [];
  cobratarios: Promotores[] = [];
  cobratario?: Promotores;

  polizacaja? : PolizasCompletas;
  cliente?: VentasCompletas;
  compra = "";
  letras: Vencimientos[] = [];
  polizaabierta = false;
  usoscfdi: Usocfdi[] = [];
  metodospago: Metodopago[] = [];
  factura? : FacturaCompleta;
  debug = true;
  uuidcobranza = "";
  uuidrecargo = "";
  imprimiendopoliza = false;
  tienecfdipoliza = false;
  tienecfdirecrgo = false;
  


  displayedColumns: string[] = ['codigo', 'nombre', 'concepto', 
    'vence', 'dias', 'tipo', 'bonificacion', 'recargos', 'importe', 'neto', 'options'];

public headers : Array<string> = 
["Codigo", "Nombre", "Concepto", "Vence", "Dias", "Tipo",
  "Bonificacion", "Recargos", "Importe", "Efectivo",  "Acciones"];
public arrayContent : Array<string> = [
  'codigo', 'nombre', 'concepto', 
    'vence', 'dias', 'tipo', 'bonificacion', 'recargos', 'importe', 'neto', 
];

public body : Array<any> = [];
public tableName = "Pólizas";
public page : PageIndex;

public tableOptions : TableOptions = {
  edit: false,
  delete: false,
  create: false,
  download: false,
  size: 0
}

public vencimientos: Vencimientos[] = [];
yatengovencimientos = false;
public miventa: VentasCompletas;

//dataSource = this.productos;


  constructor(
    private clientesService : ClientesService,
    private ventasService: VentasService,
    private facturasService: FacturacionService,
    private complementosService: ComplementosService,
    private polizasService: PolizasService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: ActivatedRoute

    ) { }
  
    ngOnInit(): void {
      this.idpoliza = Number (String(this.router.snapshot.paramMap.get('idpoliza')));
      var mistorage_z  = localStorage.getItem('token') || "{}";
      const micompania_z =  JSON.parse(mistorage_z);
      this.numcia = micompania_z.usuario.cia;
      this.idusuario = micompania_z.usuario.idusuario;
      this.iniciales = micompania_z.usuario.iniciales;
      this.fecha =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      const misdatospoliza  = localStorage.getItem('poliza_' + this.numcia) || "{}";
      const datospoliza =  JSON.parse(misdatospoliza);
      this.codtda = datospoliza.codtda;
      this.debug = this.configService.debug;
      this.buscar_codigos_caja();
      this.obtencobratarios();

      this.nuevapoliza = true;
      if(this.idpoliza != -1)  { 
        this.nuevapoliza = false; this.buscar_mi_poliza(); 
      } 

    }

    crear_poliza() {
      this.codigocaja = this.seleccionar_codigo_caja();
      const idtda = this.codigocaja.id;
      this.polizasService.crear_poliza(this.fecha, this.codtda, idtda).subscribe( res => {
        this.idpoliza = res.id;
        this.alerta("Se ha creado la póliza " + this.idpoliza.toString());
        this.buscar_mi_poliza();
      })
      

    }

    async obtencobratarios() {
      this.cobratarios  = await lastValueFrom (this.ventasService.buscarPromotores());
      this.cobratario = this.cobratarios.find(micobratario => micobratario.codigo === this.iniciales);
    }
  

    async buscar_codigos_caja() {

     this.codigoscaja = await lastValueFrom(this.polizasService.buscar_Codigos_Caja());
      this.datoslistos = true;
    }

    seleccionar_codigo_caja() {
      const micod = this.codigoscaja.find(micodcaja => micodcaja.tda === this.codtda);
      return micod;
    }


    buscar_mi_poliza() {
        this.polizasService.buscar_x_Id(this.idpoliza).subscribe( res => {
          this.polizacaja = res;
          this.polizaabierta = (this.polizacaja.status == 'A');
          this.codtda = this.polizacaja.tda;
          this.codigocaja = this.seleccionar_codigo_caja();
          this.checar_si_hay_timbrado()
          this.buscar_renglones(this.idpoliza);
        })

    }

    async buscar_renglones(idpoliza: number) {
      this.renglones = await lastValueFrom ( this.polizasService.buscar_Renglones_Poliza(idpoliza));
    }

    async buscar_cliente() {
      this.compra = "";
      this.venta = await lastValueFrom(this.ventasService.buscarVentaPorCodigo (this.codvta));
        if(!this.venta) {
          this.alerta("Código Inexistente");
          
        }
        this.venta.saldo = this.venta.cargos - this.venta.abonos;
        this.buscarcompra(this.venta.idfactura);
        const fechavta = this.venta.fecha.substring(0, 10);
        const qom = this.venta.qom;
        const nulets = this.venta.nulets;
        let diasgracia = 0;
        const misdiasgracia = await(this.buscar_dias_gracia(this.venta.idventa));
        if(misdiasgracia) diasgracia = misdiasgracia.concepto.toString();
        const canle = this.venta.canle;
        let letraspagadas = 0;
        if(canle) {
          letraspagadas = Math.floor ((this.venta.abonos - this.venta.enganc - this.venta.servicio) / canle);
        }
        //console.log("fechavta", fechavta, "qom", qom, "nulets", nulets, "letras pagadas",  letraspagadas, this.venta.abonos, this.venta.enganc, this.venta.servicio );

        this.yatengovencimientos = false;
        const letrasconfechas = this.configService.generavencimientos(fechavta, qom, 1, nulets, diasgracia, letraspagadas);
        this.vencimientos = JSON.parse(letrasconfechas);
        this.yatengovencimientos = true;
        //this.letras = JSON.parse(letrasconfechas);

  
    }

    async buscar_dias_gracia(idventa: number) {
      const diasgracia = await lastValueFrom(this.ventasService.obtener_dias_gracia(idventa));
      return (diasgracia);
    }



    buscarcompra(id:number) {
      this.facturasService.obtenerCompra(id).subscribe( res => {
        const compra = res;
        this.compra = compra.compra,
        this.venta.compra = this.compra;
      });
    }

    buscar_por_nombre() {
        const datos = {tipo:'CLIENTE', nombre:''};
        const dialogref = this.dialog.open(DlgbusclienteComponent, {
          width:'600px',
          data: JSON.stringify(datos)
        });
        dialogref.afterClosed().subscribe(res => {
          this.venta = res;
          this.codvta = res.codigo;
          this.buscar_cliente();
        }
        )
      }
    

    cobrar(miventa: VentasCompletas) {
      const datospoliza = {
        idpoliza: this.idpoliza,
        idusuario: this.idusuario,
        iniciales: this.iniciales,
        venta: this.venta,
        compra: this.compra,
        vencimientos: this.vencimientos,
        cobratario: this.cobratario
      }
      const mensaje = JSON.stringify (datospoliza);
      const dialogref = this.dialog.open(DlgpagosComponent, {
        width:'600px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
          if(res) {
            let datospago = res;
            datospago = {...datospago, idpoliza: this.idpoliza, tienda: this.polizacaja.tda, fecha: this.polizacaja.fecha};
            this.agregar_renglon(datospago);
          }
      });

    }

    async agregar_renglon(datospago: any) {
      try {

      //console.log("agrego renpol", datospago);
      const idventa = datospago.idventa;
      const renglonagregado = await lastValueFrom (this.polizasService.agrega_Renglon_Poliza(datospago));
      const idrenpol = renglonagregado[0][0].v_idrenpol;
      console.log("Ya agregué el renglon", renglonagregado, "id", idrenpol);
      await this.buscar_renglones(this.idpoliza);
      if(datospago.recobon  > 0 && datospago.tipo == 'AB') {
        const timbrado = await this.generar_cfdi_bonificacion(
          {usocfdi: 'G03', tipofac: TIPOS_FAC.NOTA_CREDITO, 
            serie: this.codigocaja.seriebon, idrenpol: idrenpol,
            idventa: idventa
          }
        );
      }
      this.venta = null;
      return { success: true, idrenpol };
      } catch (error) {
        // Manejo del error
        console.error("Error al agregar renglón de póliza:", error);
        this.alerta('Error: ' + error);
 
        // Opcional: mostrar mensaje al usuario utilizando un servicio de notificaciones
        // this.notificationService.showError("No se pudo agregar el renglón a la póliza");
        
        // Opcional: puedes retornar información sobre el error
        return { success: false, error };
        
        // O simplemente relanzar el error para que lo maneje el componente padre
        // throw error;
      }
    }


    edit(renglon: any) {}
    delete(renglon: any) {}

    alerta(mensaje: string) {
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
        //console.log("Debug", res);
  
      });
    
    }

    cerrar_poliza(poliza: any) {
      const idpoliza = poliza.id;
      if(poliza.status == 'C') {
        this.alerta("Esta Póliza ya ha sido cerrada previamente");
        return;
      }
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: 'Seguro de Cerrar esta póliza ?'
      });
      dialogref.afterClosed().subscribe(res => {
        const status = res;
        if(status) {
          this.si_cerrar_poliza(poliza);
        }
  
      });
    }

    async si_cerrar_poliza(poliza: any) {
      this.polizasService.cerrar_Poliza(poliza).subscribe(
        res => {
          const resultado = res;
          this.alerta("Se ha cerrado la póliza");
        });
        const facturasExistentes = await this.buscarFacturasxIdVenta(this.idpoliza);
        let timbresexisten = { cfdicobranza: false, cfdirecargo: false}
        for(let mifactura of facturasExistentes) {
          if(mifactura.tipofac == TIPOS_FAC.PAGO_3_3) timbresexisten.cfdicobranza = true;
          if(mifactura.tipofac == TIPOS_FAC.RECARGO)  timbresexisten.cfdirecargo  = true;
        }
        let msgtimbrados = "";
        if(timbresexisten.cfdicobranza ) msgtimbrados += "Ya Existe el cfdi de cobranza";
        if(timbresexisten.cfdirecargo ) msgtimbrados += "\nYa Existe el cfdi de Recargo";
        //if(msgtimbrados.length) this.alerta(msgtimbrados);
        if(!timbresexisten.cfdicobranza) {
          const timbrado = await this.generar_cfdi_pago({usocfdi: 'CP01', tipofac: TIPOS_FAC.PAGO_3_3, serie: this.codigocaja.seriepol});
        }
        const recargos = this.checa_si_hay_recargos();
        // this.alerta ("Recargos = " + recargos.toString());
        if( (recargos > 0)  && ! timbresexisten.cfdirecargo) {
          const timbrado = await this.generar_cfdi_recargos({usocfdi: 'G03', tipofac: TIPOS_FAC.RECARGO, serie: this.codigocaja.serierec});
        }
        this.impresion_poliza('POLIZA');
    }

    checa_si_hay_recargos() {
      let recargos = 0;
      for(let miren of this.renglones) {
        recargos += miren.recargos;
      }
      return (recargos);
    }

    async checar_si_hay_timbrado() {
      const facturasExistentes = await this.buscarFacturasxIdVenta(this.idpoliza);
      this.uuidcobranza = "";
      this.uuidrecargo  = "";
      this.tienecfdipoliza = false;
      this.tienecfdirecrgo = false;
            
      for(let mifactura of facturasExistentes) {
        if(mifactura.tipofac == TIPOS_FAC.PAGO_3_3){
          this.uuidcobranza = mifactura.uuid;
          this.tienecfdipoliza = true;
        } 
        if(mifactura.tipofac == TIPOS_FAC.RECARGO) { 
          this.uuidrecargo = mifactura.uuid;
          this.tienecfdirecrgo = true;
        }
      }

    }

    async generar_cfdi_recargos(data: any) {

      const seriefac = data.serie; 
      const ultimofolio = await this.buscaUltimoFolioFactura(seriefac);
      this.metodospago = await this.cargar_metodos_pago();
      this.usoscfdi = await this.cargar_usos_cfdi();
      let numerofac = ultimofolio.ultimo || 0;
      numerofac++;
      const claveusocfdi = data.usocfdi;
      const miusocfdi =  this.usoscfdi.find(usocfdi => usocfdi.clave === claveusocfdi);
      const idusocfdi = miusocfdi.id;
      let idmetodopago = -1;
      const clavemetodopago = "01";
      const mimetodopago =  this.metodospago.find(metodo => metodo.clave === clavemetodopago);
      idmetodopago = mimetodopago.id;

      const factur = {
          serie: seriefac,
          numero: numerofac,
          idventa: this.polizacaja.id,
          fecha: this.polizacaja.fecha,
          iduuid: 0,
          idusocfdi: idusocfdi,
          idmetodopago: idmetodopago,
          importe: 0,
          iva: 0,
          total: 0,
          status: "A",
          cia: 1,
          tipofac: data.tipofac
      }
      this.factura = await lastValueFrom (this.facturasService.grabar_factura(JSON.stringify( factur)));
  
      const machote = await this.generar_json_recargo();
      if (this.debug) console.log("cfdi timbre", machote);
      const timbre = await this.manda_a_timbrar(machote);
    }


    async generar_cfdi_pago(data: any) {

          const seriefac = data.serie; 
          const ultimofolio = await this.buscaUltimoFolioFactura(seriefac);
          this.metodospago = await this.cargar_metodos_pago();
          this.usoscfdi = await this.cargar_usos_cfdi();
          let numerofac = ultimofolio.ultimo || 0;
          numerofac++;
          const claveusocfdi = data.usocfdi;
          const idmetodopago = -1;
          const miusocfdi =  this.usoscfdi.find(usocfdi => usocfdi.clave === claveusocfdi);
          const idusocfdi = miusocfdi.id;

          const factur = {
              serie: seriefac,
              numero: numerofac,
              idventa: this.polizacaja.id,
              fecha: this.polizacaja.fecha,
              iduuid: 0,
              idusocfdi: idusocfdi,
              idmetodopago: idmetodopago,
              importe: 0,
              iva: 0,
              total: 0,
              status: "A",
              cia: 1,
              tipofac: data.tipofac
          }
          this.factura = await lastValueFrom (this.facturasService.grabar_factura(JSON.stringify( factur)));
      
         const machote = await this.generar_json_pago();
         if (this.debug) console.log("cfdi timbre", machote);
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
        return ({status:'OK', uuid:uuid});
      } else {
        const error = mitimbrado.data[0].cfdi_respuesta.error.descripcion;
        this.alerta("Error " + error);
        this.facturasService.cerrar_factura(idfactura).subscribe(res => {
          const cerrada = res;
        });
        return ({status:'ERROR', error:error});
      }
    }


    async manda_el_timbrado(docto: string): Promise<any> {
      return await lastValueFrom (this.facturasService.generarTimbrefactura(docto));
    }

    async  buscaUltimoFolioFactura(serie: string): Promise<any> {
        return await lastValueFrom( this.facturasService.buscarUltimoFolio(serie));
    }

    async  buscarFacturaVenta(idfactura: number): Promise<any> {
      return await lastValueFrom( this.facturasService.obtenerFacturaPorId(idfactura));
    }

    async  buscarFacturasxIdVenta(idventa: number): Promise<any> {
      return await lastValueFrom( this.facturasService.obtenerFacturaPorIdVenta(idventa));
    }

    async cargar_metodos_pago() {
      return await lastValueFrom( this.complementosService.obten_lista_metodopago());
    }
  
    async cargar_usos_cfdi() {
      return await lastValueFrom( this.complementosService.obten_lista_usocfdi());
    }
  
    async buscar_venta(idventa: number) {
      return await lastValueFrom( this.ventasService.buscarVentaPorId(idventa) );
    }
  

    async generar_json_pago() {
      let fac_importe = 0;
      let fac_total = 0;
      let fac_iva = 0;
      let nombrefac = "";
      let regimen = "616";
      const hoy = new Date()

      const fechacierre = this.configService.ajustaFechaCierre( this.fecha); 
      // --> Asi debe Quedar, solo para terminar de configurar es que lo pongo asi
      //  const fechacierre = this.configService.ajustaFechaCierre( this.polizacaja.fecha);
      const idventa = this.polizacaja.id; //factura.idventa;
      //this.venta = await this.busca_venta(idventa);
      const idcli = idventa; //this.venta.idcliente;
      
      let usocfdi = 'CP01';
      const strfecha1 = fechacierre.split(/[T]/);
      const partes = strfecha1[0].split(/[-._]/);
      const fechareverse = `${partes[2]}-${partes[1]}-${partes[0]}`;
      
      nombrefac = 'PUBLICO EN GENERAL ' +   this.polizacaja.nombretda + ' ' + fechareverse;

      let codpostalempresa = this.configService.obtenCodigoPostalCia();
      let machote = this.facturasService.crearJsonTimbrePagos();
      let rfccliente = 'XAXX010101000';
      let codpostreceptor = codpostalempresa;
      if(rfccliente == "") rfccliente = "XAXX010101000";
      if( rfccliente == "XAXX010101000") {
        codpostreceptor = codpostalempresa;
        regimen = "616";
        usocfdi = "CP01";
      }

      machote.cfdi__comprobante.folio = this.factura.numero.toString();
      machote.cfdi__comprobante.serie = this.factura.serie;
      machote.cfdi__comprobante.tipo_comprobante = "P";
      machote.cfdi__comprobante.lugar_expedicion = codpostalempresa;      
      machote.cfdi__comprobante.fecha = fechacierre;

      machote.cfdi__comprobante.cfdi__receptor.rfc = rfccliente;
      machote.cfdi__comprobante.cfdi__receptor.nombre = nombrefac;
      machote.cfdi__comprobante.cfdi__receptor.domicilio_fiscal = codpostreceptor;
      machote.cfdi__comprobante.cfdi__receptor.email = this.factura.email;
      machote.cfdi__comprobante.cfdi__receptor.regimen_fiscal = regimen;
      machote.cfdi__comprobante.cfdi__receptor.uso_cfdi = usocfdi;
      let nvomipago = JSON.parse(JSON.stringify(machote.cfdi__comprobante.cfdi__complemento.pago20__pagos.pago20__pago[0]));
      machote.cfdi__comprobante.cfdi__complemento.pago20__pagos.pago20__pago=[];
      let importetotal = 0;
      for(let miren of this.renglones) {
        let mipago = JSON.parse(JSON.stringify(nvomipago));
        const importe =  Math.round( ((miren.importe - miren.bonificacion) * 1000)) /1000;
        mipago.monto = importe;
        mipago.fecha_pago = fechacierre;
        mipago.forma_pago = "01";
        const idventa = miren.idventa;
        const miventa = await this.buscar_venta(idventa);
        const idfacvta = miventa.idfactura;
        const facvta = await this.buscarFacturaVenta(idfacvta);
        const numletra = miren.letra;
        const uuid = facvta.uuid;
        const seriefac = facvta.serie;
        const numfac = facvta.numero;
        const saldoanterior = miventa.cargos - miventa.abonos + importe;
        const saldonvo = saldoanterior - importe;
        mipago.pago20__docto_relacionado[0].uuid = uuid;
        mipago.pago20__docto_relacionado[0].serie = seriefac;
        mipago.pago20__docto_relacionado[0].folio = numfac.toString();
        mipago.pago20__docto_relacionado[0].numero_parcialidad = numletra.toString();
        mipago.pago20__docto_relacionado[0].importe_pagado = importe.toFixed(2);
        mipago.pago20__docto_relacionado[0].importe_saldo_anterior = saldoanterior.toFixed(2);
        mipago.pago20__docto_relacionado[0].importe_saldo_insoluto = saldonvo.toFixed(2);
        machote.cfdi__comprobante.cfdi__complemento.pago20__pagos.pago20__pago.push(mipago);
        importetotal += importe;
      }
      machote.cfdi__comprobante.cfdi__complemento.pago20__pagos.pago20__totales[0].monto_total_pagos = importetotal.toFixed(2);
      return (machote);
    }

    async generar_json_recargo() {
      let fac_importe = 0;
      let fac_total = 0;
      let fac_iva = 0;
      let nombrefac = "";
      let regimen = "616";
      const hoy = new Date()

      const fechacierre = this.configService.ajustaFechaCierre( this.fecha); 
      // --> Asi debe Quedar, solo para terminar de configurar es que lo pongo asi
      //  const fechacierre = this.configService.ajustaFechaCierre( this.polizacaja.fecha);
      const idventa = this.polizacaja.id; //factura.idventa;
      //this.venta = await this.busca_venta(idventa);
      const idcli = idventa; //this.venta.idcliente;
      
      let usocfdi = 'CP01';
      const strfecha1 = fechacierre.split(/[T]/);
      const partes = strfecha1[0].split(/[-._]/);
      const fechareverse = `${partes[2]}-${partes[1]}-${partes[0]}`;
      
      nombrefac = 'PUBLICO EN GENERAL ' +   this.polizacaja.nombretda + ' ' + fechareverse;

      let codpostalempresa = this.configService.obtenCodigoPostalCia();
      let machote = this.facturasService.crearJsonTimbreVenta();
      let rfccliente = 'XAXX010101000';
      let codpostreceptor = codpostalempresa;
      if(rfccliente == "") rfccliente = "XAXX010101000";
      if( rfccliente == "XAXX010101000") {
        codpostreceptor = codpostalempresa;
        regimen = "616";
        usocfdi = "S01";
      }

      machote.cfdi__comprobante.folio = this.factura.numero.toString();
      machote.cfdi__comprobante.serie = this.factura.serie;
      machote.cfdi__comprobante.tipo_comprobante = "I";
      machote.cfdi__comprobante.metodo_pago = "PUE";
      machote.cfdi__comprobante.forma_pago = "01";
      machote.cfdi__comprobante.lugar_expedicion = codpostalempresa;      
      machote.cfdi__comprobante.fecha = fechacierre;

      machote.cfdi__comprobante.cfdi__receptor.rfc = rfccliente;
      machote.cfdi__comprobante.cfdi__receptor.nombre = nombrefac;
      machote.cfdi__comprobante.cfdi__receptor.domicilio_fiscal = codpostreceptor;
      machote.cfdi__comprobante.cfdi__receptor.email = this.factura.email;
      machote.cfdi__comprobante.cfdi__receptor.regimen_fiscal = regimen;
      machote.cfdi__comprobante.cfdi__receptor.uso_cfdi = usocfdi;
      let conceptoInicial = JSON.parse(JSON.stringify(machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto[0]));
      machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto = [];
      let importetotal = 0;
      const piva = 16;
      const renglonescrec = this.renglones.filter(renglon => renglon.recargos > 0);
      for(let miren of renglonescrec) {
        const idventa = miren.idventa;
        const miventa = await this.buscar_venta(idventa);
        const nombrecliente = miventa.nombre;
        let concepto = JSON.parse(JSON.stringify(conceptoInicial));
        const total =  Math.round( (miren.recargos * 1000)) /1000;
        const importe = Math.round ( ( total / ( 1 + piva / 100)) * 1000) /1000;
        const iva  = total - importe;
        concepto.cantidad = "1"
        concepto.clave_unidad = "E48";
        concepto.clave_producto_servicio = '84121902'
        concepto.descripcion = 'RECARGO ' + nombrecliente + ' ' + miren.concepto;
        concepto.valor_unitario = importe.toFixed(4).toString();
        concepto.importe = importe.toFixed(3);
        concepto.cfdi__impuestos.total_impuestos_trasladados = iva.toFixed(3);
        let imptos = {
          base: importe.toFixed(3),
          impuesto: "002",
          tipo_factor: "Tasa",
          tasa_cuota: (piva / 100).toFixed(6),
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

    async generar_cfdi_bonificacion(data: any) {

      const idrenglon = data.idrenpol;
      const idventa = data.idventa;
      const seriefac = data.serie; 
      const ultimofolio = await this.buscaUltimoFolioFactura(seriefac);
      this.metodospago = await this.cargar_metodos_pago();
      this.usoscfdi = await this.cargar_usos_cfdi();
      let numerofac = ultimofolio.ultimo || 0;
      numerofac++;
      const claveusocfdi = data.usocfdi;
      const idmetodopago = -1;
      const miusocfdi =  this.usoscfdi.find(usocfdi => usocfdi.clave === claveusocfdi);
      const idusocfdi = miusocfdi.id;

      const factur = {
          serie: seriefac,
          numero: numerofac,
          idventa: idventa,
          fecha: this.polizacaja.fecha,
          iduuid: 0,
          idusocfdi: idusocfdi,
          idmetodopago: idmetodopago,
          importe: 0,
          iva: 0,
          total: 0,
          status: "A",
          cia: 1,
          tipofac: data.tipofac
      }
      this.factura = await lastValueFrom (this.facturasService.grabar_factura(JSON.stringify( factur)));
  
     const machote = await this.generar_json_bonificacion(idrenglon);
     if (this.debug) console.log("cfdi timbre", machote);
     const timbre = await this.manda_a_timbrar(machote);
     if(timbre.status == 'OK') {
        const pararms = {
          uuid: timbre.uuid,
          rotar: 'N'
        }
        this.facturasService.obten_pdf_cfdi_factura(JSON.stringify(pararms));
     }
}



    async generar_json_bonificacion(idrenglon: number) {
      let fac_importe = 0;
      let fac_total = 0;
      let fac_iva = 0;
      let nombrefac = "";
      let regimen = "616";
      const hoy = new Date()

      const fechacierre = this.configService.ajustaFechaCierre( this.fecha); 
      // --> Asi debe Quedar, solo para terminar de configurar es que lo pongo asi
      //  const fechacierre = this.configService.ajustaFechaCierre( this.polizacaja.fecha);
      //this.venta = await this.busca_venta(idventa);

      const miren = this.renglones.find(elrenglon => elrenglon.id == idrenglon);
      console.log("miren", miren);
      const idventa = miren.idventa; //factura.idventa;

      console.log("miren", miren, "iventa", idventa);
      
      let usocfdi = 'S01';
      const strfecha1 = fechacierre.split(/[T]/);
      const partes = strfecha1[0].split(/[-._]/);
      const fechareverse = `${partes[2]}-${partes[1]}-${partes[0]}`;
      
      nombrefac = 'PUBLICO EN GENERAL ' +   this.polizacaja.nombretda + ' ' + fechareverse;

      let codpostalempresa = this.configService.obtenCodigoPostalCia();
      let machote = this.facturasService.crearJsonTimbreVenta();
      let rfccliente = 'XAXX010101000';
      let codpostreceptor = codpostalempresa;
      const miventa = await this.buscar_venta(idventa);
      const idcli = miventa.idcliente;
      const micliente = await this.busca_cliente(idcli);
      rfccliente = micliente.rfc;
      const idregimen = micliente.idregimen;

      if(rfccliente == "") rfccliente = "XAXX010101000";
      if( rfccliente == "XAXX010101000") {
        codpostreceptor = codpostalempresa;
        regimen = "616";
        usocfdi = "S01";

      }

      machote.cfdi__comprobante.folio = this.factura.numero.toString();
      machote.cfdi__comprobante.serie = this.factura.serie;
      machote.cfdi__comprobante.tipo_comprobante = "E";
      machote.cfdi__comprobante.metodo_pago = "PUE";
      machote.cfdi__comprobante.forma_pago = "01";
      machote.cfdi__comprobante.lugar_expedicion = codpostalempresa;      
      machote.cfdi__comprobante.fecha = fechacierre;

      machote.cfdi__comprobante.cfdi__receptor.rfc = rfccliente;
      machote.cfdi__comprobante.cfdi__receptor.nombre = nombrefac;
      machote.cfdi__comprobante.cfdi__receptor.domicilio_fiscal = codpostreceptor;
      machote.cfdi__comprobante.cfdi__receptor.email = this.factura.email;
      machote.cfdi__comprobante.cfdi__receptor.regimen_fiscal = regimen;
      machote.cfdi__comprobante.cfdi__receptor.uso_cfdi = usocfdi;
      let conceptoInicial = JSON.parse(JSON.stringify(machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto[0]));
      machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto = [];
      let importetotal = 0;
      const piva = 16;
      let concepto = JSON.parse(JSON.stringify(conceptoInicial));
      const total =  Math.round( (miren.bonificacion * 1000)) /1000;
      const importe = Math.round ( ( total / ( 1 + piva / 100)) * 1000) /1000;
      const iva  = total - importe;
      concepto.cantidad = "1"
      concepto.clave_unidad = "E48";
      concepto.clave_producto_servicio = '84121902'
      concepto.descripcion = 'BONIFICACION ' +  miren.concepto;
      concepto.valor_unitario = importe.toFixed(4).toString();
      concepto.importe = importe.toFixed(3);
      concepto.cfdi__impuestos.total_impuestos_trasladados = iva.toFixed(3);
      let imptos = {
          base: importe.toFixed(3),
           impuesto: "002",
          tipo_factor: "Tasa",
          tasa_cuota: (piva / 100).toFixed(6),
          importe: iva.toFixed(3)
      }
      concepto.cfdi__impuestos.cfdi__traslados.cfdi__traslado[0] = (imptos)
      machote.cfdi__comprobante.cfdi__conceptos.cfdi__concepto.push(concepto);
      //console.log("Concepto", miren.conse, concepto)
      fac_importe += importe;
      fac_iva += iva;
      machote.cfdi__comprobante.subtotal = fac_importe.toFixed(2);
      machote.cfdi__comprobante.total = (fac_importe + fac_iva).toFixed(2);
      machote.cfdi__comprobante.cfdi__impuestos.total_impuestos_trasladados = (fac_iva).toFixed(2);
      machote.cfdi__comprobante.cfdi__impuestos.cfdi__traslados.cfdi__traslado[0].base = (fac_importe).toFixed(2);
      machote.cfdi__comprobante.cfdi__impuestos.cfdi__traslados.cfdi__traslado[0].importe = (fac_iva).toFixed(2);
      return (machote);
    }

    async busca_cliente(idcli: number): Promise<Clientes> {
      return await lastValueFrom (this.clientesService.obten_cliente(idcli));
    }

    pedir_impresion_poliza() {
      if(this.polizacaja.status == 'A') {
        this.alerta("Al Imprimir la póliza se va a cerrar");
        this.cerrar_poliza(this.polizacaja.id);
      } else {
        this.impresion_poliza('POLIZA');
      }

    }

    pedir_impresion_despacho() {
      if(this.polizacaja.status == 'A') {
        this.alerta("Esta póliza no está cerrada");
        return;
      } 
      this.impresion_poliza('DESPACHO');

    }

    imprimir_complemento_poliza() {
      this.polizasService.impresion_complemento_poliza(this.uuidcobranza);
    }    

    imprimir_pdf_recargo() {
      const pararms = {
        uuid: this.uuidrecargo,
        rotar: 'N'
      }
      this.facturasService.obten_pdf_cfdi_factura(JSON.stringify(pararms));
    }    

    async impresion_poliza(tipo: string) {
      this.imprimiendopoliza = true;
      const fechapol = this.polizacaja.fecha.split('T')[0];

      const params = {
        fechaini: fechapol,
        fechafin: fechapol,
        codigoini: this.polizacaja.tda,
        codigofin: this.polizacaja.tda,
      }
      const resumen = await lastValueFrom( this.polizasService.resumenPoliza(JSON.stringify(params)));
      let nvoresumen = [];
      for(let miren of resumen) {
        let descri = ""
        if(tipo == "POLIZA") {
          descri = miren.descriplazo + ' ' + miren.descri;
        }
        if(tipo == "DESPACHO") {
          descri = '16% ' +  miren.nombrecartera + " " +  miren.descriplazo + ' ' + miren.descri;
        }
        const nvoren = {
          tasaiva: 16,
          codcartera: miren.codcartera,
          tipoplazo: miren.tiplazo,
          anucartera: miren.anucartera,
          descripcion: descri,
          plazo: descri,
          importe: miren.total_importe,
          bonifica: miren.bonif,
          recargos: miren.recar,
          valormcias: miren.valmcia,
          financiamiento : miren.total_importe - miren.valmcia
        }
        nvoresumen.push(nvoren);
      }
      let renpol = [];
      for(let miren of this.renglones) {
        const vence = miren.vence.split('T')[0];
        const ren = {
          numcli: miren.codigo,
          nombre: miren.nombre,
          concep: miren.concepto,
          tipo: miren.tipo,
          fecven: vence,
          dias: miren.dias,
          salcli: miren.salcli,
          comis: miren.comision,
          feccap: miren.created_at,
          recargo: miren.recargos,
          bonificacion: miren.bonificacion,
          importe: miren.importe
        }
        renpol.push(ren);
      }

      let polizajson = {
        fecha: this.polizacaja.fecha,
        tda: this.polizacaja.tda,
        nombretda: this.polizacaja.nombretda,
        renglones: renpol,
        analisisplazo: nvoresumen,
        tablaiva: nvoresumen,
      }
      let reporte: any;
      if(tipo == "POLIZA") {
        reporte = await lastValueFrom( this.polizasService.impresionPoliza(JSON.stringify( polizajson)));
      }
      if(tipo == "DESPACHO") {
        reporte = await lastValueFrom( this.polizasService.impresionDespacho(JSON.stringify( polizajson)));
      }
      this.imprimiendopoliza = false;
      if(reporte.resultado == "OK") {
        this.polizasService.descargaArchivo(reporte.reporte);
      } else {
        this.alerta("Hubo un error al generar el reporte ");
      }

    }


  }
