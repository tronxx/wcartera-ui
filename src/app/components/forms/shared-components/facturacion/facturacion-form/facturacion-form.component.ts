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


@Component({
  selector: 'app-facturacion-form',
  templateUrl: './facturacion-form.component.html',
  styleUrls: ['./facturacion-form.component.scss']
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

    //this.inicializaForm();
  }

  inicializaForm() {
    console.log("valor Inicla de Factura", this.factura);
    if(this.factura) {
      this.serie.setValue(this.factura.serie);
      this.numero.setValue(this.factura.numero);
      this.fecha.setValue(this.factura.fecha);
      this.usocfdi.setValue(this.factura.idusocfdi);
      this.metodopago.setValue(this.factura.idmetodopago);
    } else {
      const fecha =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      this.set_idusocfdi();
      this.set_metodopago();
      this.fecha.setValue(fecha);
    }
    if(this.modo == "NUEVAFACTURA") {
      this.serie.setValue(this.serieini);
      const ultimofolio = this.buscaUltimoFolioFactura();
      this.numero.setValue(ultimofolio);
    }
  }

  set_idusocfdi() {
    if(!this.factura) {
      let idusocfdi = 0;
      const claveusocfdi = "G03";
      const miusocfdi =  this.usoscfdi.filter(usocfdi => usocfdi.clave === claveusocfdi);
      if(miusocfdi.length) {
        idusocfdi = miusocfdi[0].id;
        this.usocfdi.setValue(idusocfdi);
        this.claveusocfdi.setValue(miusocfdi[0].clave + " " + miusocfdi[0].nombre)

      }

    }

  }

  set_metodopago() {
    if(!this.factura) {
      let idmetodopago = 0;
      const clavemetodopago = "01";
      const mimetodopago =  this.metodospago.filter(metodopago => metodopago.clave === clavemetodopago);
      if(mimetodopago.length) {
        idmetodopago = mimetodopago[0].id;
        this.form.get("metodopago").setValue(idmetodopago);
        this.form.get("clavemetodopago").setValue(mimetodopago[0].clave + " " + mimetodopago[0].nombre)
      }

    }

  }

  carga_catalogos() {
    this.complementosService.obten_lista_usocfdi().subscribe( res => {
      this.usoscfdi = res;

    });
    this.complementosService.obten_lista_metodopago().subscribe( res => {
      this.metodospago = res;
    });
  }

  usocfdichanged (event: MatSelectChange) {
    this.usocfdi.setValue(event.value);
    const idusocfdi = event.value;
    const miusocfdi =  this.usoscfdi.filter(usocfdi => usocfdi.id === idusocfdi);
    if(miusocfdi.length) {
      this.form.get("claveusocfdi").setValue(miusocfdi[0].clave + " " + miusocfdi[0].nombre)
    }

  } 
  
  metodopagochanged (event: MatSelectChange) {
    const clavemetodopago = event.value;
    this.metodopago.setValue(event.value);
    const mimetodopago =  this.metodospago.filter(metodopago => metodopago.id === clavemetodopago);
    if(mimetodopago.length) {
      this.clavemetodopago.setValue(mimetodopago[0].clave + " " + mimetodopago[0].nombre)
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


  buscaUltimoFolioFactura(){
    const serie = this.serie.value;
    let folio = 1;
    this.facturasservice.buscarUltimoFolio(serie).subscribe(
      respu => {
        folio = respu.ultimo || 0;
        folio++;
        this.factura.numero = folio;
        this.numero.setValue(this.factura.numero);
      }
    );
    return (folio);

  }

  aceptar() {
    //console.log("Hiciste click en aceptar");
    this.submitData.emit(this.form.value);
    
  }

}
