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
    "cia": 0

  }
  debug = false;


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
      //console.log(this.config, this.cia);

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


}
