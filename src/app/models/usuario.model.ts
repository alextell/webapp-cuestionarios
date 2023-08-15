/**
 * Modelo de usuario 
 */
import { Role } from "./role";
export class UsuarioModel{
    idUsuario!:string;
    correo!: string;
    contrasenia!: string;
    nombre!: string;
    codigo!: string;
    usuario!: string;
    token!:string
    fechainicio!:string
    fechafin!: string
    totalPiezasContadas!: bigint
    totalCodigosContados!: bigint
    numeroIncidencias!: number
    bandera!:number
    idInventario!:number;
    role!:Role;
   
}

