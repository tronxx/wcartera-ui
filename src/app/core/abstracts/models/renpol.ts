export interface Renpol {
    id: number;
    idpoliza: number;
    conse: number;
    idventa: number;
    sino: string;
    concepto: string;
    tipo: string;
    rob: number;
    importe: number;
    recargos: number;
    bonificacion: number;
    vence: string;
    comision: number;
    dias: number;
    tienda: string;
    cobratario: string;
    letra: number;
    iduuid: number;
    idfactura: number;
    cia: number;
    salcli: number;
    created_at: string;
}

export interface Renpolcompleto extends Renpol {
    codigo: string;
    idventa: number;
    codcli: string;
    nombre: string;
}