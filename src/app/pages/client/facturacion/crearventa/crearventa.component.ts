import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentasCompletas, Ubivtas, Clientes, Vendedores,
  Nulets, Tabladesctocont, Promotores, Codigoscartera,
  Factorvtacred, QOM, Factura, TIPOS_FAC,
  Tictes,
  CLAVES_SOLICIT} from '@models/index';
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
import { ClientesService } from '@services/clientes.service';

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
  codigoCartera?: Codigoscartera;
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
  codigocartera = "";
  codigocliente = "";
  nombrecliente = "";
  codigovta = "";
  codigovendedor = "";
  codigopromotor = "";
  mitc = "";
  siono = "S";
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
  piva = 16;

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
    piva: this.piva,
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
    private clientesService: ClientesService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: Router,
    public routeractivo: ActivatedRoute,
    
    ) { }


  ngOnInit(): void {
    let mistorage_z  = localStorage.getItem('token') || "{}";
    const micompania_z =  JSON.parse(mistorage_z);
    this.numcia = micompania_z.usuario.cia;
    this.iduser = micompania_z.usuario.idusuario;
    this.fechainicial =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.fechafinal =  this.fechainicial;
    let miregistroventas  = localStorage.getItem(`ventas_${this.numcia}`) || "{}";
    const ubicatemp =JSON.parse(miregistroventas); 
    this.debug = this.configservice.debug;
    if(ubicatemp) {
      this.ubivta =  ubicatemp.ubicacion;
      this.idubica = ubicatemp.idubica;
      this.nombreubica = ubicatemp.nombreubica;
      this.codigovendedor = ubicatemp.vendedor;
      this.codcartera = ubicatemp.codcartera;
      this.seriefac = ubicatemp.seriefac;
      this.codigopromotor = ubicatemp.promotor;

    } 

    if(this.debug) console.log("Seriefac", this.seriefac);
    this.codigovta = this.codcartera + this.datePipe.transform(new Date(),"yyMMdd") + "01";
    this.productos = [];
    this.cargaCatalogos();
    const idcliente = Number(this.routeractivo.snapshot.paramMap.get('idcliente'));
    if(this.debug) console.log("Facturacion idcliente",  idcliente);
    if(idcliente > 0) {
        this.buscar_cliente_por_id(idcliente);
    }

  }

  async cargaCatalogos() {
    this.ubivtas = await lastValueFrom(this.ventasService.buscarUbicaciones());
    this.vendedores = await lastValueFrom(this.ventasService.buscarVendedores());
    this.vendedor = this.vendedores.find(mi => mi.codigo === this.codigovendedor);
    this.promotores = await lastValueFrom(this.ventasService.buscarPromotores());
    this.promotor = this.promotores.find(mi => mi.codigo === this.codigopromotor);
    this.tabladesctoscont = await lastValueFrom(this.ventasService.obtentabladesctocont());
    this.factoresvtacrd = await lastValueFrom(this.ventasService.obtenfactorvtacrd());
  
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
      if(this.ticte != "CC" && this.ticte != "FI" && this.ticte != "EX") {
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
        precio = preciooferta; this.oferta = true;
        return(precio);
      }
      const pordesc = this.buscar_tasa_descto_cont(linea, this.ticte, '');
      if(this.debug) console.log("Pordesc", pordesc);
      return (preciou - pordesc /100 * preciou );
    }
    if(this.ticte == "TC" || this.ticte == "EX") {
      if(preciooferta != 0) { 
        precio = preciooferta; this.oferta = true;
        return(precio);
      }
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
    const miplazo  = this.factoresvtacrd.find(mi => mi.plazo === nulets);    
    if(miplazo) {
      factor = miplazo.factor;
    }
    return (factor);

  }

  busca_porcentaje_comision(nulets: number) : number {
    let porcomis = 0;
    const miplazo  = this.factoresvtacrd.find(mi => mi.plazo === nulets);    
    if(miplazo) {
      porcomis = miplazo.porcomis;
      if(this.debug) console.log("Porcentaje Comision", porcomis, " Plazo:", miplazo);
    }
    if(this.debug) console.log("Porcentaje Comision", porcomis, " Nulets:", nulets);
    return (porcomis);

  }


  buscar_tasa_descto_cont(milinea: string, ticte: string, cvetarjetatc: string)
  {
    let tasa = -1;
    let plazo = 0;
    if(milinea != "MOTO") milinea = "GRAL";
    if(ticte == "TC") {
        const mitc  = this.tarjetastc.find(mi => mi.clave === cvetarjetatc);    
        if(mitc) {
          plazo = mitc.plazo;
        }
    }
    let mistablasdescto = this.tabladesctoscont;
    mistablasdescto.forEach(rentabla => {
      if(ticte == rentabla.tipo && milinea == rentabla.linea && plazo == rentabla.plazo) {
          tasa = rentabla.descto;
        }
    });

    return (tasa);

  }  


  async busca_tipos_tarjetas() {
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
    const tarjetas = await lastValueFrom(this.ventasService.buscarTc(this.ubivta, this.ticte));
    tarjetas.forEach(mitc => {
            if(mitc.plazo <= plazomax) {
              //console.log("Agregando Tarjetas:", mitc);
              this.tarjetastc.push(mitc);
            }
    });
  
  }

  edit(renfac: any) {}
  delete(renfac: any) {
    const index = this.productos.indexOf(renfac);
    if (index > -1) {

    const confirmar = this.dialog.open(DlgyesnoComponent, {
        width: '700px',
        data: 'Seguro que desea eliminar el producto ' + renfac.codigo + ' - ' + renfac.descri
       });
      confirmar.afterClosed().subscribe(res => {
        if(res) {
                this.total = Number( this.total)  - Number( renfac.preciou);
                this.productos.splice(index, 1);      
                this.productos = [...this.productos];      
                //this.dataSource = this.productos;      
                // if(this.debug) console.log("Productos", this.productos);
                this.calcular_totales();
        }
      })

    }
  }

  agregar() {
      // console.log("El codigo es", this.codigo_z);
      const mitarjetatc = this.mitc;
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
        if(this.debug) console.log("Regresando del Dialog", res);
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
            piva: this.piva, 
            importe: preciou,
            iva: res.iva,
            total: preciou,
          }
          if(res.oferta) { this.oferta = true; }
          this.total = Number( this.total)  + Number(  preciou);
          this.productos.push(this.renglonprod);
          this.productos = [...this.productos];
          //this.dataSource = this.productos;
          if(this.debug) console.log("Productos", this.productos);
          
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
    const datosabuscar = {
      nombre: '',
      tipo: 'CLIENTE'
    }
    const dialogref = this.dialog.open(DlgbusclienteComponent, {
      width:'600px',
      data: JSON.stringify(datosabuscar)
    });
    dialogref.afterClosed().subscribe(res => {
      this.cliente = res;
    }
    )

  }

  buscar_cliente_por_id(idcliente: number) {
      this.clientesService.obten_cliente(idcliente).subscribe(res => {
        if(res) {
          this.cliente = res;
          this.codigocliente = res.codigo;
        }
      });

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
        if(this.debug) console.log("Factores Vta Credito", this.factoresvtacrd);
      }
    );
    this.ventasService.obtentabladesctocont().subscribe(
      respu => {
        this.tabladesctoscont = respu;
      }
    );
  
  }

  async continuar() {
    const codigocorrecto = await this.busca_codigocartera(this.codigovta);
    if(this.debug) console.log("Regresando de Validar codigo", codigocorrecto);
    if(!codigocorrecto.valido) { 
      this.alerta(codigocorrecto.mensaje);
      this.datoslistos = false
      return;
    }
    this.datoslistos = !this.datoslistos;
    this.productos = [];
    this.totgral = 0;
    this.totprodfin = 0;
    this.total = 0;
    this.enganche = 0;
    this.preciolet = 0;
    this.totiva = 0;
    this.hayerror = false;
    this.msgerror_z = "";
    this.nulet = 0;
    this.escredito = false;
    
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
      if(this.debug) console.log("Params Pedir datos Factura", params_z);
      const dlgdatosrenfac= this.dialog.open(FacturacionEditComponent, {
        width: '700px',
        data: JSON.stringify(params_z)
       });
      dlgdatosrenfac.afterClosed().subscribe(res => {
        if(res) {
          const fecha = res.fecha;
          this.factura = {
            id: -1,
            idventa: -1,
            iduuid: -1,
            importe: 0,
            iva: 0,
            total: 0,
            status: "A",
            tipofac: TIPOS_FAC.VENTA,
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
            fecha: fecha,
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
    if(this.debug) console.log("Siguiente Folio", sigfolio, seriefac);
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
      tipofac: TIPOS_FAC.VENTA,
      codigousocfdi: "",
      conceptousocfdi:"",
      codigometodopago: "",
      conceptometodopago: "",
      uuid: ""
  
    }
    if(this.debug) console.log("Nueva Factura", this.factura);

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

  async grabar_venta() {
    const qom = this.escredito ? 'Q' : 'C';
    const opcion = this.oferta ? 'O' : ' ';
    const precon = Math.round(this.total * 100 / 1.16) / 100;
    const prodfin = Math.round( 100 * (this.totgral - this.total)) / 100;
    const totalvta = Math.round(100 * this.totgral) / 100;
    const idvendedor = this.vendedor.id;
    const idpromotor = this.promotor.id;
    const comision = Math.round( precon * this.busca_porcentaje_comision(this.nulet) /100 );
    const idcli = this.configservice.calcula_idcli(this.codigovta);
    const comisiontc = 0;
    const strfechavta = '20' +  this.codigovta.substring(2, 4) + '-' +
      this.codigovta.substring(4, 6) + '-' +
      this.codigovta.substring(6, 8);
    const fechaventa = this.configservice.strAFecha(strfechavta);
    if(qom == 'C') { this.enganche = totalvta; }

    const nvaventa = {
      idventa: idcli,
      codigo: this.codigovta,
      idcliente: this.cliente.id,
      fecha: fechaventa,
      idtienda: this.codigoCartera.id,
      siono: this.siono,
      qom : qom,
      ticte: this.ticte,
      letra1: 0,
      piva: this.piva,
      enganc: this.enganche,
      nulets: this.nulet,
      canle: this.preciolet,
      bonifi: 0,
      servicio: this.servicio,
      precon: precon,
      idvendedor: idvendedor,
      comision: comision,
      prodfin: prodfin,
      idcarta: 1,
      idfactura: 0,
      idubica: this.idubica,
      idpromotor: idpromotor,
      descto : 0,
      opcion: opcion,
      comisionpromotor: 0,
      cargos: totalvta,
      abonos: 0,
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
        tipofac: TIPOS_FAC.VENTA,
    }
    const nuevaventa = {
      venta: nvaventa,
      factura: factur,
      renfac: this.productos

    }
    const miventa = await lastValueFrom( this.ventasService.grabar_venta(JSON.stringify(nuevaventa)));
      if(this.debug) console.log("Clave TC", this.mitc);

    if(nvaventa.ticte == "TC" && this.mitc != undefined && this.mitc != "-1") {
      this.mitarjetatc = this.tarjetastc.find( mitc => mitc.clave == this.mitc);
      if(this.debug) console.log("Tarjeta TC", this.mitarjetatc);

      const porcentc = (this.mitarjetatc.tasa + this.mitarjetatc.sobretasa) * (1 + this.mitarjetatc.poriva / 100);
      const comisiontc = Math.round(totalvta * porcentc ) / 100;
      const saldotc = totalvta - comisiontc;
      const agregandotc = await lastValueFrom(
        this.ventasService.grabar_dato_solicit(
          nvaventa.idventa, 
          CLAVES_SOLICIT.CLAVE_TARJETATC,
          this.mitarjetatc.clave
        )        
      );
      if(this.debug) console.log("Ya agregue los datos de la TC", agregandotc);

      let movcli = {
        fecha: nvaventa.fecha,
        concepto: "COM.BAN " + this.mitarjetatc.clave,
        tda: "TDA",
        tipopago: "AB",
        cobratario: "TDA",
        recobon: comisiontc,
        importe: comisiontc,
        
        idventa: idcli,
        iduser: this.iduser,
        idmovto: -1,
      }

      const movcli_z = await lastValueFrom(
        this.ventasService.agregarMovimientosVentas(-1, movcli)
      );
      if(this.debug) console.log("Voy a agregar movimiento TC", movcli_z, movcli);

      movcli.recobon = 0;
      movcli.importe = saldotc;
      movcli.concepto = "EFECTIVO TARJETA";
      const movcli2_z = await lastValueFrom(
        this.ventasService.agregarMovimientosVentas(-1, movcli)
      );
      if(this.debug) console.log("Voy a agregar saldo de TC", movcli2_z, movcli);
    }
    if(this.ticte == "CC" ) {
      let movcli = {
        fecha: nvaventa.fecha,
        concepto: "CONTADO",
        tda: "TDA",
        tipopago: "AB",
        cobratario: "TDA",
        recobon: 0,
        importe: totalvta,
        idventa: idcli,
        iduser: this.iduser,
        idmovto: -1,
      }

      const movcli_z = await lastValueFrom(
        this.ventasService.agregarMovimientosVentas(-1, movcli)
      );
    }
    
    if(this.debug) console.log("Venta Nueva", miventa);
    this.alerta("Se agregó la venta " + nvaventa.codigo.toString());
    const codigo = miventa.codigo;
    this.detalles_venta(codigo);
  }

  detalles_venta(codigo: number) {
    let url_z = `/app/detalleventas/${codigo}`;
    //this.alerta("Estoy en detalles poliza voy a url:" + url_z);
    console.log('Venta', codigo, url_z);
    
    this.router.navigateByUrl(url_z).then( (e) => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });    

  }

  async validar_codigo() {
    if(this.debug) console.log("Estoy en valida codigo", this.codigovta);
    const codigo = this.codigovta;
    const carteravalida = await this.busca_codigocartera(codigo);
    if(!carteravalida.valido) {
      this.alerta(carteravalida.mensaje);
    }

  }

  async busca_codigocartera(codigo: string  ) {
      let validacion = {
        valido : true,
        mensaje: ""
      };

  
      const codigocartera = codigo.substring(0, 2);
      if(!codigo || codigo.length < 10) {
        validacion.mensaje = "El codigo " + codigo + " no es correcto, Debe tener al menos 10 dígitos";
        validacion.valido = validacion.valido && false;
      }
      const fecha = codigo.substring(2, 8);
      const fechacorrecta = this.configservice.isValidDateString(fecha);
      if(!fechacorrecta) {
        validacion.mensaje = "El codigo " + codigo + " no es correcto, la fecha no es valida";
        validacion.valido = validacion.valido && false;
      }
      const consec = Number(codigo.substring(8, 10));
      const esoknum = /^[0-9]{2}$/.test(codigo.substring(8, 10));
      if(this.debug) console.log("Validando consecutivo", consec, esoknum);
      if ( isNaN(consec ) || consec < 1 || !esoknum)  {
        validacion.mensaje += "\n El codigo " + codigo + " no es correcto, el consecutivo no es valido";
        validacion.valido = validacion.valido && false;
      }

      const codcartera = await lastValueFrom( this.ventasService.buscarCodigoCartera(codigocartera));
      if(!codcartera) {
        validacion.mensaje += "\n No existe la cartera " + codigocartera;
        validacion.valido = validacion.valido && false;
      }
      const ventaexistente = await lastValueFrom( this.ventasService.buscarVentaPorCodigo(this.codigovta));
      if(ventaexistente) {
          validacion.mensaje += "\n El codigo " + codigo + " ya existe " +  ventaexistente.nombre;
          validacion.valido = validacion.valido && false;
      }
      return (validacion);
  
  }



  async busca_codigoventa() {
    const ventaexistente = await lastValueFrom( this.ventasService.buscarVentaPorCodigo(this.codigovta));
    if(ventaexistente) {
      this.alerta("Ya Existe este código " + ventaexistente.nombre);
      return (false);
    }
    return (true);

  }


}

