import { Component, Inject, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Form, UntypedFormGroup, FormBuilder, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-dlgimpriletras',
  templateUrl: './dlgimpriletras.component.html',
  styleUrls: ['./dlgimpriletras.component.scss']
})
export class DlgimpriletrasComponent {

  form : UntypedFormGroup;
  datosiniciales = {
    ltainicial: 1,
    ltafinal: 1,
    letrasimpresas: true,
    title: "Seleccione Las letras a Imprimir"
}
  error = "";
  title = "";

  constructor(
    public builder : UntypedFormBuilder,
    public dialogRef: MatDialogRef<DlgimpriletrasComponent>,
    public dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public message : string

  ) {
    this.datosiniciales = JSON.parse(message);
    console.log("datosiniciales", this.datosiniciales);
    this.title = this.datosiniciales.title;
    this.form = this.builder.group({
      ltainicial : ["", [Validators.required]],
      ltafinal: ["", [Validators.required]],
    });
    this.inicializaForm();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.error == "error"){
      this.form.get("ltainicial").enable();
      this.form.get("ltafinal").enable();
    }
    this.inicializaForm();
  }

  inicializaForm() {
    //console.log("changed")
    this.form.get("ltainicial").setValue(this.datosiniciales.ltainicial);
    this.form.get("ltafinal").setValue(this.datosiniciales.ltafinal);

  }

  get ltainicial(){
    return this.form.get("ltainicial");
  }

  get ltafinal(){
    return this.form.get("ltafinal");
  }


  aceptar() {
    this.dialogRef.close(this.form.value);
  }

  closeno() {
    this.dialogRef.close(false);
  }

}
