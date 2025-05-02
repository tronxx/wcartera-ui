import { Renfac } from './renfac';
export interface Factura  {
    id: number;
    serie: string;
    numero: number;
    idventa: number;
    fecha: string;
    iduuid: number;
    idusocfdi: number;
    idmetodopago: number;
    importe: number;
    iva: number;
    total: number;
    status: string;
    cia: number;
    tipofac: number;
    codigousocfdi: string;
    conceptousocfdi: string;
    codigometodopago: string;
    conceptometodopago: string;
    uuid: string;

}

export interface FacturaCompleta extends Factura {
    regimen: string;
    codigoregimen: string;
    email: string;
    rfc: string;
    renglones: Renfac[]
}


export enum TIPOS_FAC {
    VENTA = 1,
    PAGO_3_2 = 2,
    NOTA_CREDITO = 3,
    PAGO_3_3 = 4,
    RECARGO = 5,
    ENGANCHE = 6
}
