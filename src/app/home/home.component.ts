import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CuestionarioModel } from '../models/cuestionario.model';
import { HttpserviceService } from '../services/httpservice.service';

import { User } from '../models/user';
import { Role } from '../models/role';

import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { EncryService } from '../services/encry.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalRef: MdbModalRef<ModalComponent> | null = null;

  undato: string | undefined
  [x: string]: any;
  cuestionario!: FormGroup
  collection = { count: 0, data: [] }
  datos: any
  cuestion: CuestionarioModel
  datoslistar: any[] = []
  RecientesArreglo: any
  datoslistarRecientes: any[] = []
  idsCuestionarios: any[] = []
  datoslistar2!: any
  displayname: any
  contador: any = 0
  user?: User | null;
  userFromApi?: any;
  loading = false;
  contenoRealizado: any[] = [];
  constructor(
    private firebaseServiceService: HttpserviceService,
    public router: Router,
    private modalService: MdbModalService,
    private CRY: EncryService
  ) {
    this.cuestion = new CuestionarioModel()
    this.user = <User>this.firebaseServiceService.userValue;
    this.firebaseServiceService.user.subscribe(x => this.user = x);
  }

  test() {
    this.router.navigateByUrl('/form-done-response');
  }

  ngOnInit(): void {
    localStorage.removeItem('idCues')
    localStorage.removeItem('nomC')
    //console.log(this.user?.role)
    this.cargarDatos()
    console.log(this.datoslistar)
    if (!this.isAdmin) {
      this.traerCuestionariosRecientes()
    }

  }

  get isAdmin() {
    console.log()
    return this.CRY.encriptacion("", this.user?.ADhdl) === Role.Admin;
  }

  get isColl() {
    console.log()
    return this.CRY.encriptacion("", this.user?.ADhdl) === Role.Colaborador;
  }



  async cargarDatos() {
    this.datoslistar = [""]
    var date
    this.firebaseServiceService.getCuestionarios(this.isAdmin, localStorage.getItem('token')).subscribe(resp => {

      this.contador = 0;
      resp.forEach(element => {
        let datos = JSON.stringify(element.data())

        datos = datos.replace("}", ",\"uid\":\"" + element.id + "\"}");
        // console.log(datos)
        this.datoslistar[this.contador] = JSON.parse(datos)

        this.contador++

      });

      setTimeout(() => {
        // this.contarPreguntas()
      }, 1000);


      // console.log(this.datoslistar)

    },
      error => {
        console.error(error);
      }
    );



  }


  async cargarDatosRecientes(idCuestionario: any) {


    var date
    this.firebaseServiceService.getCuestionariosRecientesTodos(idCuestionario).subscribe(resp => {
      this.contador = 0;

      let temp = JSON.stringify(resp)
      let temp2 = JSON.parse(temp)

      // console.log(temp2)
      this.datoslistarRecientes.push(temp2)

      // console.log(this.datoslistarRecientes)



    },
      error => {
        console.error(error);
      }
    );
  }


  traerCuestionariosRecientes() {
    while (this.datoslistarRecientes.length > 0) {
      this.datoslistarRecientes.pop();
    }

    console.log("Traer Recientes")
    this.firebaseServiceService.taerSoloRecientesCuestionarios(this.isAdmin, localStorage.getItem('token')).subscribe(resp => {
      this.contador = 0;
      resp.forEach(element => {

        console.log(element.data())

        let datos = JSON.stringify(element.data())
        let datos2 = JSON.parse(datos)

        console.log(datos2["idCuestionario"])

        this.cargarDatosRecientes(datos2["idCuestionario"])

      });
      // console.log(this.datoslistar)
    },
      error => {
        console.error(error);
      }
    );
  }





  contarPreguntas() {

    this.datoslistar.forEach(element => {
      let cuantas = 0
      let contador = 0



      let unID = element.uid
      //console.log(unID)

      this.firebaseServiceService.contarPreguntas(unID).subscribe(resp => {

        resp.forEach(element => {

          //
          cuantas++

        });

        this.contenoRealizado.push(cuantas)
        contador++
        cuantas = 0;

        console.log(this.contenoRealizado)

      })
      // console.log(this.contenoRealizado[cuentas])
      //  console.log(this.datoslistar2.length)


    },
      (      error: any) => {
        console.error(error);
      }
    );

  }


  async crearCuestionario() {


    Swal
      .fire({
        title: "Nombre para cuestionario",
        input: "text",
        toast: true,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      })
      .then(resultado => {
        if (resultado.isConfirmed) {

          if (resultado.value) {

            if (!this.firebaseServiceService.tiene_letras_especiales(resultado.value)) {
              // console.log("Tiene caracter")


              let now = new Date();
              this.cuestionario = new FormGroup({
                idUsr: new FormControl(localStorage.getItem('token')),
                nomCuestionario: new FormControl(resultado.value),
                fechaCrea: new FormControl(now.toLocaleString()),
                noPreguntas: new FormControl(0),
                fondoGeneral: new FormControl("rgb(47,47,47)"),
                fondoPreguntas: new FormControl("rgb(4,4,4)"),
                letraTitulo: new FormControl(""),
                tamanoLetraTitulo: new FormControl(""),
                letraPreguntas: new FormControl(""),
                tamanoLetraPreguntas: new FormControl("")
              });
              this.firebaseServiceService.crearCuestionario(this.cuestionario.value, this.isAdmin, localStorage.getItem("token")).then(resp => {
                setTimeout(() => {
                  this.cargarDatos()
                }, 100);
              }).catch(error => {
                console.error(error)
              })
              let nombre = resultado.value;
              console.log("Hola, " + nombre);
            } else {
              Swal.fire({
                title: 'Error de nombre',
                text: "El nombre no debe contener caracteres especiales",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Intentar de nuevo',
                denyButtonText: `Cancelar`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.crearCuestionario()
                } else if (result.isDenied) {

                }
              })

            }

          } else {
            Swal.fire({
              title: 'Error de nombre',
              text: "Captura un nombre valido",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Intentar de nuevo',
              denyButtonText: `Cancelar`,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                this.crearCuestionario()
              } else if (result.isDenied) {

              }
            })
          }
        }
      });
  }


  async agregarPreguntas(idcuestionario: string, nomCuestionario: string) {
    (async () => {


      localStorage.setItem('idCues', idcuestionario)
      localStorage.setItem('nomC', nomCuestionario)

      this.router.navigateByUrl('/agregarpreguntas');



    })()


  }

  verPreguntas(idCuestionario: string, noPreguntas: number) {
    if (noPreguntas > 0) {
      localStorage.setItem('idCues', idCuestionario)
      this.router.navigateByUrl('/manejo-preguntas');
    } else {
      Swal.fire("Sin preguntas para ver");
    }
  }

  verRespuestas(idCuestionario: string, noPreguntas: number) {
    if (noPreguntas > 0) {
      localStorage.setItem('idCues', idCuestionario)
      this.router.navigateByUrl('/ver-respuestas');
    } else {
      Swal.fire("Sin respuestas para ver");
    }
  }

  formTeme(idCuestionario: string, noPreguntas: number, nombreCu: string) {
    if (noPreguntas > 0) {
      localStorage.setItem('idCues', idCuestionario)
      this.router.navigateByUrl('/formthem/' + idCuestionario + "/" + nombreCu);
    } else {
      Swal.fire("Agrega algunas preguntas");
    }
  }

  responderQues(idCuestionario: string, noPreguntas: number, nombreCu: string) {
    if (noPreguntas > 0) {
      localStorage.setItem('idCues', idCuestionario)
      this.router.navigateByUrl('/cuestionarios/' + idCuestionario + "/" + nombreCu);
    } else {
      Swal.fire("Sin preguntas para responder");
    }
  }


  openModal(idCuestionario: string, preguntas: number, nombreCues: string) {
    console.log("Segunda prueba")
    let laUR = this.CRY.encriptacion("ENC", idCuestionario + ":" + nombreCues);
    let palabras = this.CRY.generaNss(8)





    if (preguntas > 0) {
      this.modalRef = this.modalService.open(ModalComponent, {
        data: {
          title: 'Enviar cuestionario',
          info: laUR,
          name: palabras
        },
        modalClass: 'modal-lg'
      });
    } else {
      Swal.fire("Sin preguntas para compartir");
    }
  }

  async compartirCuestionario(item: any) {

    const { value: formValues } = await Swal.fire({
      title: 'Enviar cuestionario',
      html:
        ' <fieldset> <legend>Select a maintenance drone:</legend>' +
        '<div>' +
        ' <input type="radio" id="huey" name="drone" value="Anonimo" checked> <label for="huey">Huey</label> </div>' +
        '<div>' +
        ' <input type="radio" id="huey" name="drone" value="" checked> <label for="huey">Huey</label> </div>' +
        '<input id="swal-input1" class="swal2-input"  placeholder="Nombre">' +

        '</fieldset>',



      focusConfirm: false,
      confirmButtonText: 'Crear cuestionario',
      preConfirm: () => {
        return (document.getElementById('swal-input1') as HTMLInputElement).value

      }
    })

    if (formValues != '') {
    }

  }

  eliminarCuestionario(item: any) {
    Swal.fire({
      title: '¿Estas seguro de eliminar este cuestionario y las preguntas asociadas?',
      text: "Esta accion no puede ser revertida",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí,eliminalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.firebaseServiceService.eliminarCuestionario(item);


        setTimeout(() => {
          this.cargarDatos()
        }, 1000);
        // this.firebaseServiceService.eliminarPreguntaASociadaACuestionario(item);
        Swal.fire(
          'Eliminado!',
          'Cuestionario eliminado',
          'success'
        )

      } else {
        Swal.fire(
          'Cancelado!',
          'Nada fue eliminado',
          'info'
        )
      }
    })


  }

}
