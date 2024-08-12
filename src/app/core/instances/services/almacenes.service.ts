import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Token, Almacenes } from '@models/index'

@Injectable({
  providedIn: 'root'
})
export class AlmacenesService {
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
    console.log("llamando a config", this.config, this.url, this.cia);
    const tok = localStorage.getItem("token") || '{}';
    console.log("Token", tok);
    this.registro_z = JSON.parse(tok) ;

  }

  obten_lista_almacenes(micia: number) : Observable<Almacenes[]> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/almacenes/${micia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("almacenes service url", miurl);
    
    return( this.http.get<Almacenes[]> (miurl, {'headers':headers}) );

  }

  obten_almacen(idalm: number) : Observable<Almacenes> {
    this.url = this.configService.config.url;
    const micia = this.cia;
  
    const miurl = `${this.url}/almacenes/${micia}/${idalm}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("almacenes service url", miurl);
    
    return( this.http.get<Almacenes> (miurl, {'headers':headers}) );

  }

  mockRequest(){
    lastValueFrom(this.http.get("https://www.google.com"))
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err))
  }

  create_almacenes(almacen: Almacenes): Observable<Almacenes>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/almacenes/`;
    //let miurl = this.config.url + "/almacenes";

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("Estoy en Post create_almacen", almacen, "url:",miurl);
    return( this.http.post<Almacenes> (miurl, almacen, {'headers':headers}) );

  }

  edit_almacenes(almacen: Almacenes): Observable<Almacenes>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/almacenes/${almacen.id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    //console.log("Estoy en Post create_almacen", almacen, "url:",miurl);
    return( this.http.put<Almacenes> (miurl, almacen, {'headers':headers}) );

  }

  delete_almacenes(almacen: Almacenes): Observable<Almacenes>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/almacenes/${almacen.id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("Estoy en delete almacen", almacen, "url:",miurl);
    return( this.http.delete<any> (miurl) );

  }

}