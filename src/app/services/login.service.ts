import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

constructor(
  private config: ConfigService,
  private http: HttpClient
) { 

}
  

async login (login: string, passwd: string) {
  const url = this.config.obtenurl();
  console.log("Ulr de datos", url);
  var misparams = {
    "modo":"buscar_un_usuario",
    "login": 'MIRLEY'
  }
  //this.obtenurl();
  var respu_z = "";
  var miurl = url + "usuarios/busca_usuarios.php"
  const headers = { 'content-type': 'text/plain'};
  const body=JSON.stringify(misparams);
  let usuario = {};
  
  let  resultado = await this.http.post<any[]>(miurl, misparams, {'headers':headers}).subscribe( res => {
    usuario = res;
    console.log("loingservice Usuario", usuario);

  });
  return (usuario);

}

}
