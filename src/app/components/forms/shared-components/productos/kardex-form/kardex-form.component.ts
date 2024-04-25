import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { KardexDto } from '@dtos/kardex-dto';
import { Message } from '@models/message';
import {  Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-kardex-form',
  templateUrl: './kardex-form.component.html',
  styleUrls: ['./kardex-form.component.scss']
})

export class KardexFormComponent extends Form<KardexDto> implements OnChanges{
  @Output() public submitData: EventEmitter<KardexDto>;
  @Input() public message: Message;
  @Input() public kardexmov: KardexDto;
  pedirserie = false;

  constructor(
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    private dateAdapter: DateAdapter<Date>,
    public router: Router

  ) {
    super();
    //this.dateAdapter.setLocale('es'); 
    //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.submitData = new EventEmitter<KardexDto>();
    this.form = this.builder.group({
      fecha : ["", [Validators.required]],
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
    //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    const strhoy =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
    console.log ("Fecha de Hoy ", strhoy);
    let datosprodducto = JSON.parse(this.message.message);
    if (datosprodducto.tipo == "ALF") this.pedirserie =true;
    let ultimofolio = datosprodducto.ultimofolio;

    this.form.get("fecha").setValue(strhoy);
    this.form.get("folio").setValue(ultimofolio);
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

  closeno() {
    console.log("Hiciste click en Cancelar");
    this.submitData.emit(null);

  }


}
