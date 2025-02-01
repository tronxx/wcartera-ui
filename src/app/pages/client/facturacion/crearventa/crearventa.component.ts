import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentasCompletas, Ubivtas, Clientes, Vendedores,
  Nulets, Tabladesctocont, Promotores,
  Factorvtacred, QOM, Factura,
  Tictes} from '@models/index';
import { Tarjetatc } from '@models/index';
import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';
import { DlgimportarComponent } from '@components/dlgimportar/dlgimportar.component';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PidepasswdComponent } from '@components/pidepasswd/pidepasswd.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosComponent } from '../productos/productos.component';
import { forIn } from 'lodash';
import { ConfigService } from '@services/config.service';
import { DlgbusclienteComponent } from '@components/dlgbuscliente/dlgbuscliente.component';
import { FacturacionEditComponent } from '../facturacion-edit/facturacion-edit.component';
import { VentasService } from '@services/ventas.service';
import { FacturacionService } from '@services/facturacion.service';

@Component({
  selector: 'app-crearventa',
  templateUrl: './crearventa.component.html',
  styleUrls: ['./crearventa.component.scss']
})
export class CrearventaComponent implements OnInit {

  fechainicial = "";
  fechafinal = "";
  idubica = 0;
  nombreubica = "";
  numcia = 0;
  iduser = 0;
  datoslistos = false;
  factura?: Factura;
  ventascompletas : VentasCompletas[] = [];
  venta?:VentasCompletas;
  ubivtas: Ubivtas[] = [];
  miubica?: Ubivtas
  ubivta = "";
  clientes :Clientes[] = [];
  cliente?: Clientes;
  vendedores: Vendedores[] = [];
  vendedor?: Vendedores;
  promotores: Promotores[] = [];
  promotor?: Promotores;
  tarjetastc : Tarjetatc[] = [];
  mitarjetatc?: Tarjetatc;
  tabladesctocont? : Tabladesctocont;
  tabladesctoscont : Tabladesctocont[] = [];
  factoresvtacrd: Factorvtacred[] = [];
  nulets: Nulets[] = [];
  codigocliente = "";
  nombrecliente = "";
  codigovta = "";
  codigovendedor = "";
  codigopromotor = "";
  mitc = "";
  siono = "SI";
  ticte = "CC";
  qom = "C";
  escredito = false;
  nulet = 0;
  preciolet = 0;
  servicio = 0;
  total = 0;
  enganche = 0;
  totprodfin = 0;
  totiva = 0;
  factoroferta = 0;
  esvalido=false;
  factordscto = 0;
  descto = 0;  
  oferta=false;
  
  simostrarprodfin = false;
  totgral = 0;
  hayerror = false;
  msgerror_z = "";

  linea_z = "";
  debug = true;
  soytrue = true;
  contarjetatc = false;
  antubica = "";
  antvnd = "";
  antcod_z = "";
  codcartera = "27";
  seriefac = "";
  numfac = 0;

  renglonprod = {
    codigo: "codigo",
    descri: "descri",
    folio: 0,
    serie: "serie",
    seriemotor: "serie motor",
    marca: "marca",
    aduana: "aduana",
    pedimento: "pedimento",
    linea: "linea",
    esmoto: "esmoto",
    canti: 0,
    esoferta: false,
    preciooferta: 0,
    preciou : 0,
    importe: 0,
    piva: 0,
    iva: 0,
    total: 0,

  }
  productos = [this.renglonprod];
  tictes : Tictes[] = [];
  tipoqom : QOM[] = [];

  displayedColumns: string[] = ['codigo', 
      'descri', 'folio', 'serie', 'canti', 'preciou', 'importe',
      'options'];
  
  public headers : Array<string> = 
  ["Código", "Descripción", "Folio", "Serie", 
    "Cantidad", "Precio.U", "Importe", "Acciones"];
  public arrayContent : Array<string> = [
    'codigo', 'descri', 'folio', 'serie', 'canti', 
    'preciou', 'importe',
  ];
  
  public body : Array<any> = [];
  public tableName = "Ventas";
  public page : PageIndex;
  
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  dataSource = this.productos;


  constructor(
    private ventasService: VentasService,
    private configservice: ConfigService,
    private facturasservice: FacturacionService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: Router
    ) { }


  ngOnInit(): void {
    let mistorage_z  = localStorage.getItem('token') || "{}";
    const micompania_z =  JSON.parse(mistorage_z);
    this.numcia = micompania_z.usuario.cia;
    this.iduser = micompania_z.usuario.iduser;
    this.fechainicial =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.fechafinal =  this.fechainicial;
    let miregistroventas  = localStorage.getItem(`ventas_${this.numcia}`) || "{}";
    const ubicatemp =JSON.parse(miregistroventas); 
    if(ubicatemp) {
      this.ubivta =  ubicatemp.ubicacion;
      this.idubica = ubicatemp.idubica;
      this.nombreubica = ubicatemp.nombreubica;
      this.codigovendedor = ubicatemp.vendedor;
      this.codcartera = ubicatemp.codcartera;
      this.seriefac = ubicatemp.seriefac;
      this.codigopromotor = ubicatemp.promotor;

    } 
    console.log("Seriefac", this.seriefac);
    this.codigovta = this.codcartera + this.datePipe.transform(new Date(),"yyMMdd") + "01";
    this.productos = [];
    this.cargaCatalogos();
  }

  cargaCatalogos() {
    this.ventasService.buscarUbicaciones().subscribe( res => {
      this.ubivtas = res;
    });

    this.ventasService.buscarVendedores().subscribe(res => {
      this.vendedores = res;
      this.vendedor = this.vendedores.filter(mi => mi.codigo === this.codigovendedor)[0];
    });
    this.ventasService.buscarPromotores().subscribe(res => {
      this.promotores = res;
      this.promotor = this.promotores.filter(mi => mi.codigo === this.codigopromotor)[0];
    });
    this.ventasService.obtentabladesctocont().subscribe(
      respu => {
        this.tabladesctoscont = respu;
      }
    );
  
    this.busca_tipos_tarjetas();
    this.tictes = this.configservice.obtenTiposClientesyQOM("TIPOS_CLIENTES");
    this.tipoqom = this.configservice.obtenTiposClientesyQOM("tiposQOM");

  }

  grabar_datos_venta() {
    let micodcartera_z = this.codigovta.substring(0, 2);
    if( this.antubica != this.ubivta || 
        this.antvnd != this.codigovendedor || 
        this.antcod_z != micodcartera_z
    )  {
      let capvtas = {
        ubicacion: this.ubivta,
        vendedor: this.codigovendedor,
        nombreubica:this.nombreubica,
        codcartera: micodcartera_z,
        promotor: this.codigopromotor,
        seriefac : this.seriefac
      };
      localStorage.setItem(`ventas_${this.numcia}`, JSON.stringify( capvtas));
      this.antubica = this.ubivta;
      this.antvnd = this.codigovendedor;
      this.antcod_z = micodcartera_z;
    }
  
  }
  
  selecciona_tarjetas_tc() {
    this.qom = "C";
    this.escredito = false;
    this.nulet = 0;
    this.grabar_datos_venta();
    
    if(this.ticte == "TC") {
      this.contarjetatc = true;
      this.busca_tipos_tarjetas();
    } else {
      this.contarjetatc = false;
      if(this.ticte != "CC" && this.ticte != "FI") {
        this.escredito = true;
        this.qom = "Q";
        this.buscanulets();
      }
    }
    this.calcular_totales();
  }

  calcula_precio(
    preciou : number, preciooferta : number, linea: string
  ): number {
    let precio =preciou;
    if(this.ticte == 'CC') {
      if(preciooferta != 0) { 
        precio = preciooferta;      
        return(precio);
      }
      const pordesc = this.buscar_tasa_descto_cont(linea, this.ticte, '');
      console.log("Pordesc", pordesc);
      return (preciou - pordesc /100 * preciou );
    }
    if(this.ticte == "TC") {
      const pordesc = this.buscar_tasa_descto_cont(linea, this.ticte, this.mitc);
      return (preciou - pordesc /100 * preciou );
    }
    if(this.ticte != "CC" && this.ticte != "TC") {
      if(linea != 'MOTO' && this.nulet == 4) {
        const factordscto = 12;
        precio = preciou - preciou * factordscto / 100;
      } 
    }
    return(precio);
  }

  calcular_totales() {
    if(this.escredito) return( this.calcular_totales_credito() );
    this.totgral = this.total + this.servicio;
    
  }

  calcular_totales_credito() {
    this.totgral = this.total;
    const factorvtacrd = this.busca_factor_vtacrd(this.nulet);
    if(this.nulet > 0) {
        this.preciolet = Math.round(this.total / this.nulet);
        this.totgral = this.preciolet * this.nulet + this.enganche;
    }
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

  busca_porcentaje_comision(nulets: number) : number {
    let porcomis = 0;
    this.factoresvtacrd.forEach(element => {
      if(element.plazo == nulets) {
        porcomis = element.porcomis;
      }
    });
    return (porcomis);

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


  busca_tipos_tarjetas() {
    let tarjetaspermitidas : Tarjetatc[] = [];
    let mistablasdescto = this.tabladesctoscont;
    let plazomax = 0;
  
    let params_z = {
      modo : "buscar_tarjetas_tc",
      ubiage : this.ubivta,
      ticte: this.ticte
    }
    let milinea = this.linea_z;
    if(milinea != "MOTO") milinea = "GRAL";
    mistablasdescto.forEach(rentabla => {
      if(milinea == rentabla.linea && plazomax < rentabla.plazo) {
          plazomax = rentabla.plazo;
        }
    });
    this.tarjetastc = [];
    //console.log("Plazo Max:", plazomax, " Linea:", this.linea_z);
    
    this.ventasService.buscarTc(this.ubivta, this.ticte).subscribe(
      respu => {
        if(respu) {
          respu.forEach(mitc => {
            if(mitc.plazo <= plazomax) {
              //console.log("Agregando Tarjetas:", mitc);
              this.tarjetastc.push(mitc);
            }
          });
        }
      }
    );
  
  }

  edit(renfac: any) {}
  delete(renfac: any) {}

  agregar() {
      // console.log("El codigo es", this.codigo_z);
      const mitarjetatc = "-1"
      if(this.ticte == "TC" && mitarjetatc == "-1") {
        this.alerta("debe seleccionar el tipo de tarjeta de crédito");
        return;
      }
      const nopuedecambiartc = true;
      let pideoferta = "NO";
      if(this.ticte == "CC" || this.ticte == "TC") pideoferta = "SI";
  
      let params_z = {
        "escomplementodatos": "NO",
        "pedircodigo": "SI",
        "pedirprecio": "NO",
        "buscaroferta": pideoferta,
        "codigo": "",
        "ticte": this.ticte,
        "qom": this.qom,
      }
      const dlgdatosrenfac= this.dialog.open(ProductosComponent, {
        width: '700px',
        data: JSON.stringify(params_z)
       });
       dlgdatosrenfac.afterClosed().subscribe(res => {
        console.log("Regresando del Dialog", res);
        if(res) {
          const preciou = this.calcula_precio(
            res.preciou, res.preciooferta,
            res.linea
          )
          this.renglonprod = {
            codigo: res.codigo,
            descri: res.descri,
            folio: res.folio,
            serie: res.serie,
            seriemotor: res.seriemotor,
            marca: res.marca,
            aduana: res.aduana,
            pedimento: res.pedimento,
            esmoto: res.esmoto,
            esoferta: res.esoferta,
            preciooferta: res.preciooferta,
            linea: res.linea,
            canti: res.canti,
            preciou : preciou,
            piva: 16,
            importe: preciou,
            iva: res.iva,
            total: preciou,
          }
          this.total = Number( this.total)  + Number(  preciou);
          this.productos.push(this.renglonprod);
          this.productos = [...this.productos];
          //this.dataSource = this.productos;
          console.log("Productos", this.productos);
          
          this.calcular_totales();
  
        }
       }
      );
    
    
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

  buscar_cliente() {
    const dialogref = this.dialog.open(DlgbusclienteComponent, {
      width:'600px',
      data: ''
    });
    dialogref.afterClosed().subscribe(res => {
      this.cliente = res;
    }
    )


  }

  
  buscanulets() {
    let paramsnulet_z = {
      modo :"buscar_nulets_activo",
      qom : "Q"
    }
    this.ventasService.obtennulets(JSON.stringify(paramsnulet_z)).subscribe(
      respu => {
        this.nulets = respu;
      }
    );
    this.ventasService.obtenfactorvtacrd().subscribe(
      respu => {
        this.factoresvtacrd = respu;
      }
    );
    this.ventasService.obtentabladesctocont().subscribe(
      respu => {
        this.tabladesctoscont = respu;
      }
    );
  
  }

  continuar() {
    this.datoslistos = !this.datoslistos;
    this.productos = [];
    
  }

  pedir_datos_factura() {
      // console.log("El codigo es", this.codigo_z);
      this.crear_nueva_factura(this.seriefac);
      let params_z = {
        escomplementodatos: "NO",
        pedircodigo: "SI",
        pedirprecio: "NO",
        modo: "NUEVAFACTURA",
        codigo: "",
        ticte: this.ticte,
        qom: this.qom,
        seriefactura: this.seriefac,
        factura: this.factura
      }
      this.crear_nueva_factura(this.seriefac);
      console.log("Params Pedir datos Factura", params_z);
      const dlgdatosrenfac= this.dialog.open(FacturacionEditComponent, {
        width: '700px',
        data: JSON.stringify(params_z)
       });
       dlgdatosrenfac.afterClosed().subscribe(res => {
        console.log("Regresando del Dialog", res);
        if(res) {
          console.log("Datos de Factura", res);
          this.factura = {
            id: -1,
            idventa: -1,
            iduuid: -1,
            importe: 0,
            iva: 0,
            total: 0,
            status: "A",
            cia: -1,
            codigousocfdi: res.claveusocfdi,
            codigometodopago: res.clavemetodopago,
            conceptometodopago: "",
            conceptousocfdi: "",
            uuid:"",
            serie : res.serie,
            numero : res.numero,
            idusocfdi: res.usocfdi,
            idmetodopago : res.metodopago,
            fecha: res.fecha,
          }
          this.seriefac = this.factura.serie;
          this.grabar_datos_venta();
        }
  
        }
      );
    
    

  }  

  crear_nueva_factura(seriefac: string) {
    const sigfolio = this.buscaUltimoFolioFactura(seriefac);
    const fechahoy =  this.datePipe.transform(new Date(),"yyyy-MM-ddThh:mm");
    console.log("Siguiente Folio", sigfolio, seriefac);
    this.factura = {
      id: -1,
      serie: seriefac,
      numero: sigfolio,
      idventa: -1,
      fecha: fechahoy,
      iduuid: -1,
      idusocfdi: -1,
      idmetodopago: -1,
      importe: 0,
      iva: 0,
      total: 0,
      status: "A",
      cia: -1,
      codigousocfdi: "",
      conceptousocfdi:"",
      codigometodopago: "",
      conceptometodopago: "",
      uuid: ""
  
    }
    console.log("Nueva Factura", this.factura);

  }

  buscaUltimoFolioFactura(serie: string){
    let folio = 1;
    this.facturasservice.buscarUltimoFolio(serie).subscribe(
      respu => {
        folio = respu.ultimo || 0;
        folio++;
        this.factura.numero = folio;
      }
    );
    return (folio);

  }

  grabar_venta() {
    const qom = this.escredito ? 'Q' : 'C';
    const precon = Math.round(this.total * 100 / 1.16) / 100;
    const prodfin = Math.round( 100 * (this.totgral - this.total)) / 100;
    const totalvta = Math.round(100 * this.totgral) / 100;
    const idvendedor = this.vendedor.id;
    const idpromotor = this.promotor.id;
    const comision = precon * this.busca_porcentaje_comision(this.nulet);
    const idcli = this.configservice.calcula_idcli(this.codigovta);

    const nvaventa = {
      idventa: idcli,
      codigo: this.codigovta,
      idcliente: this.cliente.id,
      fecha: this.fechafinal,
      idtienda: 1,
      siono: this.siono,
      qom : qom,
      ticte: this.ticte,
      letra1: 0,
      enganc: this.enganche,
      nulets: this.nulet,
      canle: this.preciolet,
      bonifi: 0,
      servicio: this.servicio,
      precon: precon,
      idvendedor: idvendedor,
      comision: comision,
      prodfin: prodfin,
      idcarta: 0,
      idfactura: 0,
      idpromotor: idpromotor,
      comisionpromotor: 0,
      cargos: totalvta,
      abonos: 0,
      idubica: this.idubica,
      status: 'A',
      cia: 1,
      fechasaldo: ''
      
    }
    const factur = {
        serie: this.factura.serie,
        numero: this.factura.numero,
        idventa: -1,
        fecha: this.factura.fecha,
        iduuid: 0,
        idusocfdi: this.factura.idusocfdi,
        idmetodopago: this.factura.idmetodopago,
        importe: 0,
        iva: 0,
        total: 0,
        status: "A",
        cia: 1,
    }
    const nuevaventa = {
      venta: nvaventa,
      factura: factur,
      renfac: this.productos

    }
    this.ventasService.grabar_venta(JSON.stringify(nuevaventa)).subscribe( res => {
      console.log("Venta Nueva", res);
      this.alerta("Se agregó la venta" + res.id.toString());
    });
  }


}

