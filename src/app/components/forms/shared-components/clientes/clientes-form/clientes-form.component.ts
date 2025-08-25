import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { Message } from '@models/message';
import {  Router } from '@angular/router';
import { ClientesDto, ClienteDtoCompleto } from '@dtos/clientes.dto';
import { ComplementosService } from '@services/complementos.service';
import { ClientesService } from '@services/clientes.service';
import { Ciudades, Regimenes, } from '@models/index'
import { MatSelectChange } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ConfigService } from '@services/config.service';
import { VentasService } from '@services/ventas.service';
import { lastValueFrom } from 'rxjs';
import { DlgyesnoComponent } from '@components/dlgyesno/dlgyesno.component';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.scss']
})

export class ClientesFormComponent extends Form<ClientesDto> implements OnChanges{
  @Output() public submitData: EventEmitter<ClientesDto>;
  @Input() public message: Message;
  @Input() public modo: string;
  @Input() public cliente: ClienteDtoCompleto;
  
  regimenes: Regimenes[] = [];
  ciudades: Ciudades[] = [];
  sololectura = false;
  titulo = "";
  debug = false;
  numcia = 1;
  codcartera = "27";

  constructor(
    public builder : UntypedFormBuilder,
    public router: Router,
    public dialog: MatDialog,
    private complementosService: ComplementosService,
    private clientesService: ClientesService,
    private configService: ConfigService,
    private ventasService: VentasService,
    private datePipe : DatePipe,

  ) {
    super();
    this.submitData = new EventEmitter<ClientesDto>();
    this.carga_catalogos();
    const rfc = "XAXX010101000";
    this.titulo = "Teclee los Datos del Cliente";
    this.numcia = this.cliente?.cia || 1;
    this.debug = this.configService.debug;
    let miregistroventas  = localStorage.getItem(`ventas_${this.numcia}`) || "{}";
    const ubicatemp =JSON.parse(miregistroventas); 
    if(ubicatemp) {
        this.codcartera = ubicatemp.codcartera;
    } 
    const fecha =  this.datePipe.transform(new Date(),"yyMMdd");
    const codigo = this.codcartera + fecha + "99";
    let ultimacaptura  = localStorage.getItem(`edit_cliente_${this.numcia}`) || "{}";
    const datosultimacaptura =JSON.parse(ultimacaptura);
    if(this.debug) console.log("Ultima captura cliente", datosultimacaptura);
    
  
    this.form = this.builder.group({
      codigo : [codigo, [Validators.required]],
      appat: [datosultimacaptura.appat? datosultimacaptura.appat : ""],
      apmat: [datosultimacaptura.apmat? datosultimacaptura.apmat : ""],
      nompil1: [datosultimacaptura.nompil1? datosultimacaptura.nompil1 : ""],
      nompil2: [datosultimacaptura.nompil2? datosultimacaptura.nompil2 : ""],
      calle: [datosultimacaptura.calle? datosultimacaptura.calle : ""],
      numpredio: [datosultimacaptura.numpredio? datosultimacaptura.numpredio : ""],
      colonia: [datosultimacaptura.colonia? datosultimacaptura.colonia : ""],
      codpostal: [datosultimacaptura.codpostal? datosultimacaptura.codpostal : ""],
      ciudad: [datosultimacaptura.ciudad? datosultimacaptura.ciudad : ""],
      telefono: [datosultimacaptura.telefono? datosultimacaptura.telefono : ""],
      email: [datosultimacaptura.email? datosultimacaptura.email : ""],
      regimen: [datosultimacaptura.regimen? datosultimacaptura.regimen : ""],
      rfc: [rfc],
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
      this.form.get("codigo").enable();
    }
    console.log("Clientes form component Modo", this.modo);
    if(this.modo == "DETALLES") {
      this.titulo = "Detalles del Cliente";
    }

    if(this.modo == "EDIT" || this.modo == "DETALLES") {
        this.inicializaForm();
    }
     
      
    this.sololectura = (this.modo == "DETALLES");
    if(this.debug) console.log("clientesForm modo", this.modo, "Sololectura", this.sololectura);

  }

  inicializaForm() {
    //console.log("changed")
    if(this.debug) console.log("clientes-form Mi cliente", this.cliente);
    if(this.cliente) {
      this.form.get("codigo").setValue(this.cliente.codigo);
      this.form.get("calle").setValue(this.cliente.calle);
      this.form.get("numpredio").setValue(this.cliente.numpredio);
      this.form.get("colonia").setValue(this.cliente.colonia);
      this.form.get("ciudad").setValue(this.cliente.idciudad);
      this.form.get("rfc").setValue(this.cliente.rfc);
      this.form.get("codpostal").setValue(this.cliente.codpostal);
      this.form.get("telefono").setValue(this.cliente.telefono);
      this.form.get("regimen").setValue(this.cliente.idregimen);
      this.form.get("appat").setValue(this.cliente.appat);
      this.form.get("apmat").setValue(this.cliente.apmat);
      this.form.get("nompil1").setValue(this.cliente.nompil1);
      this.form.get("nompil2").setValue(this.cliente.nompil2);
      this.form.get("email").setValue(this.cliente.email);
      this.busca_nombres ();
    } else {
      const fecha =  this.datePipe.transform(new Date(),"yyMMdd");
      const codigo = this.codigo + fecha + "99";
      this.set_idregimen();
      const rfc = "XAXX010101000";
      this.form.get("codigo").setValue(codigo);
      this.form.get("rfc").setValue(rfc);
    }
  }

  set_idregimen() {
    if(this.cliente.idregimen == -1) {
      let idregimen = 0;
      const claveregimen = "616";
      const miregimen =  this.regimenes.filter(regimen => regimen.clave === claveregimen);
      if(miregimen.length) idregimen = miregimen[0].id;
      this.form.get("regimen").setValue(idregimen);

    }

  }

  async valida() {
    if(this.debug) console.log("Estoy en valida codigo", this.codigo.value);
    const codigo = this.codigo.value;
    const carteravalida = await this.busca_codigocartera(codigo);
    if(!carteravalida.valido) {
      this.codigo.setErrors({ 'incorrecto': true });
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
      const fechacorrecta = this.configService.isValidDateString(fecha);
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
      if(this.debug) console.log("modo", this.modo, "obten_cliente_x_codigo", codigo);
      if(this.modo == "NUEVO") {
        const micliente = await lastValueFrom( this.clientesService.obten_cliente_x_codigo(codigo));
        if(micliente) {
          validacion.mensaje += "\n El codigo " + codigo + " ya existe " +  micliente.nombre;
          validacion.valido = validacion.valido && false;

        }
      }
      return (validacion);
  
  }
  

  carga_catalogos() {
    this.complementosService.obten_lista_regimenes().subscribe( res => {
      this.regimenes = res;
      this.set_idregimen();

    });

    this.complementosService.obten_lista_ciudades().subscribe( res => {
      this.ciudades = res;
    });

  }

  regimenSelectionChange(event: MatSelectChange) {
    this.regimen.setValue(event.value);
  } 

  ciudadSelectionChange (event: MatSelectChange) {
    this.ciudad.setValue(event.value);
  } 

  acompletanombre() {
    if(!this.debug) return;
    const misnombres = this.appat.value.trim().split(" ");
    if(misnombres.length > 1) {
      this.appat.setValue(misnombres[0]);
      this.apmat.setValue(misnombres[1] || "");
      this.nompil1.setValue(misnombres[2] || "");
      this.nompil2.setValue(misnombres[3] || "");
    }
    
  }

  busca_nombres (  ) {
    let nombre = {
      appat: "",
      apmat: "",
      nompil1: "",
      nompil2: ""
   }
   
   const nombres = this.clientesService.obten_nombres(this.cliente.idnombre).subscribe( res => {
   if(this.debug)  console.log("Estoy en Clietes-form busca_nombres", res);

       nombre.appat = res.appat;
       nombre.apmat = res.apmat;
       nombre.nompil1 = res.nompil1;
       nombre.nompil2 = res.nompil2;
       this.form.get("appat").setValue(nombre.appat);
       this.form.get("apmat").setValue(nombre.apmat);
       this.form.get("nompil1").setValue(nombre.nompil1);
       this.form.get("nompil2").setValue(nombre.nompil2);

   });

  }

  get codigo(){
    return this.form.get("codigo");
  }


  get calle(){
    return this.form.get("calle");
  }

  get numpredio(){
    return this.form.get("numpredio");
  }

  get colonia(){
    return this.form.get("colonia");
  }


  get ciudad(){
    return this.form.get("ciudad");
  }

  get rfc(){
    return this.form.get("rfc");
  }

  get codpostal(){
    return this.form.get("codpostal");
  }

  get email(){
    return this.form.get("email");
  }

  get regimen(){
    return this.form.get("regimen");
  }

  get appat(){
    return this.form.get("appat");
  }

  get apmat(){
    return this.form.get("apmat");
  }
  
  get nompil1(){
    return this.form.get("nompil1");
  }
  
  get nompil2(){
    return this.form.get("nompil2");
  }
  
  get telefono(){
    return this.form.get("telefono");
  }
  
  aceptar() {
   if(this.debug) console.log("Hiciste click en aceptar");
   this.grabarUltimaCaptura();
   this.submitData.emit(this.form.value);
  }

  close() {
    if(this.debug) console.log("Hiciste click en Cancelar");
    this.submitData.emit(null);
  }

  grabarUltimaCaptura() {
    const datosultimacaptura = {
      appat: this.appat.value,
      apmat: this.apmat.value,
      nompil1: this.nompil1.value,
      nompil2: this.nompil2.value,
      calle: this.calle.value,
      numpredio: this.numpredio.value,
      colonia: this.colonia.value,
      codpostal: this.codpostal.value,
      ciudad: this.ciudad.value,
      telefono: this.form.get("telefono").value,
      email: this.email.value,
      regimen: this.regimen.value
    };
    if(this.debug) console.log("Grabando ultima captura", datosultimacaptura);
    localStorage.setItem(`edit_cliente_${this.numcia}`, JSON.stringify(datosultimacaptura));
  }

  alerta(mensaje: string) {
    const dialogref = this.dialog.open( DlgyesnoComponent, {
      width:'350px',
      data: mensaje
    });
    dialogref.afterClosed().subscribe(res => {
      //console.log("Debug", res);

    });
  
  }


}