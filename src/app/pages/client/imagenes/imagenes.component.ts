import { CommonModule } from '@angular/common';  
import { Component, OnInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';

//import { DialogBodyComponent } from '../../dialog-body/dialog-body.component';
import { MatIconModule } from '@angular/material/icon'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';
import { PidefirmaComponent } from './pidefirma/pidefirma.component';
import { TomafotoComponent } from  './tomafoto/tomafoto.component';
import { PidepasswdComponent } from '../../../components/shared-components/pidepasswd/pidepasswd.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss']
})
export class ImagenesComponent implements OnInit {
  codcartera_z = "";
  firmacliente = "";
  firmaaval = "";
  inefrentecliente = "";
  inereversocliente = "";
  inefrenteaval = "";
  inereversoaval = "";
  nuevocodigo = "";
  puedepedirimagenes = false;
  pedircambiocodigo = false;
  imagenes = {
    firmacliente: "",
    firmaaval: "",
    ineclientefrente: "",
    ineclientereverso: "",
    ineavalfrente: "",
    ineavalreverso: ""
  }

  usrreg_z = {
    "idusuario":0,
    "login":"",
    "nombre":"",
    "token":"",
    "acceso": "false",
    "iniciales":"",
    "nivel":""
  }
  constructor(public dialog: MatDialog, 
    private route: ActivatedRoute,
    private servicioclientes: ClientesService,
    private datePipe: DatePipe,
    private configService : ConfigService,
    public router: Router

  ) {}

  ngOnInit(): void {
    this.inicializa();
  }

  inicializa() {
    let ayer_z =new Date().setDate(new Date().getDate() -1);
    let strfecha =  this.datePipe.transform(ayer_z,"yyMMdd");
    let mistorage_z  = localStorage.getItem('capvtas') || "{}";
    let usrreg_z =  JSON.parse(mistorage_z);
    this.codcartera_z = usrreg_z.codcartera + strfecha + "01";    
  }

  aceptar_codigo() {
    this.puedepedirimagenes = false;
    let params  = {
      modo: "obtener_status_imagenes_grabadas",
      codigo: this.codcartera_z
    }

    this.servicioclientes.obtener_status_imagenes_grabadas(JSON.stringify(params)).subscribe( res => {
      if(res.concepto == "true") {
        this.puedepedirimagenes = false;
        this.alerta("Este cliente ya tiene grabadas las imágenes\n, no puede sobreescribirlas");
      } else {
        this.puedepedirimagenes = true;
        this.actualizar_imagenes();
      }
    });

  }

  async obtener_imagenes(): Promise<any> {
    const params = { codigo: this.codcartera_z};
    return await lastValueFrom ( this.servicioclientes.obtener_imagenes(JSON.stringify(params)));
   }
  
  xobtener_imagenes() {
    const params = { codigo: this.codcartera_z};
    this.servicioclientes.obtener_imagenes(JSON.stringify(params)).subscribe( res => {
      this.imagenes = JSON.parse( JSON.stringify(res));
      this.actualizar_imagenes();
    });
  }

  async actualizar_imagenes() {
    const respu = await this.obtener_imagenes();
    console.log("Regresando de buscar imagenes", respu);
    this.imagenes = JSON.parse(JSON.stringify(respu));
    let id = Math.round( Math.random() * 1000);
    this.firmacliente =  `${this.configService.config.oldurl}/${this.imagenes.firmacliente}?id=${id}`;
    this.firmaaval =  `${this.configService.config.oldurl}/${this.imagenes.firmaaval}?id=${id}`;
    this.inefrentecliente =  `${this.configService.config.oldurl}/${this.imagenes.ineclientefrente}?id=${id}`;
    this.inereversocliente =  `${this.configService.config.oldurl}/${this.imagenes.ineclientereverso}?id=${id}`;
    this.inefrenteaval =  `${this.configService.config.oldurl}/${this.imagenes.ineavalfrente}?id=${id}`;
    this.inereversoaval =  `${this.configService.config.oldurl}/${this.imagenes.ineavalreverso}?id=${id}`;
    // this.getImagenURLfirmaCliente("cliente");
    // this.getImagenURLfirmaAval("aval");
    // this.getImagenURLIneFrenteCliente('ine_frente_cliente')
    // this.getImagenURLIneReversoCliente('ine_reverso_cliente')
    // this.getImagenURLIneFrenteAval('ine_frente_aval')
    // this.getImagenURLIneReversoAval('ine_reverso_aval')
  }

  getImagenURLfirmaCliente(clioaval: string) {
    this.firmacliente = this.getImagenURLfirma(clioaval)
  }

  getImagenURLfirmaAval(clioaval: string) {
    this.firmaaval = this.getImagenURLfirma(clioaval)
  }

  getImagenURLIneFrenteCliente(modo: string) {
    this.inefrentecliente = this.getImagenURLIne(modo)
  }

  getImagenURLIneReversoCliente(modo: string) {
    this.inereversocliente = this.getImagenURLIne(modo)
  }

  getImagenURLIneFrenteAval(modo: string) {
    this.inefrenteaval = this.getImagenURLIne(modo)
  }

  getImagenURLIneReversoAval(modo: string) {
    this.inereversoaval = this.getImagenURLIne(modo)
  }


  getImagenURLIne(modo: string) {
    let id = Math.round( Math.random() * 1000);

    const imagindefault =  `${this.servicioclientes.url}uploads/ine/identidad_blanco.jpg`;
    let imagin =  `${this.servicioclientes.url}uploads/ine/${this.codcartera_z}_${modo}.jpg?id=${id}`;
    return(imagin);

  }


  getImagenURLfirma(clioaval: string) {
    let id = Math.round( Math.random() * 1000);
    let firma =  `${this.servicioclientes.url}uploads/firmas/${this.codcartera_z}_${clioaval}_firma.jpg?id=${id}`;
    return(firma);
 
  }


  pedir_firma( modo: string) {
    let params_z = {
     "modo": modo, 
     "codigo":this.codcartera_z,
     "tipoimagen": "firmas"
    }
    const dlgdatosrenfac= this.dialog.open(PidefirmaComponent, {
     width: '500px',
     height: '400px',
     data: JSON.stringify(params_z)
    });
    dlgdatosrenfac.afterClosed().subscribe(res => {
        
        if(res) {
         this.getImagenURLfirmaCliente("cliente");
         this.getImagenURLfirmaAval("aval");
    
        }
        
       }
    );
 }

 grabar_imagenes() {
  this.puedepedirimagenes = false;
  let params  = {
    modo: "grabar_status_imagenes_grabadas",
    codigo: this.codcartera_z
  }

  this.servicioclientes.grabar_status_imagenes_grabadas(JSON.stringify(params)).subscribe( res => {
    if(res.status == "false") {
      this.puedepedirimagenes = true;
      this.alerta("No se pudieron grabar las imágenes");
      return;
    } else {
      this.puedepedirimagenes = false;
      this.alerta("Se han grabado las imágenes");
      this.actualizar_imagenes();
    }
  });

}

  pedir_foto_ine( modo: string) { 
    let params_z = {
      "modo": modo, 
      "codigo":this.codcartera_z,
      "tipoimagen": "ine"
     }
     const dlgdatosrenfac= this.dialog.open(TomafotoComponent, {
      width: '600px',
      height: '400px',
      data: JSON.stringify(params_z)
     });
     dlgdatosrenfac.afterClosed().subscribe(res => {
         
         if(res) {
          this.actualizar_imagenes();
          //this.getImagenURLfirmaCliente("cliente");
          //this.getImagenURLfirmaAval("aval");
     
         }
         
        }
     );
 
  }

  cambiar_codigo() {
    let params = {
      'codigoanterior': this.codcartera_z,
      'codigonuevo': this.nuevocodigo
    }
    this.servicioclientes.cambio_codigo_imagenes(JSON.stringify(params)).subscribe(res => {
      let table = ""
      res.forEach(miren => {
        table += miren.clave + " " +  miren.exito + "\n"
      })
      this.alerta(table);
    });
    this.pedircambiocodigo = false;
  }

  pedir_cambiar_codigo() {
    this.pedircambiocodigo = false;
    let cod_z = this.codcartera_z.substring(0,2);
     let params_z = {
      "ubicacion": "LI"
     }
     const dlgdatosrenfac= this.dialog.open(PidepasswdComponent, {
      width: '400px',
      data: JSON.stringify(params_z)
     });
     dlgdatosrenfac.afterClosed().subscribe(res => {
        //console.log("Regresando de Pide Password", res);
         
         if(res) {
           this.pedircambiocodigo = true;
         }
         
        }
     );
  
  }

  no_aceptar_cambio_codigo() {
    this.pedircambiocodigo = false;
  }
  

  alerta(mensaje: string) {
      const dialogref = this.dialog.open(DlgyesnoComponent, {
        width:'350px',
        data: mensaje
      });
      dialogref.afterClosed().subscribe(res => {
        //console.log("Debug", res);
      });
    
  }
  
}
