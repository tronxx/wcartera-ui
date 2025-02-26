export interface Clientes {
    id: number;
    codigo: string;
    idciudad: number;
    codpostal: string;
    idnombre: number;
    nombre: string;
    calle: string;
    numpredio: string;
    colonia: string;
    telefono: string;
    email: string;
    idregimen: number;
    rfc: string;
    status: string;
    cia: number;
    created_at: string;
    updated_at: string;

}

export interface ClienteCompleto extends Clientes {
    appat: string;
    apmat: string;
    nompil1: string;
    nompil2: string;
}
