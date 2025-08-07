import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-pideprecio',
  templateUrl: './pideprecio.component.html',
  styleUrls: ['./pideprecio.component.scss']
})
export class PideprecioComponent implements OnInit {
  
  precio = 0;
  clave = "";
  modo = "";
  tipoimagen = "";

  constructor(
    public dialogRef: MatDialogRef<PideprecioComponent>,
    @Inject(MAT_DIALOG_DATA) public message : string    

  ) { }

  ngOnInit(): void {
    let misdatos = JSON.parse(this.message);
    this.precio = misdatos.precio;
  }

  // Method to handle price submission
  closeyes () {
    let resultado = {
      "precio": this.precio
    }
    this.dialogRef.close(resultado);
  }

  closeno() {
    this.dialogRef.close(false);
  }

}
