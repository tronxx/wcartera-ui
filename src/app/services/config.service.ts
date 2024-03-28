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
    "cia": 0
  }


  constructor(private http: HttpClient) {
    const config = this.obtenconfig();
   }


  async obtenconfig () {
    return await this.http.get<any>("../assets/config/config.json").subscribe( datos => {
      this.cias = datos;
      this.config.estado = "OK";
      this.config.cia = 0;
      this.cia= this.cias[0];
    });

  }

  obtenurl () {
    if(this.config.estado != "OK") {
      console.log("Debug: aun no he llamado a configuracion:", this.config.estado);
      this.obtenconfig();
    }
    //console.log("Debug: Ya hice llamado a configuracion:", this.config.estado);
    return(this.cias[this.config.cia].Urldatos);
  }


}
