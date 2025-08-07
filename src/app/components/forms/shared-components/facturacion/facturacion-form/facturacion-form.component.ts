import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { Message } from '@models/message';
import { Router } from '@angular/router';
import { FacturasDto } from '@dtos/facturas.dto';
import { FacturacionService } from '@services/facturacion.service';
import { ComplementosService } from '@services/complementos.service';
import { Usocfdi, Metodopago } from '@models/index'
import { MatSelectChange } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from '../../custom-date-adapter/custom-date-adapter.component';

// Define custom date format
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-facturacion-form',
  templateUrl: './facturacion-form.component.html',
  styleUrls: ['./facturacion-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }
  ]

})

export class FacturacionFormComponent extends Form<FacturasDto> implements OnChanges{
  @Output() public submitData: EventEmitter<FacturasDto>;
  @Input() public message: Message;
  @Input() public factura: FacturasDto;
  @Input() public inicial: string;

  usoscfdi: Usocfdi[] = [];
  metodospago: Metodopago[] = [];
  modo = "";
  serieini = "";
  primeravez = true;
  

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router,
    private complementosService: ComplementosService,
    private facturasservice: FacturacionService,
    private datePipe : DatePipe,

  ) {
    super();
    this.submitData = new EventEmitter<FacturasDto>();
    this.carga_catalogos();
    this.form = this.builder.group({
      serie : ["", [Validators.required]],
      numero: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
      usocfdi: ["", [Validators.required]],
      claveusocfdi:[""],
      metodopago: ["", [Validators.required]],
      clavemetodopago:[""],
    });
    this.inicializaForm();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
      this.form.get("codigo").enable();
    }
    if(this.primeravez && this.inicial) {
      const datosiniciales = JSON.parse(this.inicial);
      this.modo = datosiniciales.modo;
      this.serieini = datosiniciales.serie;
      this.serie.setValue(this.serieini);
      const ultimofolio = this.buscaUltimoFolioFactura();
      this.numero.setValue(ultimofolio);
      console.log("iniciales:", this.inicial);
    }

    this.inicializaForm();
  }

  async inicializaForm() {
    console.log("valor Inicial de Factura", this.factura);
    const catalogos = await this.carga_catalogos();
    if(this.factura) {
      this.serie.setValue(this.factura.serie);
      this.numero.setValue(this.factura.numero);
      
      // Convert string date to Date object properly
      this.fecha.setValue(this.factura.fecha ? new Date(this.factura.fecha) : null);
      
      this.usocfdi.setValue(this.factura.idusocfdi);
      this.metodopago.setValue(this.factura.idmetodopago);
    } else {
      const fechaActual = new Date();
      this.fecha.setValue(fechaActual);
    }
    if(this.modo == "NUEVAFACTURA") {
      this.serie.setValue(this.serieini);
      const ultimofolio = this.buscaUltimoFolioFactura();
      this.numero.setValue(ultimofolio);
    }
    this.set_idusocfdi();
    this.set_metodopago();
}

  set_idusocfdi() {
    if(!this.factura || this.factura.idusocfdi == -1) {
      let idusocfdi = 0;
      const claveusocfdi = "G03";
      const miusocfdi =  this.usoscfdi.find(usocfdi => usocfdi.clave === claveusocfdi);
      idusocfdi = miusocfdi.id;
      this.usocfdi.setValue(idusocfdi);
      this.claveusocfdi.setValue(miusocfdi.clave + " " + miusocfdi.nombre)
    }

  }

  set_metodopago() {
    if(!this.factura || this.factura.idmetodopago == -1) {
      let idmetodopago = 0;
      const clavemetodopago = "01";
      const mimetodopago = this.metodospago.find(metodopago  => metodopago.clave === clavemetodopago);
      idmetodopago = mimetodopago.id;
      this.metodopago.setValue(idmetodopago);
      this.clavemetodopago.setValue(mimetodopago.clave + " " + mimetodopago.nombre)
    }

  }

  async carga_catalogos() {
    this.usoscfdi = await lastValueFrom(this.complementosService.obten_lista_usocfdi());
    this.metodospago = await lastValueFrom(this.complementosService.obten_lista_metodopago());
    // console.log("Estoy en carga_catalogos", "usoscfdi", this.usoscfdi, "MetodosPago", this.metodospago);
    return ({status:"OK"});
  }

  usocfdichanged (event: MatSelectChange) {
    this.usocfdi.setValue(event.value);
    const idusocfdi = event.value;
    const miusocfdi =  this.usoscfdi.find(usocfdi => usocfdi.id === idusocfdi);
    if(miusocfdi) {
      this.form.get("claveusocfdi").setValue(miusocfdi.clave + " " + miusocfdi.nombre)
    }

  } 
  
  metodopagochanged (event: MatSelectChange) {
    const clavemetodopago = event.value;
    this.metodopago.setValue(event.value);
    const mimetodopago =  this.metodospago.find(metodopago => metodopago.id === clavemetodopago);
    if(mimetodopago) {
      this.clavemetodopago.setValue(mimetodopago.clave + " " + mimetodopago.nombre)
    }

  } 

  
  checaserie() {
    const serie = this.serie.value;
    if(this.serieini != serie) {
      this.serieini = serie;
      this.buscaUltimoFolioFactura();
    }
  }

  get serie(){
    return this.form.get("serie");
  }

  get numero(){
    return this.form.get("numero");
  }

  get fecha(){
    return this.form.get("fecha");
  }

  get usocfdi(){
    return this.form.get("usocfdi");
  }

  get metodopago(){
    return this.form.get("metodopago");
  }

  get claveusocfdi(){
    return this.form.get("claveusocfdi");
  }

  get clavemetodopago(){
    return this.form.get("clavemetodopago");
  }


  async buscaUltimoFolioFactura(){
    const serie = this.serie.value;
    let folio = 1;
    const ultimofolio = await lastValueFrom(this.facturasservice.buscarUltimoFolio(serie));
    folio = ultimofolio.ultimo || 0;
    folio++;
    this.factura.numero = folio;
    this.numero.setValue(this.factura.numero);
    return (folio);

  }

  aceptar() {
    //console.log("Hiciste click en aceptar");
    this.submitData.emit(this.form.value);
    
  }

}
