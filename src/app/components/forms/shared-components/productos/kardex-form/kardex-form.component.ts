import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { KardexDto } from '@dtos/kardex-dto';
import { Message } from '@models/message';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-kardex-form',
  templateUrl: './kardex-form.component.html',
  styleUrls: ['./kardex-form.component.scss']
})

export class KardexFormComponent extends Form<KardexDto> implements OnChanges{
  @Output() public submitData: EventEmitter<KardexDto>;
  @Input() public message: Message;
  @Input() public kardexmov: KardexDto;

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router

  ) {
    super();
    this.submitData = new EventEmitter<KardexDto>();
    const strhoy_z = "20-04-2024";
    this.form = this.builder.group({
      fecha : [strhoy_z, [Validators.required]],
      docto: ["", [Validators.required]],
      folio: ["", [Validators.required]],
      serie: [""],
      descri: [""],

    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
//      this.form.get("clave").enable();
//      this.form.get("nombre").enable();
    }
    this.inicializaForm();
  }

  inicializaForm() {
    console.log("changed")
    this.form.get("fecha").setValue("");
    this.form.get("folio").setValue(1);
    this.form.get("docto").setValue(1);
    this.form.get("serie").setValue("");
    this.form.get("descri").setValue("");

  }

  get fecha(){
    return this.form.get("fecha");
  }

  get folio(){
    return this.form.get("folio");
  }

  get docto(){
    return this.form.get("docto");
  }

  get serie(){
    return this.form.get("serie");
  }

  get descri(){
    return this.form.get("descri");
  }

  aceptar() {
    console.log("Hiciste click en aceptar");
    this.submitData.emit(this.form.value);
    
  }


}
