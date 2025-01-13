export interface Polizas {
    id: number;
    tda: string;
    fecha: string;
    bonif: number;
    recar: number;
    importe: number;
    idtienda: number;
    iduuid: number;
    idfactura: number;
    status: string;
    cia: number;
}

export interface PolizasCompletas  extends Polizas {
    nombretda: string;
    
}