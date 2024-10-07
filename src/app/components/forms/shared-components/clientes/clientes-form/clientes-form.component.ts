import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { Message } from '@models/message';
import {  Router } from '@angular/router';
import { ClientesDto } from '@dtos/clientes.dto';
import { ComplementosService } from '@services/complementos.service';
import { ClientesService } from '@services/clientes.service';
import { Ciudades, Regimenes, } from '@models/index'
import { MatSelectChange } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.scss']
})

export class ClientesFormComponent extends Form<ClientesDto> implements OnChanges{
  @Output() public submitData: EventEmitter<ClientesDto>;
  @Input() public message: Message;
  @Input() public modo: string;
  @Input() public cliente: ClientesDto;
  
  regimenes: Regimenes[] = [];
  ciudades: Ciudades[] = [];
  sololectura = false;

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router,
    private complementosService: ComplementosService,
    private clientesService: ClientesService,
    private datePipe : DatePipe,

  ) {
    super();
    this.submitData = new EventEmitter<ClientesDto>();
    this.carga_catalogos();
    this.form = this.builder.group({
      codigo : ["", [Validators.required]],
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
      rfc: [""],
    });

    this.inicializaForm();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
      this.form.get("codigo").enable();
    }
    this.inicializaForm();
    this.sololectura = (this.modo == "DETALLES");
    console.log("clientesForm modo", this.modo, "Sololectura", this.sololectura);

  }

  inicializaForm() {
    //console.log("changed")
    console.log("clientes-form Mi cliente", this.cliente);
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
      this.form.get("appat").setValue("Apellido Paterno");
      this.form.get("apmat").setValue("Apellido Materno");
      this.form.get("nompil1").setValue("nombre 1");
      this.form.get("nompil2").setValue("nombre 2");
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
    if(!this.cliente) {
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
      nombre1: "",
      nombre2: ""
   }
   
   const nombres = this.clientesService.obten_nombres(this.cliente.idnombre).subscribe( res => {
       nombre.appat = res.appat;
       nombre.apmat = res.apmat;
       nombre.nombre1 = res.nombre1;
       nombre.nombre2 = res.nombre2;
       this.form.get("appat").setValue(nombre.appat);
       this.form.get("apmat").setValue(nombre.apmat);
       this.form.get("nompil1").setValue(nombre.nombre1);
       this.form.get("nompil2").setValue(nombre.nombre2);

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
    //console.log("Hiciste click en aceptar");
    this.submitData.emit(this.form.value);
    
  }

  close() {
    //console.log("Hiciste click en aceptar");
    this.submitData.emit();
    
  }

}