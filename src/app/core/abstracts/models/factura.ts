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
    codigousocfdi: string;
    conceptousocfdi: string;
    codigometodopago: string;
    conceptometodopago: string;
    uuid: string;

}

export interface FacturaCompleta extends Factura {
    regimen: string;
    email: string;
    rfc: string;
    renglones: Renfac[]
}
