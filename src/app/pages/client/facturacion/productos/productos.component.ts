import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfigService } from '@services/config.service'
import { 
   Articulo, Serie, Ofertas, Tarjetatc, Factorvtacred, 
   Tabladesctocont, Listaasi
  } from '@models/index';
import { VentasService } from '@services/ventas.service';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgbusarticuloComponent } from '@components/dlgbusarticulo/dlgbusarticulo.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent {

  noescomplementodatos_z = true;
  codigo = "";
  concepto = "";
  datoshabilitados = false;
  notecleardescri = true;
  folio = 0;
  pedirserie = true;
  seriemotovalida = false;
  esmoto = false;
  articulo? : Articulo;
  serie?: Serie;
  series : Serie[] = [];
  ofertas : Ofertas [] = [];
  factoresvtacrd: Factorvtacred[] = [];
  tabladesctoscont: Tabladesctocont[] = [];
  tarjetastc : Tarjetatc[] = [];
  tarjetatc?: Tarjetatc;
  listaasi : Listaasi[] = [];
  seriemanual = false;
  serietxt = "";
  seriemotor = "";
  pedimento = "";
  aduana = "";
  marca = "";
  qom = "";
  ticte = "";
  ubica = "";
  esoferta = "";
  serievalida = true;
  seriemotorvalida = true;
  preciou = 0;
  pedirprecio = true;
  mostraroferta = false;
  preciooferta_z = 0;
  aceptarok = true;  
  buscaroferta = false;
  yabusqueinven = true;
  editdescri = false;
  serierequerida = false;
  foliorequerido = false;
  tarjeta = "";
  linea_z = "";
  productoasi = true;

  constructor(
    public dialog: MatDialog, public dialogRef: MatDialogRef<ProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public message : string,
    private configuracion: ConfigService,
    private datePipe : DatePipe,
    private ventasService: VentasService

  ) { }

  ngOnInit(): void {
    let datosparam = JSON.parse(this.message);
    this.noescomplementodatos_z = true;
    this.codigo = datosparam.codigo;
    this.ticte = datosparam.ticte;
    this.ubica = datosparam.ubica;
    this.qom = datosparam.qom;
    this.tarjeta = datosparam.tarjeta;

    console.log("No es complemento datos:", datosparam.noescomplementodatos);
    
    if(datosparam.escomplementodatos == "SI" ) {
      this.noescomplementodatos_z = false;
    }
    if(datosparam.pedirprecio == "NO") {
      this.pedirprecio = false;
    }
    if(datosparam.buscaroferta == "SI") {
      this.buscaroferta = true;
      this.carga_ofertas();
    }
    console.log("Datos param", datosparam);
    if(datosparam.ticte == "FI") {
      console.log("Datos param ticte es FI", datosparam.ticte);
      this.carga_lista_asi();
    }
    if(datosparam.codigo) this.busca_articulo();

  }



  busca_articulo() {
    var params_z = {
      modo : "buscar_codigo_inven",
      codigo : this.codigo
    }
    console.log("Debug: Estoy en busca_articulo ", this.codigo);
    this.yabusqueinven = true;
    this.esmoto = false;
    this.editdescri = false;
    this.pedirserie = false;
    if(this.codigo == "AUXILIAR") {
      this.datoshabilitados = true;
      this.serierequerida = false;
      this.foliorequerido = false;
      this.notecleardescri = false;
      this.articulo = <Articulo> {};
      this.articulo.codigo=this.codigo;
      this.articulo.tipo = "GLO";
      this.editdescri = true;
      this.pedirserie = false;
      this.linea_z = "";
    } else {
      this.ventasService.busca_codigo_inven(JSON.stringify(params_z)).subscribe(
        respu => {
          if(respu) {
            this.articulo = respu;
            this.definir_propiedades_articulo();
          } else {
            this.selecciona_codigo_inven();
          }
        } 
      );

    }
}

definir_propiedades_articulo() {
  this.codigo = this.articulo.codigo;
  this.linea_z = this.articulo.linea;
  this.preciou = this.articulo.preciou;
  this.concepto = this.articulo.descri;
  this.datoshabilitados = true;
  this.foliorequerido = true;
  if(this.articulo.tipo == "ALF") {
    this.pedirserie = true;
  }
  if(this.articulo.tipo == "GLO") {
    this.pedirserie = false;
  }
  this.serierequerida = this.pedirserie;
  if (this.linea_z == "MOTO") {
    this.esmoto = true;
    this.seriemanual = true;
  }
  this.preciooferta_z = this.busca_oferta (this.articulo.codigo);
  this.mostraroferta = (this.preciooferta_z > 0);
  if(this.ticte == "TC") { 
    let tasadecto = this.buscar_tasa_descto_cont(this.linea_z, this.ticte, this.tarjeta);
    this.preciou *= (1 - (tasadecto / 100) );
  }
  if(this.ticte == "FI") { 
    this.preciou = this.busca_precio_ASI(this.codigo);
    this.productoasi = true;
    if(this.preciou == -1) {
      this.alerta("Este Producto no puede venderse como ASI");
      this.productoasi = false;
    }
  }
  this.valida_aceptar();

}

selecciona_serie() {
  let params_z = {
    modo : "buscar_inven_todas_series",
    codigo : this.codigo,
    almacen: '%'
  }
this.ventasService.busca_series_disponibles(JSON.stringify(params_z)).subscribe(
    respu => {
      if(respu) {
        this.series = respu;
        if(this.series.length) this.serietxt = this.series[0].serie;
      }
    }
  );

}

valida_serie() {
  console.log('Debug Estoy en valida_serie', this.articulo, this.serietxt);
  
  if(this.articulo) {
    if(this.articulo.linea == "MOTO") this.valida_serie_moto();
  } else {
    this.serievalida = true;
  }
  this.valida_aceptar();
}

valida_serie_moto() {
  var params_z = {
    codigo: this.codigo,
    serie: this.serietxt,
    seriemotor: this.seriemotor
  }
  this.seriemotovalida = false;
  this.serievalida = false;
  console.log("Debug: Estoy en busca_articulo_serie_moto", params_z);
  this.ventasService.busca_serie_moto(JSON.stringify(params_z)).subscribe(
    respu=> {
      this.serie = respu;
      this.serievalida = true;
      this.seriemotovalida = true;
      this.pedimento = this.serie.pedimento;
      this.aduana = this.serie.aduana;
      this.marca = this.serie.marca;
    }
  );
}

onChangeSerie(serie: any) {
   this.serietxt = serie;
}

valida_serie_motor_moto() {
  if(this.serie) {
    this.seriemotorvalida = (this.seriemotor == this.serie.seriemotor);
    this.valida_aceptar();
  } else {
    this.seriemotorvalida = false;
  }

}



valida_aceptar ( ) {
  console.log("folio requerido", this.foliorequerido,
    "Folio", this.folio,
    "serierequerida", this.serierequerida,
    "esmoto", this.esmoto,

  )
  if(!this.foliorequerido) {
    this.aceptarok = true;
    return;
  }

  // Si es Cliente FIDE y el producto no está en la lista ASI
  if(this.ticte == "FI" && !this.productoasi) {
    this.aceptarok = false;
    return;
  }

  if(!this.folio) {
    this.aceptarok = false;
    return;
  }
  if(!this.serierequerida) {
    this.aceptarok = true;
    return;
  }
  if(!this.esmoto) {
    if(this.serietxt) {
      this.aceptarok = true;
      return;
    }
  }
  if(this.seriemotorvalida && this.seriemotovalida ) {
      this.aceptarok = true;
      return;
  }
  this.aceptarok = false;

}

  carga_lista_asi() {
      // Voy a buscar las lista asi
      this.ventasService.buscar_lista_asi().subscribe(
        respu => {
          this.listaasi = respu;
          console.log("Lista Asi Fac", this.listaasi);
        }
      );
  
  }

  carga_ofertas() {
    // Voy a buscar las ofertas
    this.ventasService.buscar_ofertas_json().subscribe(
      respu => {
        this.ofertas = respu;
      }
    );
    // Voy a buscar Factor Vta Credito
    this.ventasService.obtenfactorvtacrd().subscribe(
      respu => {
        this.factoresvtacrd = respu;
      }
    );
    // Voy a buscar las tabla de descuento Contado
    this.ventasService.obtentabladesctocont().subscribe(
      respu => {
        this.tabladesctoscont = respu;
      }
    );
    // Voy a buscar las Tarjetas de Credito
    let params_z = {
      modo : "buscar_tarjetas_tc",
      ubiage : this.ubica,
      ticte: this.ticte
    }
    this.ventasService.buscarTc(this.ubica, this.ticte).subscribe(
      respu => {
        this.tarjetastc = respu;
      }
    );

  };

  busca_precio_ASI(codigo: string):number {
    let precioasi = -1;
    const newprecioasi = this.listaasi.filter((preciosasi) => preciosasi.codigo == codigo);
    //console.log("Ofertas Filtradas:", newoferta);
    if(newprecioasi.length) {
      precioasi = newprecioasi[0].precioasi;
    }
    
    return (precioasi);

  }
  

  busca_oferta(codigo: string):number {
    let poferta = 0;
    let fechahoy =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
    const newoferta = this.ofertas.filter((oferta) => oferta.codigo == codigo);
    //console.log("Ofertas Filtradas:", newoferta);
    
    if (this.qom == "C") {
      newoferta.forEach( oferta => {
        if(codigo == oferta.codigo) {
          if(fechahoy >= oferta.inioferta && fechahoy <= oferta.finoferta) {
            poferta = oferta.preciooferta;
          }
        }
      });
    }
    return (poferta);

  }
  
  buscar_tasa_descto_cont(milinea: string, ticte: string, cvetarjetatc: string)
  {
    let tasa = -1;
    let plazo = 0;
    if(milinea != "MOTO") milinea = "GRAL";
    if(ticte == "TC") {
      this.tarjetastc.forEach( rentabla => {
        if(cvetarjetatc == rentabla.clave) {
          plazo = rentabla.plazo;
        }
      });
    }
    let mistablasdescto = this.tabladesctoscont;
    mistablasdescto.forEach(rentabla => {
      if(ticte == rentabla.tipo && milinea == rentabla.linea && plazo == rentabla.plazo) {
          tasa = rentabla.descto;
      }
    });

    return (tasa);

  }  

  busca_factor_vtacrd(nulets: number) : number {
    let factor = 0;
    this.factoresvtacrd.forEach(element => {
      if(element.plazo == nulets) {
        factor = element.factor;
      }
    });
    return (factor);

  }

  selecciona_codigo_inven() {
    const dialogref = this.dialog.open(DlgbusarticuloComponent, {
      width:'650px',
      data: this.codigo
    });
    dialogref.afterClosed().subscribe(res => {
      if (res) {
        this.articulo = res;
        this.definir_propiedades_articulo();
      }
    });
  }


  closeno() {
    this.dialogRef.close(false);
  }
  
  closeyes() {
    const datos = {
      codigo: this.codigo,
      descri: this.concepto,
      preciooferta: this.preciooferta_z,
      linea: this.linea_z,
      folio: this.folio,
      serie: this.serietxt,
      preciou : this.preciou,
      canti: 1,
      importe: this.preciou,
      iva: 0,
      esoferta: this.esoferta,
      seriemotor : this.seriemotor,
      pedimento : this.pedimento,
      aduana :  this.aduana,
      marca : this.marca,
      esmoto: this.esmoto
    
    }
    this.dialogRef.close(datos);
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
