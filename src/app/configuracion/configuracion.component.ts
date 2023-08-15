import { Component } from '@angular/core';
import { HttpserviceService } from '../services/httpservice.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent {
  datoslistar: any;
  editarPreguntas: any = '';

  campoEditado!: string;
  sinEditaridUsr!: string;

  lista: string[] = ['Admin', 'User', 'Colaborador'];
  seleccionado: any;

  campoEditadoNombre: any;
  campoEditadoUsuario!: string;
  campoEditadoRole!: string;

  campoEmail!: string;

  usuarioEditado!: FormGroup;
  constructor(
    private firebaseServiceService: HttpserviceService,
    public router: Router
  ) {
    // console.log("Aqui llega")
  }

  /**
   * La función ngOnInit se llama cuando se inicializa el componente y llama a la función cargarDatos.
   */
  ngOnInit(): void {
    // console.log("Aqui llega")
    this.cargarDatos();
  }

  /**
   * La función "cargarDatos" recupera datos de un servicio de Firebase y los mapea en una matriz de
   * objetos.
   */

  cargarDatos() {
    var date;
    this.firebaseServiceService.getUsuariosALL().subscribe(
      (resp) => {
        this.datoslistar = resp.map((e: any) => {
          //console.log(e.payload.doc.id)
          //console.log(e.payload.doc)
          return {
            idUsr: e.payload.doc.data().idUsr,
            nombre: e.payload.doc.data().nombre,
            usuario: e.payload.doc.data().usuario,
            role: e.payload.doc.data().role,
            email: e.payload.doc.data().email,
            uid: e.payload.doc.id,
          };
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * La función "cancelar" borra el valor de la variable "editarPreguntas".
   */
  cancelar() {
    this.editarPreguntas = '';
  }

  /**
   * Esta función se utiliza para guardar la información de usuario editada en una base de datos de
   * Firebase.
   * @param {any} idUsr - El id del usuario que se está editando.
   * @param {any} uid - El parámetro `uid` es el identificador único del usuario. Se utiliza para
   * identificar al usuario en la base de datos.
   */
  guardarEdicionPregunta(idUsr: any, uid: any) {
    console.log('Para guaradat');
    console.log(idUsr);
    this.editarPreguntas = '';
    this.usuarioEditado = new FormGroup({
      role: new FormControl(this.seleccionado),
      nombre: new FormControl(this.campoEditadoNombre),
      usuario: new FormControl(this.campoEditadoUsuario),
      email: new FormControl(this.campoEmail),
      idUsr: new FormControl(this.sinEditaridUsr),
      banderaCambios: new FormControl('1'),
    });
    this.firebaseServiceService
      .guardarUsuarioEditado(idUsr, uid, this.usuarioEditado.value)
      .then((resp) => {
        Swal.fire('Guardado!', 'Cambio guardado con exito!', 'success');
        this.editarPreguntas = '';
      })
      .catch((error) => {
        Swal.fire('Error!', 'Error al guardar', 'error');
        console.error(error);
      });
  }

  eliminarPregunta(id: any) {}

  /**
   * La función "editarPregunta" toma varios parámetros y asigna sus valores a diferentes variables.
   * @param {any} uid -
   * @param {any} idusr - El id del usuario cuya pregunta se está editando.
   * @param {any} nombre - El parámetro "nombre" es el nuevo nombre que desea actualizar para el usuario.
   * @param {any} usuario - El parámetro "usuario" es el nombre de usuario del usuario cuya pregunta se
   * está editando.
   * @param {any} role - El parámetro de rol representa el rol del usuario. Podría ser un valor de cadena
   * como "administrador", "usuario" o "invitado".
   * @param {any} email - El parámetro de correo electrónico es la dirección de correo electrónico del
   * usuario.
   */
  editarPregunta(
    uid: any,
    idusr: any,
    nombre: any,
    usuario: any,
    role: any,
    email: any
  ) {
    console.log(uid);
    this.editarPreguntas = idusr;
    this.sinEditaridUsr = idusr;
    this.seleccionado = role;
    this.campoEditadoNombre = nombre;
    this.campoEditadoUsuario = usuario;
    this.campoEmail = email;
  }
}
