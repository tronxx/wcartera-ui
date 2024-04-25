import { Component, OnInit } from '@angular/core';
import { EmailLoginDto } from '@dtos/email-login-dto';
import { Message } from '@models/message';
import { ConfigService } from '@services/config.service';
import { LoginService } from '@services/login.service';
import { Md5 } from 'ts-md5';
import { User } from '@models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  usuarios : User[] = [];
  Usuario: User;
  error = false;

  registro_z = {
    "cia":-1,
    "idusuario":-1,
    "parent":"-1",
    "login":"",
    "email":"",
    "nombre":"",
    "token":"",
    "acceso": "false",
    "iniciales":"",
    "nivel":""
  }

  pwdmd5_z : string = "";
  pwdrecortado_z : string = "";
  fechahoy_z  = new Date();
  anu_z = this.fechahoy_z.getFullYear().toString();
  mes_z = ((this.fechahoy_z.getMonth()+101).toString()).substring(1,3);
  dia_z = ((this.fechahoy_z.getDate()+100).toString()).substring(1,3);
  strfecha_z = this.anu_z + "-" + this.mes_z + "-" + this.dia_z;

  public message: Message;
  
  constructor(
    private loginService : LoginService,
    public router: Router
  ) {}

  ngOnInit(): void {
    
  }

  async signWithEmailAndPassword(data : EmailLoginDto) {

    const user = await this.loginService.busca_usuario(data.email, data.password).then( miuser => {
      console.log('Usuario Registrado', miuser);
      let xmiuser = JSON.parse( JSON.stringify(miuser));
      this.registro_z.idusuario = xmiuser.id,
      this.registro_z.login = xmiuser.login,
      this.registro_z.nombre = xmiuser.nombre;
      this.registro_z.email = xmiuser.email;
      this.registro_z.iniciales = xmiuser.iniciales;
      this.registro_z.acceso  = "true";
      this.registro_z.cia = xmiuser.cia;
      this.registro_z.parent = xmiuser.padre;
      
      localStorage.setItem("token", JSON.stringify( this.registro_z));
      this.router.navigateByUrl('/app/landing');
    }).catch( err => {
      this.error = true;
      console.log("Usuario no Encontrado");
      setTimeout(() => {
        this.message = { name : "error", message: "the login is not available right now"}
      }, 2100);
    }
      
    );
    
  }

}
