import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { User } from '../../abstracts/models/user';
import { Observable, lastValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
constructor(
  private configService: ConfigService,
  private http: HttpClient
) { 

}

async login(login: string, passw: string) {
  //const nvopassw = hash(passw)
  const url = this.configService.config.url;
  const cia = this.configService.config.cia;
  let miurl = `${url}/usuarios/${cia}/${login}/${passw}`;
  console.log("url", miurl);
 
  let miusuario = this.http.get(url);
  console.log("usuario", miusuario);
  
  return (miusuario);

}

busca_usuario (login: string, passwd: string) : Observable<User[]> {
  const url = this.configService.obtenurl();
  const cia = this.configService.obtenNumeroCia();
  console.log("Ulr de datos", url);
  var misparams = {
    modo:"buscar_un_usuario",
    login: login,
  }
  //this.obtenurl();
  var respu_z = "";
  var miurl = `${url}/usuarios/${cia}/${login}/${passwd}`;
  const headers = { 'content-type': 'text/plain'};
  const body=JSON.stringify(misparams);
  let usuario = {};
  
  return this.http.get<User[]>(miurl);
  
}


}
