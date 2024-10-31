import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { VentasCompletas, Ubivtas, Clientes, Vendedores, 
        Token, Tarjetatc, Articulo, Factorvtacred,
        Nulets, Promotores, Tabladesctocont, Serie,
        Ventas, Movclis} 
        from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  config: any;
  cia = 1;
  url = "";
  oldurl = "";
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

  buscarMovimientosVentas(id:number): Observable<Movclis[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/movclis/${this.cia}/-1/${id} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarMovimientosVentas", miurl);
    return( this.http.get<Movclis[]> (miurl,  {'headers':headers}) );

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

    if(this.debug) console.log("Debug: Estoy en obtenfactorvtacrd");
    let misparamnvo = {
      modo: "obtener_tabladescocont."
    }

    if (this.debug) console.log("Debug: Estoy en busca Tarjetas TC Disponibles", misparamnvo);
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



  delete(venta: VentasCompletas): Observable<VentasCompletas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/ventas/${venta.id}`;
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

    if(this.debug) console.log("Debug: Estoy en busca_codig-inven");

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


}