import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-piderangofechas',
  templateUrl: './piderangofechas.component.html',
  styleUrls: ['./piderangofechas.component.scss']
})
export class PiderangofechasComponent implements OnInit {

  fechaini = "";
  fechafin = "";
  title = "";


  constructor(
    public dialogRef: MatDialogRef<PiderangofechasComponent>,
    public dialog : MatDialog,
    private datePipe : DatePipe,
    @Inject(MAT_DIALOG_DATA) public message : string
  ) { }

  ngOnInit(): void {
    const datos  = JSON.parse( this.message)
    this.fechafin = datos.fechafin
    this.fechaini = datos.fechaini
    this.title = datos.title
  }

  close() {
    const resultados = {
      fechaini: this.fechaini,
      fechafin: this.fechafin
    }
    this.dialogRef.close(JSON.stringify(resultados));
  }

  closeno() {
    this.dialogRef.close(false);
  }

}