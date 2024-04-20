import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
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

async busca_usuario(login: string, passw: string) {
  //const nvopassw = hash(passw)
  const miurl = this.configService.config.url;
  const cia = this.configService.config.cia;
  const url = `${miurl}/usuarios/0/${login}/${passw}`;
     
  let miusuario = await lastValueFrom( this.http.get(url));
  console.log("usuario", miusuario);
  
  return (miusuario);

}


}
