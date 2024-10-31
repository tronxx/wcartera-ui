import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compania } from '@models/companias';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  cias : Compania[] = [];
  cia ?: Compania;
  config = {
    "estado":"-1",
    "url": "",
    "oldurl":"",
    "cia": 0

  }


  debug = true;


  constructor(private http: HttpClient) {
    this.getConfig();
   }


  async getConfig () {
    return await this.http.get<any>("/assets/config/config.json").subscribe( datos => {
      this.cias = datos;
      this.config.estado = "OK";
      this.cia= this.cias[0];
      this.config.cia = this.cia.cia;
      this.config.url = this.cia.Urldatos;
      this.config.oldurl = this.cia.oldurldatos;
      if(this.debug)
        console.log("Estoy en config service ", this.config, this.cia, this.config.url);

    });

  }

  obtenurl () {
    if(this.config.estado != "OK") {
      //console.log("Debug: aun no he llamado a configuracion:", this.config.estado);
      const listo = this.getConfig();
    }
    //console.log("Debug: Ya hice llamado a configuracion:", this.config.estado);
    return(this.config.url);
  }

  obtenNumeroCia() {
    return (this.config.cia);
  }

  obtenTiposClientesyQOM(tipo: string) {
    let resultado: { clave: string; descri: string; }[] = []
    if (tipo == "TIPOS_CLIENTES") {
      const tictes_z = [
        { clave:"PC", descri:"PRIMER CREDITO"},
        { clave:"AR", descri:"AVAL CON REFERENCIAS"},
        { clave:"CR", descri:"CLIENTE CON REFERENCIAS"},
        { clave:"CC", descri:"CLIENTE DE CONTADO"},
        { clave:"TC", descri:"TARJETA CREDITO"},
        { clave:"FI", descri:"CLIENTE ASI"},
    
      ]
      resultado = tictes_z;
    
    }
    
    if (tipo == "tiposQOM") {
      const tipoqom = [
        { clave:"C", descri:"Contado"},
        { clave:"Q", descri:"Quincenal"}
      ]
      resultado = tipoqom;
    
    }

    if (tipo == "EdosCivil") {
      const edoscivil = [
        {clave:"S", descri:"Soltero"},
        {clave:"C", descri:"Casado"}
      ]
      resultado = edoscivil;
    
    }

    if (tipo == "Sexos") {
      const sexos = [
        {clave:"M", descri:"Masculino"},
        {clave:"F", descri:"Femenino"}
      ]
      resultado = sexos;
    
    }

    return (resultado)

  }

  encodeUrl(url: string): string {
    const [baseUrl, queryParams] = url.split('?');
    if (!queryParams) {
      return encodeURI(url); // Si no hay parámetros, solo codifica la URL completa.
    }
  
    // Codifica cada uno de los parámetros de la URL.
    const encodedParams = queryParams
      .split('&')
      .map(param => {
        const [key, value] = param.split('=');
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  
    return `${baseUrl}?${encodedParams}`;
  }

}
