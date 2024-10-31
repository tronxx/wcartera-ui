import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { Message } from '@models/message';
import { Router } from '@angular/router';
import { FacturasDto } from '@dtos/facturas.dto';
import { SolcitudExtendida } from '@dtos/solicitud-dto';
import { FacturacionService } from '@services/facturacion.service';
import { ComplementosService } from '@services/complementos.service';
import { ConfigService } from '@services/config.service';
import { Usocfdi, Metodopago } from '@models/index'
import { MatSelectChange } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss']
})

export class SolicitudFormComponent 
extends Form<SolcitudExtendida> implements OnChanges{
  @Output() public submitData: EventEmitter<SolcitudExtendida>;
  @Input() public message: Message;
  @Input() public factura: FacturasDto;
  @Input() public inicial: string;

  usoscfdi: Usocfdi[] = [];
  metodospago: Metodopago[] = [];
  modo = "";
  serieini = "";
  sexos = [
    {clave:"M", descri:"Masculino"},
    {clave:"F", descri:"Femenino"}

  ]
  
  edoscivil = [
    {clave:"S", descri:"Soltero"},
    {clave:"C", descri:"Casado"}
  ]

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router,
    private complementosService: ComplementosService,
    private facturasservice: FacturacionService,
    private configService: ConfigService,
    private datePipe : DatePipe,

  ) {
    super();
    this.submitData = new EventEmitter<SolcitudExtendida>();
    if(this.inicial) {
      const datosiniciales = JSON.parse(this.inicial);
      this.modo = datosiniciales.modo;
      this.serieini = datosiniciales.serie;
    }
    this.sexos = this.configService.obtenTiposClientesyQOM("Sexos");
    this.edoscivil = this.configService.obtenTiposClientesyQOM("EdosCivil");
    console.log("iniciales:", this.inicial);
    this.carga_catalogos();
    this.form = this.builder.group({
      ocupacion : [""],
      ingresos: [""],
      sexo: [""],
      edad: [""],
      edocivil: [""],
      clientelugartrabajo: [""],
      clienteteltrabajo: [""],
      clientedirectrabajo: [""],
      clienteantiguedadtrabajo: [""],
      clienteconyugenombre: [""],
      clienteconyugeocupacion: [""],
      clienteconyugeteltrabajo: [""],
      clienteconyugeantiguedad: [""],
      avalgenerales:[""],
      avalocupacion:[""],
      avaltelefono:[""],
      avalantiguedad:[""],
      avaltrabajo:[""],
      avalconyugenombre: [""],
      avalconyugeocupacion: [""],
      avalconyugeingresos: [""],
      avalconyugetrabajo: [""],
      avalconyugeantiguedad: [""],
      avalconyugeatelefono: [""],
      familiarnombre:[""],
      familiardirec:[""],
      conocidonombre:[""],
      conocidodirec:[""],
      referencia1:[""],
      referencia2:[""],
      observaciones:[""]
    });
    this.inicializaForm();

  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.inicializaForm();
  }

  get ocupacion(){ return this.form.get("ocupacion");  }
  get ingresos(){ return this.form.get("ingresos");  }
  get sexo(){   return this.form.get("sexo");  }
  get edocivil(){    return this.form.get("edocivil");  }
  get clientelugartrabajo(){    return this.form.get("clientelugartrabajo");  }
  get clienteteltrabajo(){    return this.form.get("clienteteltrabajo");  }
  get clientedirectrabajo(){    return this.form.get("clientedirectrabajo");  }
  get clienteantiguedadtrabajo(){    return this.form.get("clienteantiguedadtrabajo");  }
  get clienteconyugenombre(){    return this.form.get("clienteconyugenombre");  }
  get clienteconyugeocupacion(){    return this.form.get("clienteconyugeocupacion");  }
  get clienteconyugeteltrabajo(){    return this.form.get("clienteconyugeteltrabajo");  }
  get clienteconyugeantiguedad(){    return this.form.get("clienteconyugeantiguedad");  }
  get avalgenerales(){    return this.form.get("avalgenerales");  }
  get avalocupacion(){    return this.form.get("avalocupacion");  }
  get avaltelefono(){    return this.form.get("avaltelefono");  }
  get avalantiguedad(){    return this.form.get("avalantiguedad");  }
  get avaltrabajo(){    return this.form.get("avaltrabajo");  }
  get avalconyugenombre(){    return this.form.get("avalconyugenombre");  }
  get avalconyugeocupacion(){    return this.form.get("avalconyugeocupacion");  }
  get avalconyugeingresos(){    return this.form.get("avalconyugeingresos");  }
  get avalconyugetrabajo(){    return this.form.get("avalconyugetrabajo");  }
  get avalconyugeantiguedad(){    return this.form.get("avalconyugeantiguedad");  }
  get avalconyugeatelefono(){    return this.form.get("avalconyugeatelefono");  }
  get familiarnombre(){    return this.form.get("familiarnombre");  }
  get familiardirec () { return this.form.get("familiardirec")};
  get conocidonombre () { return this.form.get("conocidonombre")};
  get conocidodirec () { return this.form.get("conocidodirec")};
  get referencia1 () { return this.form.get("referencia1")};
  get referencia2 () { return this.form.get("referencia2")};
  get observaciones () { return this.form.get("observaciones")};


  inicializaForm() {
  }

  carga_catalogos() {
  }

  
  buscaUltimoFolioFactura(){
  
  }

  closeno() {

  }

  aceptar() {
    //console.log("Hiciste click en aceptar");
    this.submitData.emit(this.form.value);
    
  }


}
