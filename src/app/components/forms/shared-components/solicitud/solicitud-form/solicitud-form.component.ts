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
  @Input() public solicitudextendida: SolcitudExtendida;
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
    this.sexos = this.configService.obtenTiposClientesyQOM("Sexos");
    this.edoscivil = this.configService.obtenTiposClientesyQOM("EdosCivil");
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
      clienteconyugetrabajo: [""],
      clienteconyugeteltrabajo: [""],
      clienteconyugeantiguedad: [""],
      clienteconyugedirectrabajo:[""],
      avalgenerales:[""],
      avalocupacion:[""],
      avaltelefono:[""],
      avalantiguedad:[""],
      avaltrabajo:[""],
      avalconyugenombre: [""],
      avalconyugeocupacion: [""],
      avalconyugeingresos: [""],
      avalconyugetrabajo: [""],
      avalconyugedirectrabajo:[""],
      avalconyugeantiguedad: [""],
      avalconyugetelefono: [""],
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
    this.observaciones.setValue("Observaciones Iniciales");
    console.log("ngOnchanges iniciales:", this.inicial);
    if(this.inicial) {
      const datosiniciales = JSON.parse(this.inicial);
      this.modo = datosiniciales.modo;
      this.asignadatosIniciales();
    }

  }

  asignadatosIniciales() {
    console.log("asignadatosIniciales Solicitud Extendida", this.solicitudextendida);
    this.ocupacion.setValue(this.solicitudextendida.ocupacion);
    this.ingresos.setValue(this.solicitudextendida.ingresos);
    this.sexo.setValue(this.solicitudextendida.sexo);
    this.edocivil.setValue(this.solicitudextendida.edocivil);
    this.edad.setValue(this.solicitudextendida.edad);
    this.clientelugartrabajo.setValue(this.solicitudextendida.clientelugartrabajo);
    this.clienteteltrabajo.setValue(this.solicitudextendida.clienteteltrabajo);
    this.clientedirectrabajo.setValue(this.solicitudextendida.clientedirectrabajo);
    this.clienteantiguedadtrabajo.setValue(this.solicitudextendida.clienteantiguedadtrabajo);
    this.clienteconyugenombre.setValue(this.solicitudextendida.clienteconyugenombre);
    this.clienteconyugeocupacion.setValue(this.solicitudextendida.clienteconyugeocupacion);
    this.clienteconyugetrabajo.setValue(this.solicitudextendida.clienteconyugetrabajo);
    this.clienteconyugedirectrabajo.setValue(this.solicitudextendida.clienteconyugedirectrabajo);

    this.clienteconyugeteltrabajo.setValue(this.solicitudextendida.clienteconyugeteltrabajo);
    this.clienteconyugeantiguedad.setValue(this.solicitudextendida.clienteconyugeantiguedad);
    this.avalgenerales.setValue(this.solicitudextendida.avalgenerales);
    this.avalocupacion.setValue(this.solicitudextendida.avalocupacion);
    this.avaltelefono.setValue(this.solicitudextendida.avaltelefono);
    this.avalantiguedad.setValue(this.solicitudextendida.avalantiguedad);
    this.avaltrabajo.setValue(this.solicitudextendida.avaltrabajo);
    this.avalconyugenombre.setValue(this.solicitudextendida.avalconyugenombre);
    this.avalconyugeocupacion.setValue(this.solicitudextendida.avalconyugeocupacion);
    this.avalconyugeingresos.setValue(this.solicitudextendida.avalconyugeingresos);
    this.avalconyugetrabajo.setValue(this.solicitudextendida.avalconyugetrabajo);
    this.avalconyugedirectrabajo.setValue(this.solicitudextendida.avalconyugedirectrabajo);
    this.avalconyugeantiguedad.setValue(this.solicitudextendida.avalconyugeantiguedad);
    this.avalconyugetelefono.setValue(this.solicitudextendida.avalconyugetelefono);
    this.familiarnombre.setValue(this.solicitudextendida.familiarnombre);
    this.familiardirec.setValue(this.solicitudextendida.familiardirec);
    this.conocidonombre.setValue(this.solicitudextendida.conocidonombre);
    this.conocidodirec.setValue(this.solicitudextendida.conocidodirec);
    this.referencia1.setValue(this.solicitudextendida.referencia1);
    this.referencia2.setValue(this.solicitudextendida.referencia2);
    this.observaciones.setValue(this.solicitudextendida.observaciones);

  }

  get ocupacion(){ return this.form.get("ocupacion");  }
  get ingresos(){ return this.form.get("ingresos");  }
  get sexo(){   return this.form.get("sexo");  }
  get edad(){   return this.form.get("edad");  }
  get edocivil(){    return this.form.get("edocivil");  }
  get clientelugartrabajo(){    return this.form.get("clientelugartrabajo");  }
  get clienteteltrabajo(){    return this.form.get("clienteteltrabajo");  }
  get clientedirectrabajo(){    return this.form.get("clientedirectrabajo");  }
  get clienteantiguedadtrabajo(){    return this.form.get("clienteantiguedadtrabajo");  }
  get clienteconyugenombre(){    return this.form.get("clienteconyugenombre");  }
  get clienteconyugeocupacion(){    return this.form.get("clienteconyugeocupacion");  }
  get clienteconyugeteltrabajo(){    return this.form.get("clienteconyugeteltrabajo");  }
  get clienteconyugetrabajo(){    return this.form.get("clienteconyugetrabajo");  }
  get clienteconyugedirectrabajo(){    return this.form.get("clienteconyugedirectrabajo");  }
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
  get avalconyugedirectrabajo(){    return this.form.get("avalconyugedirectrabajo");  }
  get avalconyugeantiguedad(){    return this.form.get("avalconyugeantiguedad");  }
  get avalconyugetelefono(){    return this.form.get("avalconyugetelefono");  }
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
    console.log("aceptar en solicitud-form.component");
    this.submitData.emit(this.form.value);
    
  }


}
