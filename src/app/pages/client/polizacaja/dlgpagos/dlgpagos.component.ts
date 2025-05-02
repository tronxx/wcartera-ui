import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { VentasCompletas, Nombres, Clientes, Ciudades, Vendedores,
  Promotores, Factura, Renfac, FacturaCompleta, PolizasCompletas,
  Renpolcompleto, Vencimientos,
  Movclis, Movcliscsaldo, Metodopago, Usocfdi, Regimenes, Codigocaja } 
 from '@models/index';
 import { VencimientosComponent } from '@forms/shared-components/vencimientos/vencimientos/vencimientos.component';
 import { MatSelectChange } from '@angular/material/select';
 import { formatNumber,  CommonModule,  CurrencyPipe, formatCurrency, formatDate, DatePipe } from '@angular/common';
 import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service';
import { ComplementosService } from '@services/complementos.service';
import { PolizasService } from '@services/polizas.service';
import { ConfigService } from '@services/config.service';
import { DatosventaComponent } from '@forms/shared-components/ventas/datosventa/datosventa.component';

@Component({
  selector: 'app-dlgpagos',
  templateUrl: './dlgpagos.component.html',
  styleUrls: ['./dlgpagos.component.scss']
})
export class DlgpagosComponent implements OnInit {

  public venta?: VentasCompletas;
  public vencimientos: Vencimientos[] = [];
  yatengovencimientos = false;
  cobratario: Promotores;
  comxlet = 0;
  comxrec = 0;
  compra = "";
  idpoliza = 0;
  idusuario = 0;
  iniciales = "";
  errores = [""];
  esmoroso = false;
  comision = 0;
  importe = 0;
  recobon = 0;
  recibido = 0;
  impxcob = 0;
  recargoscobrados = 0;
  neto = 0;
  bonifi = 0;
  cambio = 0;
  ltaini = "";
  ltafin = "";
  dias = 0;
  diasbon = 5;
  ultltaoculto_z = false;
  listaletras = [""];
  piva = 16;
  tasarecargo_z = 20;
  tipopagosel = "";
  concepto = "";
  conceptocompl = "";
  bonif_cerrada = true;
  esconrec = false;
  importecerrado = true;
  tipomovsel = "";
  fechaactual = new Date();
  tipomovcerrado = false;
  msgsigpago = "";
  yatengoventa = false;
  aceptarpago = false;
  tienereccobrado = false;

  tipospagos =  [ 
    { "clave":"C", "descri":"COMPLETO"  },
    { "clave":"A", "descri":"A CUENTA"  },
    { "clave":"S", "descri":"SALDO"  }
  ]

  tiposmov = [
    { "tipo":"B", "descri":"BONIFICACION", "activo":"true"  },
    { "tipo":"R", "descri":"RECARGO", "activo":"false"  },
    { "tipo":"N", "descri":"NETO" , "activo":"false"}
  ]



  constructor(
     private ventasService: VentasService,
     private facturasSerice: FacturacionService,
     private complementosService: ComplementosService,
     private polizasService: PolizasService,
     private configService: ConfigService,
 
    public dialogRef: MatDialogRef<DlgpagosComponent>,
    public dialog : MatDialog,
    private datePipe : DatePipe,
    @Inject(MAT_DIALOG_DATA) public message : string
  ) { }

  ngOnInit(): void {
    const datosiniciales = JSON.parse(this.message);
    this.errores = [];
    this.venta = datosiniciales.venta;
    this.venta.saldo = this.venta.cargos - this.venta.abonos;
    //this.compra = datosiniciales.compra;  
    this.idpoliza = datosiniciales.idpoliza;
    this.idusuario = datosiniciales.idusuario;
    this.iniciales = datosiniciales.iniciales;
    this.vencimientos = datosiniciales.vencimientos;
    this.yatengoventa = true;
    this.yatengovencimientos = true;
    this.cobratario = datosiniciales.cobratario;
    this.calcula_siguiente_pago();
    
    //console.log("vencimientos", this.vencimientos)
    
  }


  async calcula_siguiente_pago() {
    console.log("Estoy en calcula_siguiente_pago");

    const letrapagada = ""
    let letraspagadas = 0;
    let sigletra = 0;
    let importexpagar = 0;
    const fechavta = this.venta.fecha.substring(0, 10);
    const qom = this.venta.qom;
    const nulets = this.venta.nulets;
    const diasgracia = 0;
    const abonos = this.venta.abonos;
    const canle = this.venta.canle;
    const enganche = this.venta.enganc;
    const servicio = this.venta.servicio;
    const totabonos = abonos;
    let msg = "";
    let prletconrec_z = ""
    let atrasos = "";
    if(canle) {
      letraspagadas = Math.floor ((abonos - enganche - servicio) / canle);
    }
    const sigpago = letraspagadas * canle + enganche + servicio;
    if(sigpago == totabonos ) {
      sigletra = letraspagadas + 1;
      importexpagar = canle;
      msg = "la letra " + sigletra + "/" + this.venta.nulets;
      this.activartipospago(["A", "C"]);
      this.tipopagosel = "C";
    } else {
      sigletra = letraspagadas + 1;
      importexpagar = canle - (totabonos - (canle * letraspagadas + enganche + servicio))
      msg = "Saldo " + sigletra  + "/" + this.venta.nulets; 
      this.activartipospago(["A", "S"]);
      this.tipopagosel = "S";
      msg  + " por " +  formatCurrency ( Number(importexpagar) , 'en-US', '$');
    }
    this.msgsigpago = "Debe Pagar " +  msg;
    let ii_z = 0;
    let importevencido = 0;
    let recargo = 0;
    const minumlet_z = sigletra.toString();
    this.ltaini = minumlet_z;
    this.ltafin = minumlet_z;

    this.listaletras = []
    this.listaletras.push(minumlet_z);
    prletconrec_z = this.calcula_bonif_o_rec(sigletra);
    this.tipomovsel = prletconrec_z;
    console.log("calcula_siguiente_pago", this.tipomovsel);
    for (ii_z = sigletra + 1 ; ii_z <= nulets; ii_z++) {
      const minumlet_z = ii_z.toString();
      this.listaletras.push(minumlet_z);
      
      if(this.vencimientos[ii_z - 1].vencido) {
         importevencido += canle;
         recargo += Math.round (canle * this.tasarecargo_z / 100);
      }
    }
    this.recargoscobrados = 0;
    this.tienereccobrado = false;
    const letra = Number(this.ltaini);
    prletconrec_z = this.calcula_bonif_o_rec(letra);
    this.esconrec = false;
    if(prletconrec_z == 'R' ) {
      this.esconrec = true;
      this.activartipomov(["R"]);
      const reccobrado = await this.ventasService.obtenerRecargosLetra(this.venta.idventa, letra );
      if(reccobrado) {this.recargoscobrados  = reccobrado.recargos; this.tienereccobrado = true;}

      this.recobon = recargo  - this.recargoscobrados;
      if(this.recobon < 0) this.recobon = 0;
      this.calculaNeto();
      this.bonif_cerrada = true;
    }
    if(prletconrec_z == 'B' ) { 
      this.recobon = this.venta.bonifi;
      this.activartipomov(["B"]);
    }

    this.importe = importexpagar;
    this.msgsigpago += " Por $ " + formatNumber (importexpagar, 'en-US', '1.0-0') 
    if(importevencido) {
      this.msgsigpago += " Tiene Vencido $ " + formatNumber (importevencido + importexpagar, 'en-US', '1.0-0') + " mas Recargos";
      this.alerta(this.msgsigpago);
      this.tipomovsel = 'R';
    }
    this.impxcob = this.importe;
    this.calculaConcepto();
    this.calculaNeto();

  }

  activartipospago(tiposdepago: string[]){
    this.tipospagos = [];
    tiposdepago.forEach(tipo => {
      if(tipo == "A") {
        this.tipospagos.push({ "clave":"A", "descri":"A CUENTA" });
      }
      if(tipo == "C") {
        this.tipospagos.push({ "clave":"C", "descri":"COMPLETO" });
      }
      if(tipo == "S") {
        this.tipospagos.push({ "clave":"S", "descri":"SALDO" });
      }
    });
  }

  calculaNeto() {
    this.validarpago();
   
    if(this.tipomovsel == "B") {
      this.neto = this.importe - this.recobon;
      //console.log("Debug Bonif:", this.datospago.importe, " ", this.datospago.recobon, " Neto", this.datospago.neto);
    } else {
      this.neto = this.importe + this.recobon;
      //console.log("Debug Recargos:", this.datospago.importe, " ", this.datospago.recobon, " Neto", this.datospago.neto);
    }
    
    this.recibido = this.neto;
    console.log("Voy a Calcular cambio: recibido:", this.recibido);
    this.calcula_comision();
    this.calcula_cambio();
    //console.log("Debug nETO:", this.datospago.neto);
  
  }

  calcula_cambio() {
    this.cambio = this.recibido -  this.neto;
  }

  validarpago() {
    this.errores=[];
    if(Number(this.ltafin) <  Number(this.ltaini ) ) {
      this.errores.push("La letra Final no puede ser mayor a la inicial");
    }
    if(this.tipopagosel == "A" && this.importe >= this.impxcob) {
      this.errores.push("Si es A cuenta el Importe debe ser menor al saldo de la letra " + this.impxcob.toString());
    }
    if(this.conceptocompl.includes('/')) {
      this.errores.push("El complemento del concepto no puede contener el caracter / ");
    }
    let prletconrec_z = this.calcula_bonif_o_rec(Number(this.ltaini));
    let ulletconrec_z = this.calcula_bonif_o_rec(Number(this.ltafin));
    if(prletconrec_z != ulletconrec_z) {
      this.errores.push("No puede mezclar letras atrasadas y al día");
    }
    if(this.importe < this.recobon && this.tipopagosel == "B" ) {
      this.errores.push("Bonificación Excesiva ");
  
    }
  
    this.aceptarpago = !this.errorespago();
    return(!this.errorespago());
  }
  
  errorespago () {
    if(this.errores.length) {
      return (true);
    }
    else {
      return(false);
    }
  }
  
  calcula_bonif_extra () {
    let mesesanticip_z = 0;
    let mub_z = 0;
    let bonifextra_z = 0;
    let message_z = "";
    let miltaini_z = Number(this.ltaini);
    let miltafin_z = Number(this.ltafin);
    let saldoactual = 0;
    if(this.venta) {
       saldoactual = this.venta.cargos - this.venta.abonos;
    }
  
    if(this.dias > this.diasbon) return;
  
    if (miltafin_z  != this.venta.nulets) return;
    mesesanticip_z = miltafin_z  - miltaini_z - 1;
    if(this.venta.qom == "Q") mesesanticip_z = Math.floor( mesesanticip_z / 2);
    mesesanticip_z -= 1;
    if( mesesanticip_z < 1) return;
    mub_z = this.calcula_mub();
    bonifextra_z = ( ( this.venta.precon * ( 1 + this.piva / 100)  ) - this.venta.enganc  ) * mesesanticip_z * mub_z / 100;
    bonifextra_z = Math.round( bonifextra_z - 0.50);
    if(bonifextra_z < 0.5) bonifextra_z = 0; 
    if(bonifextra_z) {
      let saldacon = saldoactual - this.recobon - bonifextra_z;
      message_z = "Cliente con Bonificacion Extra \n" ;
      message_z += " Saldo Actual " + formatNumber (saldoactual, 'en-US', '1.0-0') + " \n"; 
      message_z += " Bonificacion Extra " + formatNumber (bonifextra_z, 'en-US', '1.0-0') + " \n"; 
      message_z += " Bonificacion Normal: " + formatNumber((miltafin_z - miltaini_z + 1) * this.bonifi , 'en-US', '1.0-0')  + " \n"; 
      message_z += " Meses Adelanto " + mesesanticip_z.toString() + " \n"; 
      message_z += " Salda Con: " +  formatNumber (saldacon, 'en-US', '1.0-0') + " \n"; 
      this.alerta(message_z);
      this.recobon += bonifextra_z;
      // --> Checa este dato this.calculaNeto();
    }
    
  }
  
  calcula_mub() {
    let meses_z = this.venta.nulets;
    let aua_z = 0;
    let aub_z = 0;
    let porutf_z = 0;
    if(this.venta.qom == "Q") meses_z = meses_z / 2;
    aua_z = ( this.venta.canle - this.venta.bonifi ) * this.venta.nulets;
    aub_z = this.venta.precon * ( 1 + this.piva / 100 ) - this.venta.enganc;
    if (aub_z) porutf_z = ((aua_z / aub_z) - 1 ) * 100;
    if (meses_z) porutf_z = porutf_z / meses_z;
    return (porutf_z)
  }
  
  calcula_comision () {
    let comxlet_z = 0;
    let comxrec_z = 0;
    if(this.cobratario) {
      comxlet_z = this.comxlet;
      comxrec_z = this.comxrec;
    }
    if(this.esmoroso && this.tipomovsel == "R") {
        this.comision = Math.round( this.importe * comxlet_z ) / 100;
    }
  }
  
  
  tipomovSelectionChange(event: MatSelectChange) {
    this.sel_tipopago();
  } 
  

  
  sel_tipopago() {
    let numerodeletras_z = Number(this.ltafin) - Number (this.ltaini) + 1;
    if(this.venta.bonifi > 0 )  this.bonif_cerrada = false; else this.bonif_cerrada = true; 
    if(this.tipomovsel == "N") {
      this.recobon = 0;
      this.bonif_cerrada = true;
      this.calculaNeto();
      return;
    } 
    let recargo = 0;
    if (this.tipomovsel == "R") {
      recargo = Math.round( this.venta.canle * this.tasarecargo_z / 100);
      this.recobon = recargo * numerodeletras_z - this.recargoscobrados;
      if(this.recobon < 0) this.recobon = 0;
      this.bonif_cerrada = true;
      this.calculaNeto();
      return;
    } 
    if (this.tipomovsel == "B") {
        this.recobon = this.recobon * numerodeletras_z;
        this.calculaNeto();
        this.bonif_cerrada = true;
      }
    // this.alerta("Bonificacion del Cliente:" + this.bonifi_z.toString() + " Bonif Cerrada:" + this.bonif_cerrada);
    //this.sigletra_z = Number (this.datospago.ltaini);
  }
  
  activartipomov( tipos:string[]) {
    this.tiposmov=[];
    tipos.forEach(tipo => {
      if(tipo == "B") {
        this.tiposmov.push({ "tipo":"B", "descri":"BONIFICACION", "activo":"true"  });
      }
      if(tipo == "N") {
        this.tiposmov.push({ "tipo":"N", "descri":"NETO", "activo":"true"  });
      }
      if(tipo == "R") {
        this.tiposmov.push({ "tipo":"R", "descri":"RECARGO", "activo":"true"  });
      }
  
      
    });
  
    this.calcula_comision();
  
  }
  
  calcula_bonif_o_rec(miletra_z:number) {
    let esrecobon_z = "B";
    let mivenc_z = new Date();
    let fechavta = this.venta.fecha.substring(0,10);
    mivenc_z = this.configService.calcula_venc(fechavta, this.venta.qom, miletra_z);
    console.log("Venta Fecha:", fechavta,  "Debug: vence", mivenc_z,  " Vence:", mivenc_z.getTime() );
    this.dias = Math.floor( ( this.fechaactual.getTime() - mivenc_z.getTime()  ) / (86400000));
    console.log("Debug: dias", this.dias,  " Vence:", mivenc_z.getTime() );
    if(this.dias > this.diasbon ) {
        esrecobon_z = "R";
    } else {
        esrecobon_z = "B";
    }
  
    return esrecobon_z;
  }
  
  tipopagoSelectionChange(event: MatSelectChange) {
    this.calculaConcepto();
  } 

  async calculaConcepto() {
    let imp_z = 0;
    let nuletxpag_z = 0;
    let factor_z = 0;
    let iniconcep = "";
    console.log("Estoy en calculaConcepto");
    this.ultltaoculto_z = false;
    if(this.bonifi < 1) {
      this.bonif_cerrada = true;
    }

    if(this.tipopagosel == "A") {
      iniconcep = "ACTA ";
      this.ultltaoculto_z = true;
      this.ltafin = this.ltaini;
      factor_z = 0;
      this.recobon = 0;
      this.importecerrado = false;

    }
    if(this.tipopagosel == "C")  {
      this.importecerrado = true;
       iniconcep = "LETRA " 
    };
    if(this.tipopagosel == "S") {
      iniconcep = "SALDO ";
      this.ultltaoculto_z = true;
      this.ltafin = this.ltaini;
      factor_z = 0;
      this.recobon = 0;
      this.importecerrado = true;
    } 

    nuletxpag_z = Number(this.ltafin) -  Number(this.ltaini ) + 1;
    iniconcep += this.ltaini.padStart(2, ' ');
    if( Number(this.ltafin) != Number(this.ltaini) ) {
      iniconcep += " - " + this.ltafin.padStart(2, ' ');
      let prletconrec_z = this.calcula_bonif_o_rec(Number(this.ltaini));
      let ulletconrec_z = this.calcula_bonif_o_rec(Number(this.ltafin));
      if(prletconrec_z != ulletconrec_z) {
         this.alerta("No puede mezclar letras atrasadas y al día");
         //this.closeno();
      }

    }
    this.recargoscobrados = 0;
    const letra = Number(this.ltaini);
    const reccobrado = await this.ventasService.obtenerRecargosLetra(this.venta.idventa, letra );
    this.recargoscobrados  = reccobrado.recargos;
    console.log("X- letra", letra, "Recargoscobrados:", this.recargoscobrados);
    this.esconrec = false;
    if(this.dias > 5 ) {
      this.tipomovsel = 'R';
    } else {
      this.tipomovsel = 'B';
    }

    let recargo = Math.round (this.venta.canle * this.tasarecargo_z / 100);

    if(this.dias > 5 ) {
      this.esconrec = true;
      this.recobon = recargo * nuletxpag_z  - this.recargoscobrados;
      if(this.recobon < 0) this.recobon = 0;
      this.neto = this.importe + this.recobon;
      this.bonif_cerrada = true;
      factor_z = 1;
    }

    this.concepto = iniconcep + "/" + this.venta.nulets;
    if (this.tipopagosel == "C" || this.tipopagosel == "S" ) {
      if (this.tipopagosel == "C") {
        this.importe = this.venta.canle * nuletxpag_z;
      }

      if(this.dias > 5 ) {
        this.esconrec = true;
        this.recobon = Math.round (recargo * nuletxpag_z  ) - this.recargoscobrados;
        if(this.recobon < 0) this.recobon = 0;
        this.neto = this.importe + this.recobon;
        this.bonif_cerrada = true;
        factor_z = 1;

      } else {
        this.recobon = this.recobon * nuletxpag_z;
        this.neto = this.importe - this.recobon;
        factor_z = -1;
      }
    } else {
      this.importe = this.venta.canle * nuletxpag_z;
    }
    //this.importecobrado = this.neto;
    this.neto = this.importe + this.recobon * factor_z;
    this.calcula_bonif_extra();
    this.validarpago();
    this.recibido = this.neto;
    console.log("Saliendo de calculaConcepto", this.neto, "tipomovsel", this.tipomovsel);
  
  }
  
  define_bonif_abierta() {
    //this.validarpago();
    let bonifcliente = 0;
    if(this.venta) bonifcliente = this.venta.bonifi;
    let miltafin_z = Number(this.ltafin);
    //this.alerta("Tipo pago sel:" + this.tipopagosel_z + bonifcliente.toString());
    this.bonif_cerrada = true;
    if(this.tipopagosel == "A" || (this.tipopagosel == "S" && bonifcliente < 1 ) ) {
      this.bonif_cerrada = true;
    } else {
      if(this.conceptocompl == "CARTA" && (this.venta.nulets == miltafin_z)) {
        this.bonif_cerrada = false;
      }
    }
  }
    
 
  close() {
    this.confirma_aceptar_pago();
  }

  confirma_aceptar_pago() {
    const dialogref = this.dialog.open(DlgyesnoComponent, {
      width:'350px',
      data: 'Seguro de aceptar este Pago?'
    });
    let result = {}
    dialogref.afterClosed().subscribe(res => {
      //console.log("Debug", res);
      if(res) {
          let moroso = "SI";
          const letra = Number(this.ltaini)
          const fechavta = this.venta.fecha.substring(0,10);
          const vence = this.configService.calcula_venc(fechavta, this.venta.qom, letra);
          const strvence = this.configService.fecha_a_str(vence, "YYYY-mm-dd");
          const inicialescobrtario = this.cobratario.codigo;
          const idcobratario = this.cobratario.id;
          let tipo = 'AB';
          if(this.tipomovsel == 'R') tipo = 'AR';
          result = {
              idventa: this.venta.idventa,
              concepto: this.concepto,
              letraini: this.ltaini,
              letrafin: this.ltafin,
              ace: this.tipopagosel,
              tipo: tipo,
              dias: this.dias,
              importe: this.importe,
              recobon: this.recobon,
              vence: strvence,
              letra: letra,
              iduuid: -1,
              idfactura: -1,
              cia: this.configService.obtenNumeroCia(),
              idusuario: this.idusuario,
              comision: this.comision,
              cobratario: inicialescobrtario,
              idcobratario: idcobratario,
              siono: this.venta.siono,
              usuario: this.iniciales,
              salcli: this.venta.saldo - this.importe,
              conplazo: "this.conplazo",
              datosplazo: "this.datosplazo"
          }
        this.dialogRef.close( result);    
      } else {
        this.closeno();
      }
    });
  
  }
  
  closeno() {
    this.dialogRef.close(false);
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
