import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Nombres, Clientes, Ciudades, VentasCompletas } from '@models/index';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';

@Component({
  selector: 'app-dlgbuscliente',
  templateUrl: './dlgbuscliente.component.html',
  styleUrls: ['./dlgbuscliente.component.scss']
})

export class DlgbusclienteComponent implements OnInit {

  clientes: Clientes[] = [];
  cliente?: Clientes;
  ventas: VentasCompletas[] = [];
  miventa?: VentasCompletas;
  codigo = "";
  nombre = "";
  tipo = "";
  escliente = false;
  esventa = false;

  constructor(
    public dialogRef: MatDialogRef<DlgbusclienteComponent>,
    @Inject(MAT_DIALOG_DATA) public message : string,
    private clientesService : ClientesService,
    private ventasService: VentasService,

    public dialog: MatDialog,
    ) { }
  
    ngOnInit(): void {
      const datosrecibidos = JSON.parse(this.message);
      this.nombre = datosrecibidos.nombre;
      this.tipo = datosrecibidos.tipo;
      if(this.tipo == "CLIENTE") {
        this.escliente =  true;
        this.buscar_cliente_nombre(this.nombre);
      }
      if (this.tipo == "VENTA") {
        this.esventa = true;
        this.buscar_lista_ventas(this.nombre);
      }
    }

    buscar_lista_ventas(nombre: string) {
        this.ventasService.buscarVentaPorNombre(nombre).subscribe( res => {
          this.ventas = res;
        });
    }
  

  buscar_lista_clientes() {
    this.clientesService.obten_lista_clientes().subscribe(res => {
      this.clientes = res;
    })

  }

  buscar_cliente_nombre(nombre: string) {
    this.clientesService.busca_clientes_nombre(nombre).subscribe(res => {
      this.clientes = res;
    })

  }

  select_cliente(clien: Clientes) {
    this.cliente = clien;
    this.nombre = clien.nombre;
    this.codigo = clien.codigo;
  }

  select_venta(venta: VentasCompletas) {
    this.miventa = venta;
    this.nombre = venta.nombre;
    this.codigo = venta.codigo;
  }

  closeyes() {
    let resultado = {};
    if(this.escliente) resultado = this.cliente;
    if(this.esventa) resultado = this.miventa;
    this.dialogRef.close(resultado);
  }

  nuevoCliente() {
    let resultado = {
      "modo":"nuevo cliente"
    };
    this.dialogRef.close(resultado);
  }



  closeno() {
    this.dialogRef.close(false);
  }



}
