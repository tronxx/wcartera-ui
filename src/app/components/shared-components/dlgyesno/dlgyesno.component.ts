import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-dlgyesno',
  templateUrl: './dlgyesno.component.html',
  styleUrls: ['./dlgyesno.component.scss']
})

export class DlgyesnoComponent  implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DlgyesnoComponent>,
    public dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public message : string
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(true);
  }

  closeno() {
    this.dialogRef.close(false);
  }

  alerta(mensaje: string) {
    const dialogref = this.dialog.open(DlgyesnoComponent, {
      width:'350px',
      data: mensaje
    });
    dialogref.afterClosed().subscribe(res => {
      //console.log("Debug", res);
    });
  
  }
}