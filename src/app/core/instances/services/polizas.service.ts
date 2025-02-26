import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { VentasCompletas, Polizas, PolizasCompletas, Renpolcompleto, Clientes,
        Codigocaja, Ventas, Movclis, Token} 
        from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class PolizasService {
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

  buscar_x_Rango_Fechas(fechainicial: string, fechafinal: string, idtienda:number): Observable<PolizasCompletas[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/polizas/${this.cia}/-1/${fechainicial}/${fechafinal}/${idtienda} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar_x_Rango_Fechas", fechainicial, fechafinal, idtienda, "url:",miurl);
    return( this.http.get<PolizasCompletas[]> (miurl,  {'headers':headers}) );

  }

  buscar_x_Id(id:number): Observable<PolizasCompletas>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/polizas/${this.cia}/${id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar_x_Id url:",miurl);
    return( this.http.get<PolizasCompletas> (miurl,  {'headers':headers}) );

  }


  crear_poliza(fecha: string, codigo: string, idtienda: number) {
    const polizadto = {
      tda: codigo,
      fecha: fecha,
      bonif: 0,
      recar: 0,
      importe: 0,
      idtienda: idtienda,
      idfactura: -1,
      status: 'A',
      cia: this.cia
    }
    this.url = this.configService.config.url;
    const miurl = `${this.url}/polizas`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    const nvaventa = JSON.stringify(polizadto);

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en Agregar Poliza", polizadto, "url:",miurl);
    return( this.http.post<any> (miurl, nvaventa, {'headers':headers}) );

  }


  buscar_Codigos_Caja(): Observable<Codigocaja[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/codigoscaja/${this.cia} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar_Codigos_Caja", miurl);
    return( this.http.get<Codigocaja[]> (miurl,  {'headers':headers}) );

  }

  buscar_Codigos_Caja_Usuario(idusuario: number): Observable<Codigocaja[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/codigoscaja/codigosusuario/${this.cia}/${idusuario} `;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar_Codigos_Caja_Usuario", miurl);
    return( this.http.get<Codigocaja[]> (miurl,  {'headers':headers}) );

  }


  buscar_Renglones_Poliza(idpoliza: number): Observable<Renpolcompleto[]>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/renpol/${this.cia}/${idpoliza}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscar_Renglones_Poliza", miurl);
    return( this.http.get<Renpolcompleto[]> (miurl,  {'headers':headers}) );

  }

  agrega_Renglon_Poliza(nuevorenglon: any): Observable<any>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/renpol`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;
    const nvaventa = JSON.stringify(nuevorenglon);

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en Agregar Renglón de Poliza", nuevorenglon, "url:",miurl);
    return( this.http.post<any> (miurl, nvaventa, {'headers':headers}) );

  }


}
