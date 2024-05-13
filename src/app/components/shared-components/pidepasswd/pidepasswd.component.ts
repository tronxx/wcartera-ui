import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Md5 } from 'ts-md5';
import { DatePipe } from '@angular/common';
import { ProductosService } from '@services/productos.service'

@Component({
  selector: 'app-pidepasswd',
  templateUrl: './pidepasswd.component.html',
  styleUrls: ['./pidepasswd.component.scss']
})
export class PidepasswdComponent implements OnInit {

  password_z = "";
  miubi_z = "";
  pwdcorrecto_z = false;
  nvopwd_z = "";
  cadena_z ="";
  cadpas_z = "";
  fechasrv_z = "";
  debug = false;
  
  constructor(
    public dialogRef: MatDialogRef<PidepasswdComponent>,
    private productosService:ProductosService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public message : string    

  ) { }


  ngOnInit(): void {
    let misdatos = JSON.parse(this.message);
    this.busca_fecha();
    this.miubi_z = misdatos.ubicacion;
  }

  async busca_fecha() {
    await this.obten_fecha_servidor();
  }

  async obten_fecha_servidor() {
    this.productosService.obtenFechayHora ().subscribe(
      respu => {
        let misdatos = respu;
        this.fechasrv_z = misdatos.fecha.substring(0,4);
        this.fechasrv_z += misdatos.fecha.substring(5,7);
        this.fechasrv_z += misdatos.fecha.substring(8,13);
        this.fechasrv_z = this.fechasrv_z.replace("T",":");
        //console.log("Fecha y Hora", this.fechasrv_z);
      }
    );
  
  }

  
  verfica_password() {
    let strfecha =  this.fechasrv_z;
    let mipass_z = this.miubi_z + strfecha;
    this.cadena_z = mipass_z;
    let pwd_z = Md5.hashStr(mipass_z).toString().toUpperCase();
    this.nvopwd_z = pwd_z;
    this.pwdcorrecto_z = (this.password_z == pwd_z);
  }

  closeyes () {
    let resultado = {
      "proferta": "OK"
    }
    this.dialogRef.close(resultado);
  }

  closeno() {
    this.dialogRef.close(false);
  }


}
