import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Nombres, Clientes, Ciudades } from '@models/index';
import { ClientesService } from '@services/clientes.service';

@Component({
  selector: 'app-dlgbuscliente',
  templateUrl: './dlgbuscliente.component.html',
  styleUrls: ['./dlgbuscliente.component.scss']
})

export class DlgbusclienteComponent implements OnInit {

  clientes: Clientes[] = [];
  cliente?: Clientes;
  codigo = "";
  nombre = "";

  constructor(
    public dialogRef: MatDialogRef<DlgbusclienteComponent>,
    @Inject(MAT_DIALOG_DATA) public message : string,
    private clientesService : ClientesService,
    public dialog: MatDialog,
    ) { }
  
    ngOnInit(): void {
      this.codigo = this.message;
    }
  

  buscar_lista_clientes() {
    this.clientesService.obten_lista_clientes().subscribe(res => {
      this.clientes = res;
    })

  }

  buscar_cliente_nombre() {
    this.clientesService.busca_clientes_nombre(this.nombre).subscribe(res => {
      this.clientes = res;
    })

  }

  select_cliente(clien: Clientes) {
    this.cliente = clien;
    this.nombre = clien.nombre;
    this.codigo = clien.codigo;
  }

  closeyes() {
    this.dialogRef.close(this.cliente);
  }

  closeno() {
    this.dialogRef.close(false);
  }



}
