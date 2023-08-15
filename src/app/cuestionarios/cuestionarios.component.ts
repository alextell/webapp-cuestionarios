import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionarioModel } from '../models/cuestionario.model';
import { HttpserviceService } from '../services/httpservice.service';
import { User } from '../models/user';

@Component({
  selector: 'app-cuestionarios',
  templateUrl: './cuestionarios.component.html',
  styleUrls: ['./cuestionarios.component.css'],
})
export class CuestionariosComponent {
  cuestio!: CuestionarioModel;

  respuForm!: FormGroup;
  respuForm2!: FormGroup;
  user?: User | null;
  nameCu: any;
  idcuestio: any;
  isSubmitted = false;
  signUpForm!: FormGroup;
  datoslistar!: any;
  numeroRespuestas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  respuestas: any[] = [];
  testeo: any;

  test: number[] = [1, 2, 3];
  contador: any = 0;
  formulario: any;
  /**
   * Este constructor inicializa variables y se suscribe a un observable de usuario.
   * @param {ActivatedRoute} rutaActiva - ActivatedRoute es un servicio que proporciona acceso a
   * información sobre una ruta asociada a un componente. Contiene información sobre los parámetros de
   * la ruta, datos y otra información.
   * @param {HttpserviceService} firebaseServiceService - Este parámetro es del tipo
   * `HttpserviceService` y se utiliza para realizar solicitudes HTTP al servicio de Firebase. Se
   * inyecta en el constructor mediante inyección de dependencia.
   * @param {Router} router - El parámetro `router` es una instancia de la clase `Router` del módulo
   * Angular Router. Se utiliza para navegar entre diferentes rutas en su aplicación.
   * @param {FormBuilder} fb - El parámetro "fb" es una instancia de la clase FormBuilder, que se
   * utiliza para crear instancias de FormGroup y FormControl. Proporciona métodos convenientes para
   * crear controles de formulario y grupos con reglas de validación.
   */
  constructor(
    private rutaActiva: ActivatedRoute,
    private firebaseServiceService: HttpserviceService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.cuestio = new CuestionarioModel();
    this.firebaseServiceService.user.subscribe((x) => (this.user = x));
    this.rutaActiva.snapshot.params;
  }

  ngOnInit(): void {
    this.testeo = this.rutaActiva.snapshot.paramMap.get('shareanswer');
    this.nameCu = this.rutaActiva.snapshot.paramMap.get('name');
    if (localStorage.getItem('idCues') != '') {
      console.log(localStorage.getItem('idCues'));
      // console.log( this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!));

      this.firebaseServiceService
        .getPreguntas(localStorage.getItem('idCues')!)
        .subscribe(
          (resp) => {
            this.datoslistar = resp.map((e: any) => {
              //console.log(e)
              //console.log(e.payload.doc)
              // console.log(e.Object)

              return {
                idPregunta: e.payload.doc.id,
                idCuestionario: e.payload.doc.data().idCuestionario,
                idUsr: e.payload.doc.data().idUsr,
                pregunta: e.payload.doc.data().pregunta,
                nomCategoria: e.payload.doc.data().nomCategoria,
              };
            });
            console.log('Datos preguntas');
            console.log(this.datoslistar);
          },
          (error) => {
            console.error(error);
          }
        );
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  /**
   * La función handleClick maneja el evento de clic y actualiza la matriz de respuestas con los valores
   * del botón de opción seleccionado.
   * @param {any} myRadio - El valor del botón de opción en el que se hizo clic.
   * @param {any} idcuestionario - El parámetro `idcuestionario` es el ID del cuestionario. Se utiliza
   * para identificar el cuestionario específico con el que el usuario está interactuando.
   * @param {any} pregunta - El parámetro `pregunta` es una variable que representa una pregunta.
   * @param {any} nomCategoria - El parámetro `nomCategoria` es una variable que representa el nombre de
   * una categoría.
   */
  handleClick(
    myRadio: any,
    idcuestionario: any,
    pregunta: any,
    nomCategoria: any
  ) {
    let posicionencontrado = -1;
    if (this.respuestas.length > 0) {
      for (let i: any = 0; i < this.respuestas.length; i++) {
        // console.log(this.respuestas[i].pregunta);

        if (this.respuestas[i].pregunta == pregunta) {
          // console.log("Encontro una")
          posicionencontrado = i;
        } else {
          //console.log("no existe")
        }
      }
      // console.log("Variable posicionecntoro"+posicionencontrado)
      if (posicionencontrado != -1) {
        // console.log("Encontrado aqui"+posicionencontrado)

        let elementoEliminado = this.respuestas.splice(posicionencontrado, 1);
        //console.log(elementoEliminado)
        this.respuestas.push({
          myRadio,
          idcuestionario,
          pregunta,
          nomCategoria,
        });
      } else {
        this.respuestas.push({
          myRadio,
          idcuestionario,
          pregunta,
          nomCategoria,
        });
      }
    } else {
      // console.log("else")
      this.respuestas.push({ myRadio, idcuestionario, pregunta, nomCategoria });
    }
    console.log('Agregada');
    console.log(this.respuestas);
    this.idcuestio = this.respuestas[0].idcuestionario;
  }

  /**
   * La función crea un grupo de formularios con un array vacío para el campo.
   */
  crearFormulario() {
    this.formulario = this.fb.group({
      experienciaLaboral: this.fb.array([]),
    });
  }

  /**
   * La función devuelve el array de formularios 'experienciaLaboral' del grupo de formularios
   * 'formulario'.
   * @returns a FormArray.
   */
  get experienciaLaboral(): FormArray {
    return this.formulario.get('experienciaLaboral') as FormArray;
  }

  /**
   * La función `guardarRespuestas()` guarda las respuestas de los usuarios a un cuestionario en una
   * base de datos de Firebase.
   */
  guardarRespuestas() {
    let now = new Date();
    for (let i: any = 0; i < this.respuestas.length; i++) {
      this.respuForm = new FormGroup({
        nomCategoria: new FormControl(this.respuestas[i].nomCategoria),
        valor: new FormControl(this.respuestas[i].myRadio),
        idCuestionario: new FormControl(this.respuestas[i].idcuestionario),
        pregunta: new FormControl(this.respuestas[i].pregunta),
        fecha: new FormControl(now.toLocaleString()),
        idUsr: new FormControl(localStorage.getItem('token')),
      });
      this.firebaseServiceService
        .agregarRespuestas(this.respuForm.value)
        .then((resp) => {})
        .catch((error) => {
          console.error(error);
        });

      this.respuForm2 = new FormGroup({
        idUsr: new FormControl(localStorage.getItem('token')),
        idCuestionario: new FormControl(localStorage.getItem('idCues')),

        fecha: new FormControl(now.toLocaleString()),
      });
      //this.firebaseServiceService.registrarUsuarioConCuestionario(this.respuForm2.value).then(resp => {

      //}).catch(error => {
      //console.error(error)
      // })
    }

    let name = JSON.parse(localStorage.getItem('usr')!);

    console.log(name);

    this.respuForm2 = new FormGroup({
      idUsr: new FormControl(localStorage.getItem('token')),
      idCuestionario: new FormControl(this.idcuestio),
      multiRespuesta: new FormControl(false),
      fecha: new FormControl(now.toLocaleString()),
      nombre: new FormControl(this.user?.nombre),
      nomCuestionario: new FormControl(this.nameCu),
    });
    this.firebaseServiceService
      .registrarUsuarioConCuestionario(this.respuForm2.value)
      .then((resp) => {
        setTimeout(() => {
          this.router.navigateByUrl('/form-done-response');
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * The function "Regresar" navigates to the "/manejo-preguntas" route.
   */
  Regresar() {
    this.router.navigateByUrl('/manejo-preguntas');
  }
}
