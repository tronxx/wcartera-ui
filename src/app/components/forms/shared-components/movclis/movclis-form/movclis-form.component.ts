import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { MovclisDto } from '@dtos/movclis.dto';
import { Promotores } from '@models/promotores';
import { Message } from '@models/message';
import {  Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { lastValueFrom } from 'rxjs';
import { VentasService } from '@services/ventas.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-movclis-form',
  templateUrl: './movclis-form.component.html',
  styleUrls: ['./movclis-form.component.scss']
})
export class MovclisFormComponent extends Form<MovclisDto> implements OnChanges {
  @Output() public submitData: EventEmitter<MovclisDto>;
  @Input() public message: Message;
  @Input() public movcli: any;

  tipos = ["AB", "AR"];
  promotores: Promotores[] = [];
  promotor?: Promotores = null;
  
  constructor(
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    private dateAdapter: DateAdapter<Date>,
    private ventasService: VentasService,
    public router: Router
  ) {
    super();
    this.submitData = new EventEmitter<MovclisDto>();
    this.carga_catalogos();

    this.form = this.builder.group({
      fecha : ["", [Validators.required]],
      concepto: ["", [Validators.required]],
      tipo: ["", [Validators.required]],
      cobratario: ["", [Validators.required]],
      recobon: [0],
      importe: [0, [Validators.required]],
    });
  }

  get fecha(){
    return this.form.get("fecha");
  }

  get concepto(){
    return this.form.get("concepto");
  }

  get tipo(){
    return this.form.get("tipo");
  }

  get cobratario(){
    return this.form.get("cobratario");
  }

  get recobon(){
    return this.form.get("recobon");
  }

  get importe(){
    return this.form.get("importe");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
    }
    this.inicializaForm();
  }

  async carga_catalogos() {
        this.promotores = await  lastValueFrom(this.ventasService.buscarPromotores());
        return ({status:"OK"});
  }

  inicializaForm() {
    const strhoy =  this.datePipe.transform(new Date(),"yyyy-MM-ddThh:mm");
    let movto = JSON.parse(this.message.message);
    this.form.get("fecha").setValue(movto.fecha);
    this.form.get("concepto").setValue(movto.concepto);
    this.form.get("tipo").setValue(movto.tipo);
    this.form.get("cobratario").setValue(movto.cobratario);
    this.form.get("recobon").setValue(movto.recobon);
    this.form.get("importe").setValue(movto.importe);
  }

  esab() {
    return (this.tipo.value == "AB");
  }

  esrec() {
    return (this.tipo.value == "AR");
  }

  set_cobrtarario() {
     this.cobratario.setValue(this.cobratario);
  }


  aceptar() {
    this.submitData.emit(this.form.value);
   
  }

  promotorChanged (event: MatSelectChange) {
    this.cobratario.setValue(event.value);
    const idpromotor = event.value;
  } 


  closeno() {
    //console.log("Hiciste click en Cancelar");
    this.submitData.emit(null);

  }


}
