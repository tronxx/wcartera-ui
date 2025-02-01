import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Nombres, Clientes, Token } from '@models/index'

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
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

  }

  obten_cliente(idcliente: number) : Observable<Clientes> {
    this.url = this.configService.config.url;
    const micia = this.cia;
  
    const miurl = `${this.url}/clientes/${micia}/${idcliente}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("clientes service url", miurl);
    
    return( this.http.get<Clientes> (miurl, {'headers':headers}) );

  }

  obten_lista_clientes() : Observable<Clientes[]> {
    this.url = this.configService.config.url;
    const micia = this.cia;
  
    const miurl = `${this.url}/clientes/${micia}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("clientes service url", miurl);
    
    return( this.http.get<Clientes[]> (miurl, {'headers':headers}) );

  }

  busca_clientes_nombre(nombre: string) : Observable<Clientes[]> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    nombre = encodeURIComponent(nombre);
    //nombre = nombre.replace(/%/g, '%25');
  
    const protourl = `${this.url}/clientes/${micia}/-1/-1/${nombre}`;
    const miurl = protourl;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("clientes service url", miurl);
    
    return( this.http.get<Clientes[]> (miurl, {'headers':headers}) );

  }


  obten_idnombre(nombre: Nombres) : Observable<Nombres> {
    this.url = this.configService.config.url;
    const miurl = `${this.url}/clientes/nombre`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    console.log("Estoy en Post create_nombre", nombre, "url:",miurl);
    return( this.http.post<Nombres> (miurl, nombre, {'headers':headers}) );

  }

  obten_nombres(id: number) : Observable<Nombres> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const miurl = `${this.url}/clientes/${micia}/id/nombre/codigo/${id}`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    console.log("Estoy en get obten_nombres", id, "url:",miurl);
    return( this.http.get<Nombres> (miurl, {'headers':headers}) );

  }


  crear_cliente(cliente: any) : Observable<Clientes> {
    this.url = this.configService.config.url;
    const micia = this.cia;
  
    const miurl = `${this.url}/clientes/`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    console.log("Estoy en Post create cliente", cliente, "url:",miurl);
    return( this.http.post<Clientes> (miurl, cliente, {'headers':headers}) );

  }

  edit_cliente(cliente: any) : Observable<Clientes> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const idcli = cliente.id;
  
    const miurl = `${this.url}/clientes/${idcli} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    console.log("Estoy en Put update cliente", cliente, "url:",miurl);
    return( this.http.put<Clientes> (miurl, cliente, {'headers':headers}) );

  }

  delete_cliente(cliente: Clientes): Observable<Clientes>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/clientes/${cliente.id}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    console.log("Estoy en delete cliente", cliente, "url:",miurl);
    return( this.http.delete<any> (miurl,  {'headers':headers}) );

  }

  crear_solicitud(solicitud: any) : Observable<any> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const idcli = solicitud.idcliente;
  
    const miurl = `${this.url}/solicitudes`;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    console.log("Estoy en post crear solicitud", solicitud, "url:",miurl);
    return( this.http.post<any> (miurl, solicitud, {'headers':headers}) );

  }

  obtener_solicitud(idcliente: number) : Observable<any> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const idcli = idcliente;
  
    const miurl = `${this.url}/solicitudes/${micia}/${idcliente} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    //console.log("Estoy en get obtener solicitud", idcliente, "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );

  }


}
