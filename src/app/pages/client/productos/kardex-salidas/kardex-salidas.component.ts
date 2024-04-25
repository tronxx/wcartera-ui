import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';
import { Form } from '@classes/forms/form';
import { Message } from '@models/message';
import {  Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/core/instances/format-datepicker';

@Component({
  selector: 'app-kardex-salidas',
  templateUrl: './kardex-salidas.component.html',
  styleUrls: ['./kardex-salidas.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class KardexSalidasComponent implements OnChanges, OnInit{

  form: FormGroup;
  strhoy = "";

  constructor(
    private datePipe : DatePipe,
    private dateAdapter: DateAdapter<Date>,
    public dialogRef: MatDialogRef<KardexSalidasComponent>,
    private builder : UntypedFormBuilder,
    ) { }


    ngOnInit(): void {
      //this.dateAdapter.setLocale('es'); 
      //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      this.form = this.builder.group({
        fecha : ["", [Validators.required]],
        descri: [""],
  
      });
      this.inicializaForm();
  
    }

    ngOnChanges(changes: SimpleChanges): void {
    }
  
    inicializaForm() {
      //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      this.strhoy =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
      //console.log ("Fecha de Hoy ", strhoy);
      this.form.get("fecha").setValue(this.strhoy);
      this.form.get("descri").setValue("");
  
    }
  
    get fecha(){
      return this.form.get("fecha");
    }
  
    get descri(){
      return this.form.get("descri");
    }
  
    aceptar() {
      this.dialogRef.close(this.form.value);
    }

    closeno() {
      this.dialogRef.close(false);
    }
  
}
