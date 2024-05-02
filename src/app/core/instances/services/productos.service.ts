import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Productos, Kardex } from  '@models/index';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  config: any;
  cia = 1;
  url = "";

  constructor(
    private configService: ConfigService,
    private http: HttpClient

  ) {

   }

   async loadconfig()  {
    this.url  = this.configService.config.url;
    this.cia = this.configService.config.cia;
  
    //this.config =  await this.configService.getConfig();
    //this.url = this.configService.config.url;
    console.log("llamando a config", this.config, this.url, this.cia);
  }

  obten_lista_productos(micia: number) : Observable<Productos[]> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/inven/${micia}`;
    
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl);
    
    return( this.http.get<Productos[]> (miurl, {'headers':headers}) );

  }

  obten_lista_productos_codigo(micia: number, codigo:string) : Observable<Productos[]> {
    this.url = this.configService.config.url;
    codigo = codigo.replace(/%/g, '%25');

  
    const miurl = `${this.url}/inven/${micia}/${micia}/${codigo}`;
    
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl);
    
    return( this.http.get<Productos[]> (miurl, {'headers':headers}) );

  }

  obten_producto(idcia:number, idart: number) : Observable<Productos> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/inven/${idcia}/${idart}`;
    const headers = { 'content-type': 'application/json'};
    //console.log("productos service url", miurl);
    return( this.http.get<Productos> (miurl, {'headers':headers}) );

  }

  productoHacia(idcia:number, codigo: string, hacia:string) : Observable<Productos> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/inven/${idcia}/0/${codigo}/${hacia}`;
    const headers = { 'content-type': 'application/json'};
    //console.log("productos service url", miurl);
    return( this.http.get<Productos> (miurl, {'headers':headers}) );

  }


  mockRequest(){
    lastValueFrom(this.http.get("https://www.google.com"))
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err))
  }

  create_producto(producto: Productos): Observable<Productos>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/inven/`;
    //let miurl = this.config.url + "/almacenes";

    const headers = { 'content-type': 'application/json'};
    console.log("Estoy en Post create_producto", producto, "url:",miurl);
    return( this.http.post<Productos> (miurl, producto, {'headers':headers}) );

  }

  edit_producto(producto: Productos): Observable<Productos>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/inven/${producto.id}`;
    //let miurl = this.config.url + "/inven/" + almacen.id;

    const headers = { 'content-type': 'application/json'};
    //console.log("Estoy en Post create_almacen", almacen, "url:",miurl);
    return( this.http.put<Productos> (miurl, producto, {'headers':headers}) );

  }

  delete_producto(producto: Productos): Observable<Productos>{
    this.url = this.configService.config.url;
    const miurl = `${this.url}/inven/${producto.id}`;
    //let miurl = this.config.url + "/inven/" + almacen.id;

    const headers = { 'content-type': 'application/json'};
    console.log("Estoy en delete_producto", producto, "url:",miurl);
    return( this.http.delete<any> (miurl) );

  }

  obtenLastFolio(micia: number, idart: number, idalm: number) : Observable<number> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/kardex/${micia}/${idart}/${idalm}/${idalm}`;
    
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl);
    
    return( this.http.get<number> (miurl, {'headers':headers}) );
  }

  crearMovimientoKardex(movkardex: Kardex) : Observable<any> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/kardex`;
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl, " Dto Kardex", movkardex);
    return( this.http.post<Kardex> (miurl,  movkardex, {'headers':headers}) );
  }

  salidaKrdex(movkardex: Kardex) : Observable<any> {
    this.url = this.configService.config.url;
    //const mimov: {salio, fechsale, descrisale} = movkardex;
    const movsalidakardex = {
      id: movkardex.id,
      salio : movkardex.salio,
      fechasale : movkardex.fechasale,
      descrisale: movkardex.descrisale
    }
  
    const miurl = `${this.url}/kardex/${movkardex.id}`;
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl, " Dto Kardex", movkardex);
    return( this.http.put<Kardex> (miurl, movsalidakardex, {'headers':headers}) );
  }

  deshacerSalidaKardex(movkardex: Kardex) : Observable<any> {
    this.url = this.configService.config.url;
    //const mimov: {salio, fechsale, descrisale} = movkardex;
    const movsalidakardex = {
      id: movkardex.id,
      salio : 'N'
    }
  
    const miurl = `${this.url}/kardex/${movkardex.id}`;
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl, " Dto Kardex", movkardex);
    return( this.http.put<Kardex> (miurl, movsalidakardex, {'headers':headers}) );
  }

  eliminarMovimiento(movkardex: Kardex) : Observable<any> {
    this.url = this.configService.config.url;
    //const mimov: {salio, fechsale, descrisale} = movkardex;
 
    const miurl = `${this.url}/kardex/${movkardex.id}`;
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl, " Dto Kardex", movkardex);
    return( this.http.delete<Kardex> (miurl, {'headers':headers}) );
  }

  modificarMovimientoKardex(movkardex: Kardex) : Observable<any> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/kardex/${movkardex.id}`;
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl, " Dto Kardex", movkardex);
    return( this.http.put<Kardex> (miurl,  movkardex, {'headers':headers}) );
  }



  obten_kardex(micia: number, idart: number, idalm: number) : Observable<Kardex[]> {
    this.url = this.configService.config.url;
  
    const miurl = `${this.url}/kardex/${micia}/${idart}/${idalm}`;
    
    const headers = { 'content-type': 'application/json'};
    console.log("productos service url", miurl);
    
    return( this.http.get<Kardex[]> (miurl, {'headers':headers}) );

  }



}
