export interface Movclis {
    id: number;
    idventa: number;
    fecha: string;
    coa: string;
    idconcepto: number;
    idpoliza: number;
    consecutivo: number;
    tipopago: string;
    recobon: number;
    importe: number;
    cobratario: string;
    usuario: string;
    status: string;
    idcobratario: number;
    idusuario: number;
    cia: number;
    concepto: string;
    cargos: number;
    abonos: number;
    bonifica: number;
    recargo: number;
}

export interface Movcliscsaldo extends Movclis {
    saldo: number;
}
