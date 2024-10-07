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
    const nvaventa = JSON.parse(factura);

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en Agregar Venta", factura, "url:",miurl);
    return( this.http.post<any> (miurl, nvaventa, {'headers':headers}) );

  }

}
