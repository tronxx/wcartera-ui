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


@Component({
  selector: 'app-dlgpagos',
  templateUrl: './dlgpagos.component.html',
  styleUrls: ['./dlgpagos.component.scss']
})
export class DlgpagosComponent implements OnInit {

  venta?: VentasCompletas;
  public vencimientos: Vencimientos[] = [];
  yatengovencimientos = false;
  cobratario: Promotores;
  comxlet = 0;
  comxrec = 0;
  compra = "";
  idpoliza = 0;
  errores = "";
  esmoroso = false;
  comision = 0;
  importe = 0;
  recobon = 0;
  bonifi = 0;
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
  tipomovsel = "";
  recargo = 0;
  fechaactual = new Date();
  tipomovcerrado = false;
  msgsigpago = "";

  tipospagos =[ 
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
    this.venta = datosiniciales.venta;
    this.compra = datosiniciales.compra;  
    this.idpoliza = datosiniciales.idpoliza;
    this.vencimientos = datosiniciales.vencimientos;
    this.yatengovencimientos = true;
    this.calcula_siguiente_pago();
    //console.log("vencimientos", this.vencimientos)
    
  }

  calcula_siguiente_pago() {
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
    const totabonos = abonos + enganche + servicio;
    let msg = "";
    if(canle) {
      letraspagadas = Math.floor ((abonos - enganche - servicio) / canle);
    }
    const sigpago = letraspagadas * canle + enganche + servicio;
    if(sigpago == totabonos ) {
      sigletra = letraspagadas + 1;
      importexpagar = canle;
      msg = "Debe Pagar la letra " + sigletra;
      this.activartipomov(["A", "C"]);
    } else {
      sigletra = letraspagadas;
      importexpagar = canle - (totabonos - (canle * letraspagadas + enganche + servicio))
      msg = "Debe Pagar Saldo " + sigletra +  "/" + 
      this.activartipomov(["S"]);
      this.venta.nulets  + " por " +  formatCurrency ( Number(importexpagar) , 'en-US', '$');
    }
    let ii_z = 0;
    let importevencido = 0;
    let recargo = 0;
    const minumlet_z = sigletra.toString();
    this.listaletras = []
    this.listaletras.push(minumlet_z);
    for (ii_z = sigletra + 1 ; ii_z <= nulets; ii_z++) {
      const minumlet_z = ii_z.toString();
      this.listaletras.push(minumlet_z);
      
      if(this.vencimientos[ii_z - 1].vencido) {
         importevencido += canle;
         recargo += Math.round (canle * this.tasarecargo_z / 100);
      }
    }
    const primerletra = Number(this.ltaini)
    const fecven = this.vencimientos[primerletra].fecven;
    const fmax =  this.configService.SumaDiasaFecha(new Date(), -5);
    console.log("fecven", fecven, "type", typeof(fecven), "fmax", fmax);
    //const fehavenstr = this.configService.fecha_a_str(fecven, "YYYYmmdd")
    const fechamax = this.configService.fecha_a_str(fmax, "YYYYmmdd");


    importexpagar += importevencido;
    this.ltaini = sigletra.toString();
    this.ltafin = this.ltaini;
    this.calculaConcepto();

  }

  calculaNeto() {
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
    const tipomovsel_z = "R";
    if(this.cobratario) {
      comxlet_z = this.comxlet;
      comxrec_z = this.comxrec;
    }
    if(this.esmoroso && tipomovsel_z == "R") {
        this.comision = Math.round( this.importe * comxlet_z ) / 100;
    }
  }
  
  
  errorespago() {
    this.errores = "";
    return false;
  }

  tipomovSelectionChange(event: MatSelectChange) {
    this.sel_tipopago();
  } 
  

  
  sel_tipopago() {
    let numerodeletras_z = Number(this.ltafin) - Number (this.ltaini) + 1;
    if(this.tipomovsel == "N") {
      this.recobon = 0;
      this.bonif_cerrada = true;
    } else if (this.tipomovsel == "R") {
      this.recargo = Math.round( this.venta.canle * this.tasarecargo_z / 100);
      this.recobon = this.recargo * numerodeletras_z;
      //this.bonif_cerrada = false;
    } else {
      let conrec_z = this.calcula_bonif_o_rec(Number(this.ltaini));
      if(conrec_z == "R") {
        this.recobon = this.recargo * numerodeletras_z;
        //this.bonif_cerrada = false;
        this.tipomovsel = "R";
      } else {
        this.recobon = this.recobon * numerodeletras_z;
      }
      
    }
    if(this.venta.bonifi > 0 )  this.bonif_cerrada = false; else this.bonif_cerrada = true; 
    // this.alerta("Bonificacion del Cliente:" + this.bonifi_z.toString() + " Bonif Cerrada:" + this.bonif_cerrada);
    //this.sigletra_z = Number (this.datospago.ltaini);
    this.calculaNeto();
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
    let dias_z = 0;
    let mivenc_z = new Date();
      mivenc_z = this.configService.calcula_venc(this.venta.fecha, this.venta.qom, miletra_z);
      dias_z = Math.floor( ( this.fechaactual.getTime() - mivenc_z.getTime()  ) / (86400000));
      //console.log("Debug: dias", this.datospago.dias, " Hoy:", this.fechahoy_z.getTime(), " Vence:", this.vence_z.getTime() );
      if(dias_z > this.diasbon ) {
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
    if(this.tipopagosel == "A") {
      iniconcep = "ACTA ";
      this.ultltaoculto_z = true;
      this.ltafin = this.ltaini;
      factor_z = 0;
      this.recobon = 0;
      if(this.bonifi < 1) {
        this.bonif_cerrada = true;
      }

    }
    if(this.tipopagosel == "C") iniconcep = "LETRA ";
    if(this.tipopagosel == "S") iniconcep = "SALDO ";


    this.concepto = iniconcep + this.ltaini;
    if(this.ltafin > this.ltaini) {
       this.concepto += " - " + this.ltafin 
    }
    this.concepto += "/" +
      this.venta.nulets;
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
    this.dialogRef.close(true);
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
