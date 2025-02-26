export interface Avales {
    id: number;
    codigo: string;
    idventa: number;
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

export interface AvalCompleto extends Avales {
    ciudad: string;
}
