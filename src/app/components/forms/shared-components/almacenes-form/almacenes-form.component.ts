import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { AlmacenesDto } from '@dtos/almacenes-dto';
import { Message } from '@models/message';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-almacenes-form',
  templateUrl: './almacenes-form.component.html',
  styleUrls: ['./almacenes-form.component.scss']
})

export class AlmacenesFormComponent extends Form<AlmacenesDto> implements OnChanges{
  @Output() public submitData: EventEmitter<AlmacenesDto>;
  @Input() public message: Message;
  @Input() public almacen: AlmacenesDto;

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router

  ) {
    super();
    this.submitData = new EventEmitter<AlmacenesDto>();
    this.form = this.builder.group({
      clave : ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      direc: [""],
      ciudad: [""],
      estado: [""],

    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
      this.form.get("clave").enable();
      this.form.get("nombre").enable();
    }
    this.inicializaForm();
  }

  inicializaForm() {
    console.log("changed")
    this.form.get("clave").setValue(this.almacen.clave);
    this.form.get("nombre").setValue(this.almacen.nombre);
    this.form.get("direc").setValue(this.almacen.direc);
    this.form.get("ciudad").setValue(this.almacen.ciudad);
    this.form.get("estado").setValue(this.almacen.estado);

  }

  get clave(){
    return this.form.get("clave");
  }

  get nombre(){
    return this.form.get("nombre");
  }

  get direc(){
    return this.form.get("direc");
  }

  get ciudad(){
    return this.form.get("ciudad");
  }

  get estado(){
    return this.form.get("estado");
  }

  aceptar() {
    //console.log("Hiciste click en aceptar");
    this.submitData.emit(this.form.value);
    
  }


}