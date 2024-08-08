import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Token, Ciudades, Regimenes, } from '@models/index'


@Injectable({
  providedIn: 'root'
})
export class ComplementosService {

  config: any;
  cia = 1;
  url = "";
  registro_z: Token = null;

  constructor(
    private configService: ConfigService,
    private http: HttpClient

  ) {

    this.loadconfig();

   }

   async loadconfig()  {
    this.url  = this.configService.config.url;
    this.cia = this.configService.config.cia;
  
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
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/ciudades/${this.cia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    // console.log("ciudades service url", miurl);
    
    return( this.http.get<Ciudades[]> (miurl, {'headers':headers}) );

  }

  obten_lista_regimenes() : Observable<Regimenes[]> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/regimenes/${this.cia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("regimenes service url", miurl);
    
    return( this.http.get<Regimenes[]> (miurl, {'headers':headers}) );

  }


}
