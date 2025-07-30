import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Nombres, Clientes, Token, TIPOS_SOLICIT, CLAVES_SOLICIT } from '@models/index'
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  config: any;
  cia = 1;
  url = "";
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
  
    //this.config =  await this.configService.getConfig();
    //this.url = this.configService.config.url;
    //console.log("llamando a config", this.config, this.url, this.cia);
    const tok = localStorage.getItem("token") || '{}';
    //console.log("Token", tok);
    this.registro_z = JSON.parse(tok) ;
    this.cia = this.registro_z.usuario.cia;
    this.debug = this.configService.debug;

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

  obten_cliente_x_codigo(codigo: string) : Observable<Clientes> {
    const url = this.configService.config.url;
    const micia = this.cia;
  
    const miurl = `${url}/clientes/codigo/${micia}/${codigo}`;
    
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

  async obtenerNombresAsync(id: number): Promise<Nombres> {
    try {
      const nombres = await firstValueFrom(this.obten_nombres(id));
      console.log("Respuesta obtenida:", nombres);
      return nombres;
    } catch (error) {
      console.error("Error al obtener nombres:", error);
      throw error;
    }
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

  obtener_status_imagenes_grabadas(params:string )  {
    this.url = this.configService.config.url;
    const datos = JSON.parse(params);
    const tipo = TIPOS_SOLICIT.CLIENTE;
    const tipodato = CLAVES_SOLICIT.IMAGENES_GRABADAS;
    const id = this.configService.calcula_idcli(datos.codigo);
    const miurl = `${this.url}/solicitudes/datoespecifico/${this.cia}/${id}/${tipodato}/${tipo}`;
    //let miurl = this.config.url + "/almacenes/" + almacen.id;

    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    
    if(this.debug) console.log("Estoy en buscarLetrasImpresas", "url:",miurl);
    return( this.http.get<any> (miurl,  {'headers':headers}) );
  }

  cambio_codigo_imagenes( parametros: string): Observable<any[]> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + this.url + "altas/renombra.php"
    const headers = { 'content-type': 'text/plain'};
    const body=parametros;
    console.log("Debug: Estoy en crea_factura_capvtas parametros:", parametros);
    let misparams = JSON.parse(parametros);
    misparams = {
      'modo':'renombrar',
      'codigoanterior': misparams.codigoanterior,
      'codigonuevo': misparams.codigonuevo
    }

    if(this.debug) console.log("Debug: Estoy en renombrar imagenes ", misparams);
  
    return this.http.post<any>(miurl, JSON.stringify( misparams), {'headers':headers});
  }

  obtener_imagenes( parametros: string): Observable<any[]> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "/altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};
    const body=parametros;
    let misparams = JSON.parse(parametros);
    misparams = {
      'modo':'obtener_lista_firmas_ine',
      'codigo': misparams.codigo
    }

    if(this.debug) console.log("Debug: Estoy en obtener_imagenes ", misparams, miurl);
  
    return this.http.post<any>(miurl, JSON.stringify( misparams), {'headers':headers});
  }

  enviar_firma(img: string, codigo: string, tipoimagen: string) : Observable<any> {
    const apiUrl = this.configService.config.oldurl  + '/altas/recibe_firma.php';
    //const headers = { 'content-type': 'multipart/form-data; boundary=something'};
    const base64Image = img;

    const headers = { 'content-type': 'text/plain'};
    const imageData = {
      image: base64Image,
      tipoimagen: tipoimagen,
      additionalContent: codigo // Contenido adicional

    };
    return this.http.post<any>(apiUrl, imageData, {'headers':headers});

  }

  grabar_status_imagenes_grabadas ( parametros: string): Observable<any> {
    
    let respu_z = "";
    let miurl = this.configService.config.oldurl + "altas/serviciosaltas.php"
    const headers = { 'content-type': 'text/plain'};
    const body=parametros;
   
    return this.http.post<any>(miurl, parametros, {'headers':headers});
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

  obtener_solicitud(idcliente: number, tipo:number) : Observable<any> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const idcli = idcliente;
    
  
    const miurl = `${this.url}/solicitudes/${micia}/${idcliente}/${tipo} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    //console.log("Estoy en get obtener solicitud", idcliente, "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );

  }

  obtener_letras_impresas(idcliente: number) : Observable<any> {
    this.url = this.configService.config.url;
    const micia = this.cia;
    const idcli = idcliente;
    const tipo = TIPOS_SOLICIT.VENTA;
  
    const miurl = `${this.url}/solicitudes/${micia}/${idcliente}/${tipo} `;
    
    const headers = { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.registro_z.token}`      
    };    

    //console.log("Estoy en get obtener solicitud", idcliente, "url:",miurl);
    return( this.http.get<any> (miurl, {'headers':headers}) );

  }


}
