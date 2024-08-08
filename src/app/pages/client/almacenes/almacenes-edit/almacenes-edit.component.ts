import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AlmacenesFormComponent } from '@forms/shared-components/almacenes-form/almacenes-form.component';
import { AlmacenesDto } from '@dtos/almacenes-dto';

@Component({
  selector: 'app-almacenes-edit',
  templateUrl: './almacenes-edit.component.html',
  styleUrls: ['./almacenes-edit.component.scss']
})

export class AlmacenesEditComponent implements OnInit {
  title = "";
  public message = "Almacenes";
  public almacen : AlmacenesDto = null;
  @Output() submitdata : EventEmitter<any> = new EventEmitter();
    constructor(
      public dialog: MatDialogRef<AlmacenesEditComponent>,
      @Inject(MAT_DIALOG_DATA) public params : string
  
    ) { }
  
    ngOnInit(): void {
      let misparam_z = JSON.parse(this.params);
      this.title = misparam_z.title;
      this.almacen = misparam_z.almacen;
      console.log("almacenes edit Mi almacen:", this.almacen);

    }
  
    aceptar(data : any){
      this.dialog.close(data);
    }
  
    closeno() {
      this.dialog.close(false);
    }
  
}