export interface Ventas {
        idventa: number;
        codigo: string;
        idcliente: number;
        fecha: string;
        idtienda: number;
        siono: string;
        qom: string;
        ticte: string;
        letra1: number;
        piva: number;
        enganc: number;
        nulets: number;
        canle: number;
        bonifi: number;
        servicio: number;
        precon: number;
        idvendedor: number;
        comision: number;
        descto: number;
        prodfin: number;
        idcarta: number;
        idfactura: number;
        idpromotor: number;
        comisionpromotor: number;
        cargos: number;
        abonos: number;
        idubica: number;
        status: string;
        opcion: string;
        cia: number;
        createdAt: Date;
        updatedAt: Date
        fechasaldo: string;
}

export interface VentasCompletas extends Ventas {
    nombre: string;
    ubica: string;
    numfac: number;
    saldo: number;
    compra: string;
    seriefac: string;

}
