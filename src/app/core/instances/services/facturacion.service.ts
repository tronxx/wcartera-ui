import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Factura, Token, } 
        from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  config: any;
  cia = 1;
  url = "";
  oldurl = "";
  registro_z: Token = null;
  debug = true;
  contador_z = 0;

  constructor(
    private configService: ConfigService,
    private http: HttpClient

  ) {

    this.loadconfig();

   }

   async loadconfig()  {
    this.url  = this.configService.config.url;
    this.cia = this.configService.config.cia;
    this.oldurl = this.configService.config.oldurl;
  
    //this.config =  await this.configService.getConfig();
    //this.url = this.configService.config.url;
    //console.log("llamando a config", this.config, this.url, this.cia);
    const tok = localStorage.getItem("token") || '{}';
    //console.log("Token", tok);
    this.registro_z = JSON.parse(tok) ;
    this.cia = this.registro_z.usuario.cia;
    this.debug = this.configService.debug;

  }

  buscarUltimoFolio(serie: string): Observable<any>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/facturas/${this.cia}/-1/${serie}/ULTIMO_FOLIO`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar Ultimo Folio", serie,miurl);
    return( this.http.get<any> (miurl,  {'headers':headers}) );
  }

  grabar_factura(factura: string) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/facturas`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    //const nvaventa = JSON.parse(factura);

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en grabar_factura", factura, "url:",miurl);
    return( this.http.post<any> (miurl, factura, {'headers':headers}) );

  }

  grabar_uuid_en_factura(idfactura: number, uuid: string) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/facturas/grabaruuid/${idfactura}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    //const nvaventa = JSON.parse(factura);
    const params = JSON.stringify({uuid: uuid})
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en grabar_uuid_en_factura", params, "url:",miurl);
    return( this.http.put<any> (miurl, params, {'headers':headers}) );

  }

  cerrar_factura(idfactura: number) {
    const url = this.configService.config.url;
    const miurl = `${url}/facturas/${idfactura}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    //const nvaventa = JSON.parse(factura);
    const params = {status: 'C'};
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en cerrar_factura", params, "url:",miurl);
    return( this.http.put<any> (miurl, params, {'headers':headers}) );

  }

  obten_pdf_cfdi_factura(params:string) {
    let misparams = JSON.parse(params);
    const url = this.configService.config.oldurl;
    // console.log("Debug: Estoy en obtenpdfcfdi ", params);
    let miurl = `${url}/altas/serviciosaltas.php?modo=descarga_pdf_cfdi_factura&uuid=${misparams.uuid}&rotarfac=${misparams.rotar}`;
    window.open(miurl, "_blank");
  }


  obtenerFacturaPorSerieyNumero(serie: string, numero: number) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/facturas/${this.cia}/${numero}/${serie}/BUSQUEDA_SERIE_NUMERO`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en obtenerFacturaPorSerieyNumero ", "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );


  }

  obtenerFacturaPorId(id: number) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/facturas/${this.cia}/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en obtenerFacturaPorId ", "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );
  }

  obtenerRenfac(id: number) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/renfac/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en obtenerRenfac ", "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );
  }

  obtenerCompra(id: number) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/renfac/compra/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en obtenerRenfac ", "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );
  }

  crearJsonTimbreVenta() {

    let conceptos = {
      cfdi__concepto: [
        {
          clave_producto_servicio: "",
          clave_unidad:"H87",
          cantidad: "1",
          descripcion: "",
          unidad:"PIEZA",
          objeto_imp: "02",
          valor_unitario: "0",
          importe: "0",
          no_identificacion:"",
          cfdi__impuestos:{
            total_impuestos_trasladados: "0",
            cfdi__traslados:{
              cfdi__traslado:[{
                base: "0",
                impuesto:"002",
                tipo_factor:"Tasa",
                tasa_cuota:"0.160000",
                importe:"0",
              }]
            }
          }

        }
      ]      
    
    };


    let timbre = {
      cfdi__comprobante: {
        serie: "",
        folio: "0",
        fecha: "",
        tipo_comprobante:"",
        lugar_expedicion: "",
        version: "4.0",
        exportacion: "01",
        moneda:"MXN",
        tipo_cambio:"1",
        metodo_pago: "PPD",
        forma_pago: "99",
        cfdi__emisor:{
          rfc: "",
          nombre: "",
          regimen_fiscal:"12"
        },
        cfdi__receptor:{
          rfc: "",
          nombre: "",
          email:"",
          domicilio_fiscal: "",
          regimen_fiscal:"12",
          uso_cfdi: "S01"
        },
        subtotal: "0",
        total: "0",
        cfdi__impuestos:{
          total_impuestos_trasladados:"0",
          cfdi__traslados:{
            cfdi__traslado:[
            {
              base:"0",
              impuesto:"002",
              tipo_factor:"Tasa",
              tasa_cuota:"0.160000",
              importe:"0",
            }
          ]}
        },
        cfdi__conceptos: conceptos,
      }
    };

    return (timbre);
      
  }

  crearJsonTimbrePagos() {

    let conceptos = {
      cfdi__concepto: [
        {
          clave_producto_servicio: "84111506",
          clave_unidad:"ACT",
          cantidad: "1",
          descripcion: "Pago",
          unidad:"PIEZA",
          valor_unitario: "0",
          importe: "0",
        }
      ]      
    
    };

    let pago_docto_relacionado = {
      pago20__docto_relacionado:[{
        id_documento:"5181DA40-22CD-4B8D-9AA1-CEA9B09F8AD0",
        serie:"",
        folio:"3",
        moneda_dr:"MXN",
        equivalencia_dr: "1",
        numero_parcialidad: "1",
        importe_pagado:"5800.00",
        importe_saldo_anterior:"5800",
        importe_saldo_insoluto:"0",
        objeto_imp_dr:"02",
        pago20__impuestosdr: {
          pago20__trasladosdr: {
            pago20__trasladodr: [{
              base: "5000",
              impuesto: "002",
              tipo_factor: "Tasa",
              tasa_cuota: "0.160000","importe": "800"
            }
          ]
          }
          }
        }
        ],
    };

    let complemento = {
      cfdi__complemento: {
        pago20__pagos: {
          pago20__totales: [{
            traslados_base_iva16: "0",
            traslados_impuestos_iva16: "0",
            monto_total_pagos: "0"
          }]
        },
        pago20__pago: [{
          fecha_pago: "",
          forma_pago: "01",
          tipo_cambio: "",
          moneda: "MXN",
          monto: "0",
          rfc_emisor_ordenante: "",
          rfc_emisor_beneficiario: "",
          nombre_banco_ordenante: "",
          cuenta_ordenante:"",        
          cuenta_beneficiario:"",
          tipo_cadena_pago:"",
          num_operacion:"1123121241",
          certificado_pago:"",
          cadena_pago:"",
          sello_pago:"",
          pago_docto_relacionado,
        }]
      }
    }


    let timbre = {
      cfdi__comprobante: {
        serie: "",
        folio: "0",
        fecha: "",
        tipo_comprobante:"",
        lugar_expedicion: "",
        version: "4.0",
        exportacion: "01",
        moneda:"MXN",
        tipo_cambio:"1",
        metodo_pago: "PPD",
        forma_pago: "99",
        cfdi__emisor:{
          rfc: "",
          nombre: "",
          regimen_fiscal:"12"
        },
        cfdi__receptor:{
          rfc: "",
          nombre: "",
          email:"",
          domicilio_fiscal: "",
          regimen_fiscal:"12",
          uso_cfdi: "S01"
        },
        subtotal: "0",
        total: "0",
        cfdi__impuestos:{
          total_impuestos_trasladados:"0",
          cfdi__traslados:{
            cfdi__traslado:[
            {
              base:"0",
              impuesto:"002",
              tipo_factor:"Tasa",
              tasa_cuota:"0.160000",
              importe:"0",
            }
          ]}
        },
        cfdi__conceptos: conceptos,
        complemento,
      }
    };

    return (timbre);
      
  }

 generarTimbrefactura(documento: string): Observable<any> {
    const fechayhora = new Date().toISOString();
    const mifactura = JSON.parse(documento);
    const timbre = {
      meta: {
        objeto: "recepcion", 
        empresa_api_key: "4QXeBAuxVXNanwI1Ewpwjw", 
        empresa_uid: "bca5eefb45", 
        ambiente: "S"
    }, 
    data: [
        {
            datos_fiscales: {
                llave_pem: fechayhora, 
                llave_password: "", 
                certificado_pem: ""
            },
            cfdi: mifactura
        }]
    }
    //return this.manda_timbrar(timbre);
    let respu_z = "";
    let miurl = this.configService.config.urlfacturacion + "/generafactura.php"
    const headers = { 'content-type': 'text/plain'};
    const misparamnvo = JSON.stringify (timbre);
    console.log("Timbrando", misparamnvo, miurl);
    return this.http.post<any>(miurl, misparamnvo, {'headers':headers});

  }

  manda_timbrar(timbre: any): Observable<any>{
    let respu_z = "";
    let miurl = this.configService.config.urlfacturacion; + "/generafactura.php"
    const headers = { 'content-type': 'text/plain'};
    const misparamnvo = JSON.parse(timbre);
    return this.http.post<any>(miurl, JSON.stringify( misparamnvo), {'headers':headers});
  }
  

}
