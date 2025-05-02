export interface Solicitud {
    id: number;
    idcliente: number;
    iddato: number;
    iddatosolicitud: number;
    status: string;
    cia: number;
    created_at: string;
    updated_at: string;

}

export interface Datosolicitud {
    id: number;
    concepto: string;
}

export interface Solicitudcompleta {
    cia: number;
    idcliente: number;
    datos:
    [
        Datosolicitud
    ]
}

export interface SolcitudExtendida {
    idcliente: number;
    ocupacion : string;
    ingresos: string;
    sexo: string;
    edad: string;
    edocivil: string;
    clientelugartrabajo: string;
    clienteteltrabajo: string;
    clientedirectrabajo: string;
    clienteantiguedadtrabajo: string;
    clienteconyugenombre: string;
    clienteconyugetrabajo: string;
    clienteconyugedirectrabajo: string;
    clienteconyugeocupacion: string;
    clienteconyugeteltrabajo: string;
    clienteconyugeantiguedad: string;
    avalgenerales:string;
    avalocupacion:string;
    avaltelefono:string;
    avalantiguedad:string;
    avaltrabajo:string;
    avalconyugenombre: string;
    avalconyugeocupacion: string;
    avalconyugeingresos: string;
    avalconyugetrabajo: string;
    avalconyugedirectrabajo: string;
    avalconyugeantiguedad: string;
    avalconyugetelefono: string;
    familiarnombre:string;
    familiardirec:string;
    conocidonombre:string;
    conocidodirec:string;
    referencia1:string;
    referencia2:string;
    observaciones:string;
}

export enum CLAVES_SOLICIT {
    OCUPACION = 5, 
    CLIENTE_LGAR_TRABAJO =  10,
    CLIENTE_TEL_TRABAJO = 15,
    CLIENTE_DIREC_TRABAJO = 20,
    CLIENTE_CONYUGE_NOMBRE = 25,
    CLIENTE_CONYUGE_OCUPACION = 30,
    CLIENTE_CONYUGE_TRABAJO = 35,
    CLIENTE_CONYUGE_TEL_TRABAJO = 40,
    CLIENTE_CONYUGE_DIREC_TRABAJO = 45,
    AVAL_GENERALES = 50,
    AVAL_CONYUGE_OCUPACION = 55,
    AVAL_OCUPACION = 60,
    AVAL_TELFONO = 65,
    AVAL_TRABAJO = 70,
    CONOCIDO_NOMBRE = 75,
    CONOCIDO_DIREC = 80,
    CONOCIDO_TELEFONO_DIREC = 85,
    FAMILIAR_NOMBRE = 90,
    FAMILIAR_DIREC = 95,
    FAMILIAR_TELFONO = 95,
    AVAL_CONYUGE_NOMBRE = 105,
    AVAL_CONYUGE_OCUPACION2 = 110,
    AVAL_CONYUGE_TRABAJO = 115,
    AVAL_CONYUGE_TELEFONO = 120,
    AVAL_CONYUGE_DIREC_TRABAJO  = 125,
    CLIENTE_INGRESOS = 130,
    CLIENTE_SEXO = 135,
    CLIENTE_EDAD =  140,
    CLIENTE_EDOCIVIL = 145,
    CLIENTE_ANTIGUEDAD_TRABAJO = 150,
    AVAL_ANTIGUEDAD_TRABAJO = 155,
    AVAL_CONYUGE_ANTIGUEDAD = 160,
    CLIENTE_DEPENDIENTES =  165,
    CLIENTE_CONYUGE_INGRESOS = 170,
    CLIENTE_CONYUGE_ANTIGUEDAD = 175,
    AVAL_INGRESOS = 180,
    AVAL_CONYUGE_INGRESOS = 185,
    REFERENCIA1 = 500,
    REFERENCIA1A = 505,
    REFERENCIA2 = 510,
    OBSERVACIONES = 515,
    EMAIL_CONTACTO_CLIENTE = 520,
    NUMERO_VENCES_IMPRESION_FACTURA = 610,
    FECHA_CIERRE_VENTA = 655,
    LETRASIMPRESAS = 700,
    DIAS_GRACIA_CLIENTE = 810,
    IMAGENES_GRABADAS = 880,
 }

export enum TIPOS_SOLICIT {
    CLIENTE = 1,
    AVAL = 2,
    VENTA = 3,
    FACTURA = 4
}
