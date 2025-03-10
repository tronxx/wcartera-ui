export interface ClientesDto {
    id: number;
    codigo: string;
    idciudad: number;
    codpostal: string;
    idnombre: number;
    calle: string;
    numpredio: string;
    colonia: string;
    direc: string;
    telefono: string;
    email: string;
    idregimen: number;
    rfc: string;
    status: string;
    cia: number;
    created_at: string;
    updated_at: string;

}

export interface ClienteDtoCompleto extends ClientesDto {
    appat: string;
    apmat: string;
    nompil1: string;
    nompil2: string;
}
