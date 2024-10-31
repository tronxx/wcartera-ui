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
    avalconyugeantiguedad: string;
    avalconyugeatelefono: string;
    familiarnombre:string;
    familiardirec:string;
    conocidonombre:string;
    conocidodirec:string;
    referencia1:string;
    referencia2:string;
    observaciones:string;
}
