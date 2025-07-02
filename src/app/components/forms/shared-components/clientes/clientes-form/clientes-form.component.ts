import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { Message } from '@models/message';
import {  Router } from '@angular/router';
import { ClientesDto, ClienteDtoCompleto } from '@dtos/clientes.dto';
import { ComplementosService } from '@services/complementos.service';
import { ClientesService } from '@services/clientes.service';
import { Ciudades, Regimenes, } from '@models/index'
import { MatSelectChange } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.scss']
})

export class ClientesFormComponent extends Form<ClientesDto> implements OnChanges{
  @Output() public submitData: EventEmitter<ClientesDto>;
  @Input() public message: Message;
  @Input() public modo: string;
  @Input() public cliente: ClienteDtoCompleto;
  
  regimenes: Regimenes[] = [];
  ciudades: Ciudades[] = [];
  sololectura = false;
  titulo = "";
  debug = false;

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router,
    private complementosService: ComplementosService,
    private clientesService: ClientesService,
    private configService: ConfigService,
    private datePipe : DatePipe,

  ) {
    super();
    this.submitData = new EventEmitter<ClientesDto>();
    this.carga_catalogos();
    const fecha =  this.datePipe.transform(new Date(),"yyMMdd");
    const codigo = "27" + fecha + "99";
    const rfc = "XAXX010101000";
    this.titulo = "Teclee los Datos del Cliente";
    this.debug = this.configService.debug;

    this.form = this.builder.group({
      codigo : [codigo, [Validators.required]],
      appat: [""],
      apmat: [""],
      nompil1: [""],
      nompil2: [""],
      calle: [""],
      numpredio: [""],
      colonia:[""],
      codpostal: [""],
      ciudad: [""],
      telefono: [""],
      email: [""],
      regimen: [""],
      rfc: [rfc],
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
      this.form.get("codigo").enable();
    }
    console.log("Clientes form component Modo", this.modo);
    if(this.modo == "DETALLES") {
      this.titulo = "Detalles del Cliente";
    }

    if(this.modo == "EDIT" || this.modo == "DETALLES") {
        this.inicializaForm();
    }
     
      
    this.sololectura = (this.modo == "DETALLES");
    if(this.debug) console.log("clientesForm modo", this.modo, "Sololectura", this.sololectura);

  }

  inicializaForm() {
    //console.log("changed")
    if(this.debug) console.log("clientes-form Mi cliente", this.cliente);
    if(this.cliente) {
      this.form.get("codigo").setValue(this.cliente.codigo);
      this.form.get("calle").setValue(this.cliente.calle);
      this.form.get("numpredio").setValue(this.cliente.numpredio);
      this.form.get("colonia").setValue(this.cliente.colonia);
      this.form.get("ciudad").setValue(this.cliente.idciudad);
      this.form.get("rfc").setValue(this.cliente.rfc);
      this.form.get("codpostal").setValue(this.cliente.codpostal);
      this.form.get("telefono").setValue(this.cliente.telefono);
      this.form.get("regimen").setValue(this.cliente.idregimen);
      this.form.get("appat").setValue(this.cliente.appat);
      this.form.get("apmat").setValue(this.cliente.apmat);
      this.form.get("nompil1").setValue(this.cliente.nompil1);
      this.form.get("nompil2").setValue(this.cliente.nompil2);
      this.form.get("email").setValue(this.cliente.email);
      this.busca_nombres ();
    } else {
      const fecha =  this.datePipe.transform(new Date(),"yyMMdd");
      const codigo = "27" + fecha + "99";
      this.set_idregimen();
      const rfc = "XAXX010101000";
      this.form.get("codigo").setValue(codigo);
      this.form.get("rfc").setValue(rfc);
    }
  }

  set_idregimen() {
    if(this.cliente.idregimen == -1) {
      let idregimen = 0;
      const claveregimen = "616";
      const miregimen =  this.regimenes.filter(regimen => regimen.clave === claveregimen);
      if(miregimen.length) idregimen = miregimen[0].id;
      this.form.get("regimen").setValue(idregimen);

    }

  }

  carga_catalogos() {
    this.complementosService.obten_lista_regimenes().subscribe( res => {
      this.regimenes = res;
      this.set_idregimen();

    });

    this.complementosService.obten_lista_ciudades().subscribe( res => {
      this.ciudades = res;
    });

  }

  regimenSelectionChange(event: MatSelectChange) {
    this.regimen.setValue(event.value);
  } 

  ciudadSelectionChange (event: MatSelectChange) {
    this.ciudad.setValue(event.value);
  } 

  busca_nombres (  ) {
    let nombre = {
      appat: "",
      apmat: "",
      nompil1: "",
      nompil2: ""
   }
   
   const nombres = this.clientesService.obten_nombres(this.cliente.idnombre).subscribe( res => {
   if(this.debug)  console.log("Estoy en Clietes-form busca_nombres", res);

       nombre.appat = res.appat;
       nombre.apmat = res.apmat;
       nombre.nompil1 = res.nompil1;
       nombre.nompil2 = res.nompil2;
       this.form.get("appat").setValue(nombre.appat);
       this.form.get("apmat").setValue(nombre.apmat);
       this.form.get("nompil1").setValue(nombre.nompil1);
       this.form.get("nompil2").setValue(nombre.nompil2);

   });

  }

  get codigo(){
    return this.form.get("codigo");
  }


  get calle(){
    return this.form.get("calle");
  }

  get numpredio(){
    return this.form.get("numpredio");
  }

  get colonia(){
    return this.form.get("colonia");
  }


  get ciudad(){
    return this.form.get("ciudad");
  }

  get rfc(){
    return this.form.get("rfc");
  }

  get codpostal(){
    return this.form.get("codpostal");
  }

  get email(){
    return this.form.get("email");
  }

  get regimen(){
    return this.form.get("regimen");
  }

  get appat(){
    return this.form.get("appat");
  }

  get apmat(){
    return this.form.get("apmat");
  }
  
  get nompil1(){
    return this.form.get("nompil1");
  }
  
  get nompil2(){
    return this.form.get("nompil2");
  }
  
  aceptar() {
   if(this.debug) console.log("Hiciste click en aceptar");
   this.submitData.emit(this.form.value);
  }

  close() {
    if(this.debug) console.log("Hiciste click en Cancelar");
    this.submitData.emit(null);
  }

}