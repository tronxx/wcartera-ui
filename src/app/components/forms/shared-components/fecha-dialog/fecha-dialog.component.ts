import { Component, Inject, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule, Form, UntypedFormGroup, FormBuilder, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fecha-dialog',
  templateUrl: './fecha-dialog.component.html',
  styleUrls: ['./fecha-dialog.component.scss']
})
export class FechaDialogComponent {

  form : UntypedFormGroup;
  datosiniciales = {
    minDate: "",
    maxDate: "",
    title: "Seleccione Las letras a Imprimir"
  }
  minDate: Date;
  maxDate : Date;
  error = "";
  title = "";
  xfecha = "";

  constructor(
    public builder : UntypedFormBuilder,
    public dialogRef: MatDialogRef<FechaDialogComponent>,
    public dialog : MatDialog,
    private datePipe : DatePipe,
    @Inject(MAT_DIALOG_DATA) public message : string

  ) {
    this.datosiniciales = JSON.parse(message);
    console.log("datosiniciales", this.datosiniciales);
    this.title = this.datosiniciales.title;

    this.form = this.builder.group({
      fecha : ["", [Validators.required], this.validateDate.bind(this)]
    });
    this.inicializaForm();

  }

  async validateDate(control: FormControl) {
    const strfecha = this.datePipe.transform( this.fecha.value,"yyyy-MM-dd");
    const formattedMaxDate = this.datePipe.transform(this.datosiniciales.maxDate, 'dd-MM-yyyy');
    const formattedMinDate = this.datePipe.transform(this.datosiniciales.minDate, 'dd-MM-yyyy');

    if(strfecha < this.datosiniciales.minDate || strfecha > this.datosiniciales.maxDate) {
      this.error = "La fecha debe estar entre " + formattedMinDate  + " y " + formattedMaxDate;
      return { invalidDate: true };
    }
    this.error = "";
    return null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inicializaForm();
  }

  
  inicializaForm() {
    //console.log("changed")
    this.minDate = new Date(this.datosiniciales.minDate + 'T00:00:00');
    this.maxDate = new Date(this.datosiniciales.maxDate + 'T23:00:00');
    console.log("minDate", this.minDate, "maxDate", this.maxDate);
    const formattedMaxDate = this.datePipe.transform(this.datosiniciales.maxDate, 'yyyy-MM-dd');
    this.fecha.setValue(formattedMaxDate);

  }

  get fecha(){
    return this.form.get("fecha");
  }

  aceptar() {
    const strfecha = this.datePipe.transform( this.fecha.value,"yyyy-MM-dd");
    if(strfecha < this.datosiniciales.minDate || strfecha > this.datosiniciales.maxDate) {
      this.error = "La fecha debe estar entre " + this.datosiniciales.minDate  + " y " + this.datosiniciales.maxDate;
    }
    this.fecha.setValue(strfecha);

    this.dialogRef.close(strfecha);
  }

  closeno() {
    this.dialogRef.close(false);
  }

}
