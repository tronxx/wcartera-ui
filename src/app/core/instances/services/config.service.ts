import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compania } from '@models/companias';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';


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
    "urlfacturacion":"",
    "urlphp":"",
    "cia": 0

  }

  usuario = {
    idusuario: -1,
    iniciales: '',
    maestro: ''
  }
  


  debug = true;


  constructor(
    private datePipe : DatePipe,
    private http: HttpClient
  ) {
    this.getConfig();
  }


  async getConfig () {
    return this.http.get<any>("/assets/config/config.json").subscribe( datos => {
      this.cias = datos;
      this.config.estado = "OK";
      this.cia= this.cias[0];
      this.config.cia = this.cia.cia;
      this.config.url = this.cia.Urldatos;
      this.config.oldurl = this.cia.oldurldatos;
      this.config.urlfacturacion = this.cia.urlfacturacion;
      this.config.urlphp = this.cia.urlphp;
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

  obtenCodigoPostalCia() {
    return (this.cia.CP);
  }

  asigna_idusuario(idusuario: number, iniciales: string, maestro: string) {
    this.usuario.idusuario = idusuario;
    this.usuario.iniciales = iniciales;
    this.usuario.maestro = maestro;
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
        { clave:"EX", descri:"CRED.EXTERNO"},
    
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

  calcula_venc <Date> (fechavta:string, qom_z:string, letra:number) {

    let vencimiento_z = new Date(fechavta.replace(/-/g, '\/'));
    let esfindemes = this.esfindemes(vencimiento_z);
    let strfecvta =  this.fecha_a_str  (vencimiento_z, "YYYYmmdd");
    let dias_z = 15;
    let esimpar_z = 0;
    let nvafecha_z = 0;
    let meses_z = 0;
    let mimes_z = 0;
    let midia_z = 0;
    if (this.cia) {
      if( this.cia.AplicarContingencia  && (strfecvta < this.cia.FechaContingencia)) {
        vencimiento_z = this.SumaDiasaFecha(vencimiento_z, this.cia.DiasContingencia);
      }
  
    }

    let anu = vencimiento_z.getFullYear();
    let mes = vencimiento_z.getMonth() + 1;
    let dia = vencimiento_z.getDate();
    let strfec ="";
    let anusbrinca = 0;
    let diaoriginal = dia;
    let ii_z = 0;
    meses_z = letra;
    esimpar_z = (letra % 2);
    if(qom_z == "Q") {
      meses_z = Math.floor(letra / 2);
    }
    for (ii_z = 1; ii_z <= meses_z; ii_z++) {
        mes +=1;
        if(mes > 12) { anu++; mes = 1}
    }
    if(esimpar_z) {
      dia += 15;
      if ( dia > 30) {
        switch (mes) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12: 
          if(dia > 31) {
            mes += 1; if(mes > 12) { anu +=1; mes = 1 }
            dia = dia - 30;
          }
          break;
          case 2:
          case 4:
          case 6:
          case 9:
          case 11:
              mes += 1; dia = dia - 30;
          break;
        }
      }
      strfec = anu.toString() + "/" + mes.toString() + '/' + dia.toString();
      vencimiento_z = new Date(strfec);
      vencimiento_z = new Date (this.corrige_fecha_fin_de_mes(strfec));
      // console.log("letra Impar:", letra, "strfec:", strfec, " Vencimiento:", vencimiento_z.toDateString());
    } else {
      strfec = anu.toString() + "/" + mes.toString() + '/' + dia.toString();
      vencimiento_z = new Date (this.corrige_fecha_fin_de_mes(strfec));
      //vencimiento_z = new Date(strfec);
      if(esfindemes) vencimiento_z = this.damefindemes(vencimiento_z);
      // console.log("letra Par:", letra, "strfec:", strfec, " Vencimiento:", vencimiento_z.toDateString());
    }
    return (vencimiento_z);
  }

  SumaDiasaFecha(fecha: Date, dias: number) {
    let months = Math.floor(dias / 30);
    const remainingDays = dias % 30;
    let year = fecha.getFullYear();
    let month = fecha.getMonth() + months;
    let day = fecha.getDate() + remainingDays;

    // Handle cases where the result day exceeds the number of days in the result month
    if(dias > 0) {
      while (day > new Date(year, month + 1, 0).getDate()) {
        day -= new Date(year, month + 1, 0).getDate();
        month++;
      }
  
    } else {
      while (day < 1) {
        month--;
        if (month < 0) {
          month = 11;
          year--;
        }
        day += new Date(year, month + 1, 0).getDate();
      }
    }

    const resultDate = new Date(year, month + 1, day);
    return (resultDate);
  }

  corrige_fecha_fin_de_mes(strfec: string) {
    let anu = 0;
    let mes = 0;
    let dia = 0;
    let fechaxpartes = strfec.split("/")
    let stranu = fechaxpartes[0]
    let strmes = fechaxpartes[1]
    let strdia = fechaxpartes[2]
    anu = Number(stranu);
    mes = Number(strmes);
    dia = Number(strdia);
    //console.log('stranu:', stranu, strmes, strdia);
    
    let vencimiento_z = new Date();
    if(mes == 2 && dia > 28 ) {
      vencimiento_z = this.damefindemes(new Date(anu.toString() + "/" + mes.toString() + "/01"));  
    } else if ((mes == 4 || mes == 6 || mes == 9 || mes == 11 )&& dia > 30 ) {
      vencimiento_z = this.damefindemes(new Date(anu.toString() + "/" + mes.toString() + "/01"));  
    } else {
      vencimiento_z = new Date(anu.toString() + "/" + mes.toString() + "/" + dia.toString());  
    }
    return (vencimiento_z);

  }

  esfindemes <bool> (fecha: Date)  {
    let nvafecha = new Date (fecha.getTime() + (1 * 24 * 60 * 60 *  1000));
    let dia = 0;
    dia = nvafecha.getDate();
    if(dia == 1) {
      return (true);
    } else {
      return (false);
    }

  }

  damefindemes  (mifecha : Date) {
    let anu = 0;
    let mes=0;
    anu = mifecha.getFullYear();
    mes = mifecha.getMonth()+1;

    if(mes == 12) {
      anu =anu+1; mes=1;
    } else {
      mes = mes + 1;
    }
    let strfec = anu.toString() + "/" + mes.toString() + '/' + "01";
    let findemes = new Date( strfec);
    findemes = new Date ( findemes.getTime() + (-1 * 24 * 60 * 60 *  1000));
    //console.log('mes:', mes, 'mifecha:', mifecha.toDateString(), 'strfec:', strfec, 'Fin de Mes:', findemes.toDateString());
    return (new Date(findemes));
    
  }
  
  generavencimientos (fechavta:string, qom:string, inicio:number, final:number, diasgracia_z: number, letraspagadas: number)  {
    let ii_z = 0;
    let letra = "";
    let vence = "";
    let diasletra_z = 15;
    let fecven = new Date();
    if(qom == "Q") diasletra_z = 15;
    if(qom == "M") diasletra_z = 30;
    let fecbase_z = new Date(fechavta.replace(/-/g, '\/'));
    fecbase_z.setDate (fecbase_z.getDate() + diasgracia_z);
    fechavta = this.fecha_a_str(fecbase_z, "YYYY-mm-dd");
    console.log('Fecha Vta:', fechavta, 'fecbase:', fecbase_z);
    

    let listavencimientos_z= [];
    let fechamax = this.fecha_a_str(this.SumaDiasaFecha(new Date(), -5), "YYYYmmdd");
    let  vencido = false;

    for (ii_z = inicio; ii_z <= final; ii_z++) {
      if(ii_z) {
        letra = ii_z.toString().padStart(2, "0");
      } else {
        letra = "SE";
      }
      fecven = this.calcula_venc(fechavta, qom, ii_z );
      vence = this.fecha_a_str(fecven, "dd-mmm-YYYY");
      const pagado = Number (letra) <= letraspagadas;
      const fvence = this.fecha_a_str(fecven, "YYYYmmdd"); // this.config.fecha_a_str (fecven, "YYYYmmdd")
      //console.log("Letra", miven.letra, "miven.fecven", fecven, "fechamax", fechamax, "fvence", fvence);
      if(!pagado) {
        vencido = fvence < fechamax;
      }

      listavencimientos_z.push({letra, vence, fecven, pagado, vencido});

    }
    let misven_z = JSON.stringify(listavencimientos_z);
    //console.log("en config service", misven_z);
    return (misven_z);

  }


  fecha_a_str  (fecha : Date, formato:string)  {
    let strfecha_z = "";
    let anu_z = "";
    let mes_z = "";
    let dia_z = "";
    let meses_z = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];    
    anu_z = fecha.getFullYear().toString();
    mes_z = ((fecha.getMonth()+101).toString()).substring(1,3);
    dia_z = ((fecha.getDate()+100).toString()).substring(1,3);
    if(formato == "YYYY-mm-dd") {
      strfecha_z = anu_z + "-" + mes_z + "-" + dia_z;
    }
    if(formato == "YYYYmmdd") {
      strfecha_z = anu_z + mes_z +  dia_z;
    }
    if(formato == "yymmdd") {
      strfecha_z = anu_z.substring(2,4) + mes_z +  dia_z;
    }

    if(formato == "dd-mm-YYYY") {
      strfecha_z = dia_z +  "-" + mes_z + "-" + anu_z ;
    }
    if(formato == "dd-mmm-YYYY") {
      strfecha_z = dia_z +  "-" + meses_z[fecha.getMonth()] + "-" + anu_z ;
    }
    return (strfecha_z);
  }

  calcula_idcli(codigo: string): number {
    let idcli = 0;
    const  fechabase = new Date('1990-01-01');
    const anuvta = '20' + codigo.substring(2,4);
    const mesvta = codigo.substring(4,6);
    const diavta = codigo.substring(6,8);
    const fechavta = anuvta + '-' +  mesvta + '-' + diavta;
    const enfecha = new Date(fechavta);
    const tiempo =  enfecha.getTime() - fechabase.getTime();
    const dias = Math.floor(tiempo / (1000 * 60 * 60 * 24));
    const idtda = Number(codigo.substring(0,2));
    const conse = Number(codigo.substring(8,10));
    idcli = (idtda * 1000000) + (dias * 100) + conse;
    const messages = "Codigo " + codigo +
      " Anuventa " + anuvta +
      " mesventa " + mesvta +
      " Diaventa " + diavta +
      " idtda " + idtda +
      " conse " + conse +
      " tiempo " + tiempo +
      " Dias " + dias +
      " fechavta " + fechavta +
      " idcli " + idcli
    return (idcli)
  }
   

  ajustaFechaCierre(fecha: string) {
    const hoy = this.datePipe.transform( new Date(),"yyyy-MM-dd");
    const hora = new Date().getHours();
    
    let stfecha = fecha.split('T')[0];
    if(stfecha < hoy) {
      stfecha += 'T' + (hora+1).toString().padStart(2, '0')+':00:00';
    } else {
      stfecha += 'T' + (hora-1).toString().padStart(2, '0')+':00:00';
    }
    return stfecha;
  }

}
