import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Token, Ciudades, Regimenes, Usocfdi, Metodopago } from '@models/index'


@Injectable({
  providedIn: 'root'
})
export class ComplementosService {

  config: any;
  cia = 1;
  url = "";
  registro_z: Token = null;
  debug = false;

  constructor(
    private configService: ConfigService,
    private http: HttpClient

  ) {

    this.loadconfig();

   }

   async loadconfig()  {
    this.url  = this.configService.config.url;
    this.cia = this.configService.config.cia;
    this.debug = this.configService.debug;
  
    //this.config =  await this.configService.getConfig();
    //this.url = this.configService.config.url;
    //console.log("llamando a config", this.config, this.url, this.cia);
    const tok = localStorage.getItem("token") || '{}';
    //console.log("Token", tok);
    this.registro_z = JSON.parse(tok) ;
    this.cia = this.registro_z.usuario.cia;
    return(0)

  }

  obten_lista_ciudades() : Observable<Ciudades[]> {
    const url = this.configService.config.url;
  
    const miurl = `${url}/ciudades/${this.cia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("ciudades service url", miurl);
    
    return( this.http.get<Ciudades[]> (miurl, {'headers':headers}) );

  }

  obten_ciudad_x_id(idciudad:number) : Observable<Ciudades> {
    const url = this.configService.config.url;
  
    const miurl = `${url}/ciudades/${this.cia}/${idciudad}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("ciudades service url", miurl);
    
    return( this.http.get<Ciudades> (miurl, {'headers':headers}) );

  }

  obten_lista_regimenes() : Observable<Regimenes[]> {
    const url = this.configService.config.url;
  
    const miurl = `${url}/regimenes/${this.cia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("regimenes service url", miurl);
    
    return( this.http.get<Regimenes[]> (miurl, {'headers':headers}) );

  }

  obten_regimen_x_id(id: number) : Observable<Regimenes> {
    const url = this.configService.config.url;
  
    const miurl = `${url}/regimenes/${this.cia}/${id} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("regimenes service url", miurl);
    
    return( this.http.get<Regimenes> (miurl, {'headers':headers}) );

  }


  obten_lista_usocfdi() : Observable<Usocfdi[]> {
    const url = this.configService.config.url;
  
    const miurl = `${url}/usocfdi/${this.cia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("usocfdi url", miurl, "token");
    
    return( this.http.get<Usocfdi[]> (miurl, {'headers':headers}) );

  }

  obten_usocfdi_x_id(id: number) : Observable<Usocfdi> {
    const url = this.configService.config.url;
  
    const miurl = `${url}/usocfdi/${this.cia}/${id} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("usocfdi url", miurl);
    
    return( this.http.get<Usocfdi> (miurl, {'headers':headers}) );

  }


  obten_lista_metodopago() : Observable<Metodopago[]> {
    const url = this.configService.config.url;
    const miurl = `${url}/metodopago/${this.cia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("metodopago url", miurl);
    
    return( this.http.get<Metodopago[]> (miurl, {'headers':headers}) );

  }

  obten_metodopago_x_id(id:number) : Observable<Metodopago> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/metodopago/${this.cia}/${id} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("metodopago url", miurl);
    
    return( this.http.get<Metodopago> (miurl, {'headers':headers}) );

  }


}
