import { Component, OnInit, Inject, Input } from '@angular/core';
import { ProductosService } from '@services/productos.service';
import { MatCard } from '@angular/material/card';
import { Productos, Kardex, Almacenes } from '@models/index';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-buscar-productos',
  templateUrl: './buscar-productos.component.html',
  styleUrls: ['./buscar-productos.component.scss']
})
export class BuscarProductosComponent {

  productos: Productos[] = [];
  producto?: Productos;
  codigo = "";
  messages = "";


  constructor(
    private productosService : ProductosService,
    public dialogRef: MatDialogRef<BuscarProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public message : string,

    public dialog: MatDialog,
    ) { }


    busca_articulos() {
      this.productosService.obten_lista_productos_codigo (1, this.codigo).subscribe(
        respu => {
          if(respu.length > 0) {
            this.productos = respu;
            if(this.productos.length < 2) {
              this.select_articulo(this.productos[0]);
            }
          } else {
            this.messages = "No hay Articulos que coincidan";
          }
        }
      )
  
    }
  
    select_articulo(articulosel: Productos ) {
      this.producto = articulosel;
      this.codigo = this.producto.codigo;
    }
  
    closeyes() {
      this.dialogRef.close(this.producto);
    }
  
    closeno() {
      this.dialogRef.close(false);
    }
  
  

}
