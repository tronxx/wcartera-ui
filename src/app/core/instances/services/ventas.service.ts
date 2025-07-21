import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable, of } from 'rxjs';
import { VentasCompletas, Ubivtas, Clientes, Vendedores, 
        Token, Tarjetatc, Articulo, Factorvtacred, Codigoscartera,
        Nulets, Promotores, Tabladesctocont, Serie, AvalCompleto,
        Ventas, Movclis, TIPOS_SOLICIT, CLAVES_SOLICIT } 
        from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  config: any;
  cia = 1;
  url = "";
  oldurl = "";
  urlphp = "";
  registro_z: Token = null;
  debug = true;

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
    this.urlphp = this.configService.config.urlphp;
  
    //this.config =  await this.configService.getConfig();
    //this.url = this.configService.config.url;
    //console.log("llamando a config", this.config, this.url, this.cia);
    const tok = localStorage.getItem("token") || '{}';
    //console.log("Token", tok);
    this.registro_z = JSON.parse(tok) ;
    this.cia = this.registro_z.usuario.cia;
    this.debug = this.configService.debug;

  }


  buscar(fechainicial: string, fechafinal: string, ubica:string): Observable<VentasCompletas[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/${this.cia}?fechainicial=${fechainicial}&fechafinal=${fechafinal}&ubica=${ubica} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar", fechainicial, fechafinal, ubica, "url:",miurl);
    return( this.http.get<VentasCompletas[]> (miurl,  {'headers':headers}) );

  }

  buscarVentaPorId(id:number): Observable<VentasCompletas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/${this.cia}/${id} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarVentaPorId", miurl);
    return( this.http.get<VentasCompletas> (miurl,  {'headers':headers}) );

  }

  buscarVentaPorNombre(nombre:string): Observable<VentasCompletas[]>{
    this.url = this.configService.config.url;
    const minombre = encodeURIComponent(nombre);
    const miurl = `${this.url}/ventas/busqueda/nombre/${this.cia}/${minombre}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarVentaPorNombre", miurl);
    return( this.http.get<VentasCompletas[]> (miurl,  {'headers':headers}) );

  }

  buscarVentaPoridCliente(idcliente: number): Observable<VentasCompletas[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/busqueda/idcliente/${this.cia}/${idcliente}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("buscarVentaPoridCliente", miurl);
    return( this.http.get<VentasCompletas[]> (miurl,  {'headers':headers}) );

  }


  buscarVentaPorCodigo(codigo:string): Observable<VentasCompletas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/${this.cia}/-1/${codigo}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarVentaPorCodigo", miurl);
    return( this.http.get<VentasCompletas> (miurl,  {'headers':headers}) );

  }

  buscarCodigoCartera(codigo:string): Observable<Codigoscartera>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/codigoscartera/codigo/${this.cia}/${codigo}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarCodigoCartera", miurl);
    return( this.http.get<Codigoscartera> (miurl,  {'headers':headers}) );

  }

  desplazarVentaPorCodigo(codigo:string, haciadonde: string): Observable<VentasCompletas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/busqueda/sigteanterior/${this.cia}/${codigo}/${haciadonde}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarVentaPorCodigo", miurl);
    return( this.http.get<VentasCompletas> (miurl,  {'headers':headers}) );

  }

  buscarAvalporIdventa(idventa:number): Observable<AvalCompleto>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/avales/${this.cia}/-1/${idventa}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarAvalporIdventa", miurl);
    return( this.http.get<AvalCompleto> (miurl,  {'headers':headers}) );
  }

  buscarMovimientosVentas(id:number): Observable<Movclis[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/movclis/${this.cia}/-1/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarMovimientosVentas", miurl);
    return( this.http.get<Movclis[]> (miurl,  {'headers':headers}) );

  }

  modificarMovimientosVentas(id:number, dtomov: any): Observable<any>{
    const url = this.configService.config.urlphp;
    const miurl = `${url}/movclis/movclis.php`;
    const dataxgrabar = {
      modo: "modificar",
      movcli : {
        id: id,
        concepto: dtomov.concepto,
        cobratario: dtomov.cobratario,
        tipopago: dtomov.tipopago,
        recobon: dtomov.recobon,
        importe: dtomov.importe,
        fecha: dtomov.fecha,
        idventa: dtomov.idventa,
        iduser: dtomov.iduser,
      }
    }
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    //const headers = { 
      //'content-type': 'application/json',
      // 'Authorization': `Bearer ${this.registro_z.token}`      
    //};    
    const headers = { 
      'content-type': 'text/plain',
      //'Authorization': `Bearer ${this.registro_z.token}`
    }

    if(this.debug) console.log("Estoy en modificarMovimientosVentas", miurl);
    return( this.http.post<any> (miurl, JSON.stringify(dataxgrabar), {'headers':headers}) );

  }

  agregarMovimientosVentas(id:number, dtomov: any): Observable<any>{
    const url = this.configService.config.urlphp;
    const miurl = `${url}/movclis/movclis.php`;
    const dataxgrabar = {
      modo: "agregar",
      movcli : {
        id: id,
        concepto: dtomov.concepto,
        cobratario: dtomov.cobratario,
        tipopago: dtomov.tipopago,
        recobon: dtomov.recobon,
        importe: dtomov.importe,
        fecha: dtomov.fecha,
        idventa: dtomov.idventa,
        iduser: dtomov.iduser,
      }
    }
    //const headers = { 
      //'content-type': 'application/json',
      // 'Authorization': `Bearer ${this.registro_z.token}`      
    //};    
    const headers = { 
      'content-type': 'text/plain',
      //'Authorization': `Bearer ${this.registro_z.token}`
    }

    if(this.debug) console.log("Estoy en agregarMovimientosVentas", miurl);
    return( this.http.post<any> (miurl, JSON.stringify(dataxgrabar), {'headers':headers}) );

  }

  eliminarMovimientosVentas(id:number): Observable<any>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/movclis/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en eliminarMovimientosVentas", miurl);
    return( this.http.delete (miurl,  {'headers':headers}) );

  }

  async obtenerRecargosLetra(idventa:number, letra:number): Promise<any>{
    try {
      const recargos = await firstValueFrom(this.buscarRecargosLetra(idventa, letra));
      return recargos;
    } catch (error) {
      console.error("Error al obtener Recargos:", error);
      throw error;
    }
  }
  
  buscarRecargosLetra(idventa:number, letra:number): Observable<any>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/movclis/recargos/${this.cia}/${idventa}/${letra}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("buscarRecargosLetra", miurl);
    return( this.http.get<any> (miurl,  {'headers':headers}) );

  }

  obtener_dias_gracia(idventa: number) : Observable<any> {
    const tipodiasgracia = CLAVES_SOLICIT.DIAS_GRACIA_CLIENTE;
    const tipo = TIPOS_SOLICIT.VENTA;
    return this.obtener_dato_solicit_venta(idventa, tipo, tipodiasgracia);
  }
  
  obtener_clave_tc_venta(idventa: number) : Observable<any> {
    const tipotarjetatc = CLAVES_SOLICIT.CLAVE_TARJETATC;
    const tipo = TIPOS_SOLICIT.VENTA;
    return this.obtener_dato_solicit_venta(idventa, tipo, tipotarjetatc);
  }
  

  obtener_dato_solicit_venta(idventa: number, tipovta: number, tipodatosol: number ) : Observable<any> {
    const url = this.configService.config.url;
    const micia = this.cia;
    const idcli = idventa;
  
    const miurl = `${url}/solicitudes/datoespecifico/${micia}/${idventa}/${tipodatosol}/${tipovta}`;
    if(this.debug) console.log("Estoy en obtener_dato_solicit_venta", idventa, tipovta, tipodatosol, miurl);
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    //console.log("Estoy en get obtener solicitud", idcliente, "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );

  }

  cerrarVenta(idventa: number, fecha: string) : Observable<any> {
    this.url = this.configService.config.url;
    const datosventa = {
      status: 'C'
    }
  
    const miurl = `${this.url}/ventas/${idventa}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    //console.log("Estoy en get obtener solicitud", idcliente, "url:",miurl);
    //const ventacerrada = this.http.put<any> (miurl, JSON.stringify(datosventa), {'headers':headers});
    const fechacierre =  this.grabar_dato_solicit(idventa, CLAVES_SOLICIT.FECHA_CIERRE_VENTA, fecha );
    return (this.http.put<any> (miurl, JSON.stringify(datosventa), {'headers':headers}));
      
  }


  obtener_fecha_cierre(idventa: number) : Observable<any> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const idcli = idventa;
    const tipodato = CLAVES_SOLICIT.FECHA_CIERRE_VENTA
    const tipo = TIPOS_SOLICIT.VENTA;
  
    const miurl = `${this.url}/solicitudes/datoespecifico/${micia}/${idventa}/${tipodato}/${tipo} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    console.log("Estoy en get obtener solicitud", idventa, "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );

  }


  grabar_dato_solicit(idventa: number, tipodato: number, datoagrabrar: string) : Observable<any> {
    this.url = this.configService.config.url;
    const dataxgrabar = {
      micia : this.cia,
      idcli: idventa,
      datosol : tipodato,
      tipo:  TIPOS_SOLICIT.VENTA,
      concepto: datoagrabrar

    }
    const tipo = TIPOS_SOLICIT.VENTA;
    const miurl = `${this.url}/solicitudes/agregardato`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    //console.log("Estoy en get obtener solicitud", idcliente, "url:",miurl);
    return( this.http.post<any> (miurl, JSON.stringify(dataxgrabar), {'headers':headers}) );

  }

  buscarUbicaciones(): Observable<Ubivtas[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ubivtas/${this.cia}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar ubicaciones", "url:",miurl);
    return( this.http.get<Ubivtas[]> (miurl,  {'headers':headers}) );

  }

  buscarTc(ubica: string, ticte: string): Observable<Tarjetatc[]>{
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};
    let misparamnvo = {
      modo: "buscar_tarjetas_tc",
      ticte: ticte,
      ubiage: ubica,
      idcli: -1
    }
    if (this.debug) console.log("Debug: Estoy en busca Tarjetas TC Disponibles", misparamnvo);
    return this.http.post<Tarjetatc[]>(miurl, JSON.stringify(misparamnvo), {'headers':headers});

  }


  obtentabladesctocont ( ): Observable<Tabladesctocont[]> {
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};

    if(this.debug) console.log("Debug: Estoy en obtentabladesctocont");
    let misparamnvo = {
      modo: "obtener_tabladescocont."
    }

    if (this.debug) console.log("Debug: Estoy en busca obtentabladesctocont", misparamnvo);
    return this.http.post<Tabladesctocont[]>(miurl, JSON.stringify( misparamnvo), {'headers':headers});

  }

  obtennulets ( parametros: string): Observable<Nulets[]> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};
    const body=parametros;
    
    return this.http.post<Nulets[]>(miurl, parametros, {'headers':headers});
    
  }

  buscarVendedores(): Observable<Vendedores[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/vendedores/${this.cia}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar vendedores", "url:",miurl);
    return( this.http.get<Vendedores[]> (miurl,  {'headers':headers}) );

  }

  buscarVendedorPorId(id:number): Observable<Vendedores>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/vendedores/${this.cia}/${id} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar vendedorPorId", "url:",miurl);
    return( this.http.get<Vendedores> (miurl,  {'headers':headers}) );

  }

  buscarPromotores(): Observable<Promotores[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/promotores/${this.cia}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar buscarPromotores", "url:",miurl);
    return( this.http.get<Promotores[]> (miurl,  {'headers':headers}) );

  }

  buscarPromotorPorId(id: number): Observable<Promotores>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/promotores/${this.cia}/${id} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarPromotorPorId", "url:",miurl);
    return( this.http.get<Promotores> (miurl,  {'headers':headers}) );

  }

  buscarUbicacionxId(id: number): Observable<Ubivtas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ubivtas/${this.cia}/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar ubicacionxId", "url:",miurl);
    return( this.http.get<Ubivtas> (miurl,  {'headers':headers}) );

  }

  buscarLetrasImpresas(id: number): Observable<any>{
    this.url = this.configService.config.url;
    const tipo = TIPOS_SOLICIT.VENTA;
    const miurl = `${this.url}/solicitudes/letrasimpresas/${this.cia}/${id}/${tipo}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarLetrasImpresas", "url:",miurl);
    return( this.http.get<any> (miurl,  {'headers':headers}) );

  }

  grabarLetrasImpresas(id: number, ltaini: number, ltafin:number): Observable<any>{
    this.url = this.configService.config.url;
    const tipo = TIPOS_SOLICIT.VENTA;
 
    const miurl = `${this.url}/solicitudes/grabarletrasimpresas`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    const letrasimpresas = {
      idcliente: id,
      cia: this.cia,
      tipo: tipo,
      ltaini: ltaini,
      ltafin: ltafin
    }
    const strletrasimpresas = JSON.stringify(letrasimpresas);

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en grabarLetrasImpresas", strletrasimpresas, "url:",miurl);
    return( this.http.post<any> (miurl, strletrasimpresas, {'headers':headers}) );

  }

  delete(venta: VentasCompletas): Observable<VentasCompletas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/${venta.idventa}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) 
      console.log("Estoy en delete venta", venta, "url:",miurl);
    return( this.http.delete<any> (miurl,  {'headers':headers}) );

  }

  

  busca_codigo_inven( parametros: string): Observable<Articulo> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};

    const body=parametros;
    let misparams = JSON.parse(parametros);
    let misparamnvo = {
      modo: "buscar_inven_codigo",
      codigo: misparams.codigo
    }

    if(this.debug) console.log("Debug: Estoy en  busca_codigo_inven ", parametros);
  
    return this.http.post<Articulo>(miurl, JSON.stringify( misparamnvo), {'headers':headers});
  }

  busca_varios_codigos_inven( parametros: string): Observable<Articulo[]> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};

    if(this.debug) console.log("Debug: Estoy en busca_varios_codigo_inven");
    const body=parametros;
    let misparams = JSON.parse(parametros);
    let misparamnvo = {
      modo: "buscar_inven_rango_codigos",
      codigo: misparams.codigo
    }

    if(this.debug) console.log("Debug: Estoy en busca busca_varios_codigo_inven ", parametros);
    return this.http.post<Articulo[]>(miurl, JSON.stringify( misparamnvo), {'headers':headers});
  }
  
  buscar_ofertas_json(): Observable<any> {
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php?modo=buscar_ofertas_json";
    const body="";
    const headers = { 'content-type': 'text/plain'};
    return this.http.get<any>(miurl, {'headers':headers});
  }

  buscar_lista_asi(): Observable<any> {
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php?modo=buscar_lista_asi";
    const body="";
    const headers = { 'content-type': 'text/plain'};
    return this.http.get<any>(miurl, {'headers':headers});
  }

  obtenfactorvtacrd ( ): Observable<Factorvtacred[]> {
    const headers = { 'content-type': 'text/plain'};
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    let misparamnvo = {
      modo: "obtener_factorvtacrd."
    }

    return this.http.post<Factorvtacred[]>(miurl, JSON.stringify( misparamnvo), {'headers':headers});
  }

  busca_series_disponibles( parametros: string): Observable<Serie[]> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};
    const body=parametros;
    let misparams = JSON.parse(parametros);
    let misparamnvo = {
      modo: "buscar_inven_todas_series",
      codigo: misparams.codigo,
      almacen: misparams.almacen
    }

    if(this.debug) console.log("Debug: Estoy en busca_series_disponibles ", parametros);
  
    return this.http.post<Serie[]>(miurl, JSON.stringify( misparamnvo), {'headers':headers});
  }

  busca_serie_moto( parametros: string): Observable<Serie> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};
    const body=parametros;
    let misparams = JSON.parse(parametros);
    let misparamnvo = {
      modo: "buscar_inven_serie_moto",
      codigo: misparams.codigo,
      serie: misparams.serie,
      seriemotor: misparams.seriemotor
    }

    if(this.config) console.log("Debug: Estoy en busca_serie_moto ", parametros);
  
    return this.http.post<Serie>(miurl, JSON.stringify( misparamnvo), {'headers':headers});
  }

  grabar_venta(venta: string) {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/ventacompleta`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    const nvaventa = JSON.parse(venta);

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en Agregar Venta", venta, "url:",miurl);
    return( this.http.post<any> (miurl, nvaventa, {'headers':headers}) );

  }
 
  impresionLetras(datosletras: string) {
    let misdatos = JSON.parse(datosletras);
    let miurl = this.configService.config.oldurl + "altas/impriletras.php";
    const nombrecliente = encodeURIComponent(misdatos.nombrecliente);
    const nombreaval = encodeURIComponent(misdatos.nombreaval);
    const dircliente = encodeURIComponent(misdatos.dircliente);
    const diraval = encodeURIComponent(misdatos.diraval);
    const poblac = encodeURIComponent(misdatos.poblac);
    const pobaval = encodeURIComponent(misdatos.pobaval);

    miurl += "?modo=impresionLetras";
    miurl += `&codigo=${misdatos.codigo}`;
    miurl += `&idcli=${misdatos.idcli}`;
    miurl += `&letrainicial=${misdatos.letrainicial}`;
    miurl += `&letrafinal=${misdatos.letrafinal}`;
    miurl += `&fechavta=${misdatos.fechavta}`;
    miurl += `&diasprom=${misdatos.diasprom}`;
    miurl += `&nombrecliente=${nombrecliente}`;
    miurl += `&dircliente=${dircliente}`;
    miurl += `&diraval=${diraval}`;
    miurl += `&poblac=${poblac}`;
    miurl += `&nombreaval=${nombreaval}`;
    miurl += `&pobaval=${pobaval}`;
    miurl += `&impletra=${misdatos.impletra}`;
    miurl += `&totletras=${misdatos.totletras}`;
    if(this.debug) console.log("Estoy en Imprimir Letras",  "url:",miurl);
    window.open(miurl, "_blank");
  }
  

  imprimiEdoCta ( datoscli: string ): Observable<any> {
    const headers = { 'content-type': 'text/plain'};
    let miurl = this.configService.config.oldurl + "clientes/estadocuenta.php"

    return this.http.post<any>(miurl, datoscli, {'headers':headers});
  }

}