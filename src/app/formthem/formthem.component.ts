import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionarioModel } from '../models/cuestionario.model';
import { HttpserviceService } from '../services/httpservice.service';
import { User } from '../models/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-formthem',
  templateUrl: './formthem.component.html',
  styleUrls: ['./formthem.component.css']
})
export class FormthemComponent {

  hideColorPicker: boolean = true;
  hideTextInput: boolean = true;
  color: string = "rgba(92,106,102)";
  colorBack: string = ""

  cuestio!: CuestionarioModel

  respuForm!: FormGroup

  respuForm2!: FormGroup


  user?: User | null;

  fromChange:boolean=true;



  input1: string = "#00897B";


  nameCu: any

  fondos: any
  colorLetra: any


  idcuestio: any


  isSubmitted = false;
  signUpForm!: FormGroup;
  datoslistar!: any

  datoslistar2!: any
  traerEstilos: any[] = []
  numeroRespuestas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


  respuestas: any[] = [];
  testeo: any



  test: number[] = [1, 2, 3];
  contador: any = 0
  formulario: any;
  colors: any;
  leftColor: any;
  toggle: boolean = false;
  selectedValue: string = "Selecciona";
  paseTipoLetratitulo!:string
  paseTipoLetratitulo2!:string


  selectedValue2: string = "Selecciona";


  selecteSize: string = "Selecciona";


  selecteSize2: string = "Selecciona";

  llegaronLosEstilos:boolean=false





  soups = [
    { id: 'LaBelleAurore', name: "LaBelle Aurore" },
    { id: 'OpenSans', name: "Open Sans" },
    { id: 'RubikPuddles-Regular', name: "Rubik Puddles Regular" },
    { id: 'RobotoMono-Italic-VariableFont_wght', name: 'Roboto Mono Italic' },
    { id: 'Kablammo-Regular-VariableFont', name: 'Kablammo Regular' },
    { id: 'JosefinSans-Italic-VariableFont_wght', name: 'Josefin Sans Italic' }


  ];


  sizes = [

    { id: '10px', name: "10" },
    { id: '15px', name: "15" },
    { id: '18px', name: "18" },
    { id: '20px', name: "20" },
    { id: '22px', name: '22' },

    { id: '24px', name: '24' },

    { id: '26px', name: '26' },

    { id: '28px', name: '28' },

    { id: '30px', name: '30' },

    { id: '32px', name: '32' },

    { id: '34px', name: '34' },

    { id: '40px', name: '40' },

    { id: '45px', name: '45' },

    { id: '55px', name: '55' }
  ];


  constructor(private rutaActiva: ActivatedRoute, private firebaseServiceService: HttpserviceService,
    public router: Router,
    private fb: FormBuilder) {
    this.cuestio = new CuestionarioModel()
    this.firebaseServiceService.user.subscribe(x => this.user = x);
    this.rutaActiva.snapshot.params

 
    this. traerPreguntas()
    console.log("Constructor");

  }






  ngOnInit(): void {
    console.log("ngon");
   
    this.testeo = this.rutaActiva.snapshot.paramMap.get('shareanswer');
    this.nameCu = this.rutaActiva.snapshot.paramMap.get('name');
    if (localStorage.getItem('idCues') != '') {
      //console.log(localStorage.getItem('idCues'))
      // console.log( this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!));

    } else {
      this.router.navigateByUrl('/home');
    }





  }


   traerEstilo() {


   
    console.log("Datos estilos fue llamado true")
     this.firebaseServiceService.getEstilo(localStorage.getItem('idCues')!).subscribe(resp => {

      
     console.log(resp.data())
      
      this.contador = 0;

      let temp = JSON.stringify(resp.data())
      let temp2 = JSON.parse(temp)

      //console.log("Estilos ");
      console.log(temp2)
      this.traerEstilos.push(temp2)

      //console.log(this.traerEstilos[0].letraPreguntas)
  
      //console.log(this.traerEstilos)
      this.color = this.traerEstilos[0].fondoPreguntas
      this.colorBack = this.traerEstilos[0].fondoGeneral
//console.log("El estilo traido desde la base: ")
      this.selectedValue = this.traerEstilos[0].letraTitulo
     // console.log(this.selectedValue)
     // localStorage.setItem("value",this.traerEstilos[0].letraTitulo)

      //console.log("desde traer estilo: "+this.paseTipoLetratitulo)
      this.selecteSize = this.traerEstilos[0].tamanoLetraTitulo
      this.selectedValue2 = this.traerEstilos[0].letraPreguntas
      this.selecteSize2 = this.traerEstilos[0].tamanoLetraPreguntas

   this.llegaronLosEstilos=true;
    },
      error => {
        console.error(error);
      }
    );

 
  }

  onChange() {


   // this.paseTipoLetratitulo=this.selectedValue;

    
  //  this.paseTipoLetratitulo2=this.paseTipoLetratitulo;
    
    //localStorage.setItem("value", this.paseTipoLetratitulo)
}



  traerPreguntas(){

    console.log("Trajo las preguntas")
  
this.datoslistar=""
    this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!).subscribe(resp => {
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

        }

      })
      //console.log("Datos preguntas")
      //console.log(this.datoslistar)
    },
      error => {
        console.error(error);
      }
    );

    setTimeout(() => {
      this.traerEstilo()
    }, 2000);


  }






  setColor(uncolor, colorLetra) {


    this.fondos = uncolor
    this.colorLetra = colorLetra


  }

  getTipoLetraTitulo(){
    return this.selectedValue
  }

  getColorLetras() {
    return this.colorLetra;

  }

  getColor() {

    let valores = this.color.replace(')', ',0.08)')

    // console.log("Trae"+valores)

    return valores;
  }

  getColorFull() {
    let colorBackFull = this.colorBack.replace(')', ',0.07)')

    // console.log("Trae"+valores)

    return colorBackFull;
  }

 

  getFontLetras2() {
    return this.selectedValue2
  }

  getSize() {
    return this.selecteSize
  }
  getSize2() {
    return this.selecteSize2
  }




  handleClick(myRadio: any, idcuestionario: any, pregunta: any, nomCategoria: any) {
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

        let elementoEliminado = this.respuestas.splice(posicionencontrado, 1)
        //console.log(elementoEliminado)
        this.respuestas.push({ myRadio, idcuestionario, pregunta, nomCategoria })
      } else {

        this.respuestas.push({ myRadio, idcuestionario, pregunta, nomCategoria })
      }

    } else {
      // console.log("else")
      this.respuestas.push({ myRadio, idcuestionario, pregunta, nomCategoria })
    }
    console.log("Agregada")
    console.log(this.respuestas)
    this.idcuestio = this.respuestas[0].idcuestionario

  }

  crearFormulario() {
    this.formulario = this.fb.group({
      experienciaLaboral: this.fb.array([])
    });
  }

  get experienciaLaboral(): FormArray {
    return this.formulario.get('experienciaLaboral') as FormArray;
  }




  guardarRespuestas() {
    let now = new Date();
    for (let i: any = 0; i < this.respuestas.length; i++) {
      this.respuForm = new FormGroup({

        nomCategoria: new FormControl(this.respuestas[i].nomCategoria),
        valor: new FormControl(this.respuestas[i].myRadio),
        idCuestionario: new FormControl(this.respuestas[i].idcuestionario),
        pregunta: new FormControl(this.respuestas[i].pregunta),
        fecha: new FormControl(now.toLocaleString()),
        idUsr: new FormControl(localStorage.getItem('token')
        )

      });
      this.firebaseServiceService.agregarRespuestas(this.respuForm.value).then(resp => {

      }).catch(error => {
        console.error(error)
      })

      this.respuForm2 = new FormGroup({

        idUsr: new FormControl(localStorage.getItem('token')),
        idCuestionario: new FormControl(localStorage.getItem('idCues')),

        fecha: new FormControl(now.toLocaleString())

      });
      //this.firebaseServiceService.registrarUsuarioConCuestionario(this.respuForm2.value).then(resp => {


      //}).catch(error => {
      //console.error(error)
      // })






    }

    let name = JSON.parse(localStorage.getItem('usr')!)

    console.log(name)

    this.respuForm2 = new FormGroup({

      idUsr: new FormControl(localStorage.getItem('token')),
      idCuestionario: new FormControl(this.idcuestio),
      multiRespuesta: new FormControl(false),
      fecha: new FormControl(now.toLocaleString()),
      nombre: new FormControl(this.user?.nombre),
      nomCuestionario: new FormControl(this.nameCu)

    });
    this.firebaseServiceService.registrarUsuarioConCuestionario(this.respuForm2.value).then(resp => {

      setTimeout(() => {

        this.router.navigateByUrl('/form-done-response');
      }, 1000);

    }).catch(error => {
      console.error(error)
    })

  }


  async guardarEstilo() {
    
    //console.log(this.paseTipoLetratitulo)
  

    //localStorage.setItem("value",this.paseTipoLetratitulo)
   // this.paseTipoLetratitulo2=this.paseTipoLetratitulo;

    //this.paseTipoLetratitulo=this.selectedValue


    //console.log("desde guardar estilo: "+ tipoTitulo)

    //console.log(this.paseTipoLetratitulo)
    this.firebaseServiceService.agregarEstilos(localStorage.getItem('idCues'), this.color, this.colorBack, this.selectedValue,
      this.selecteSize,


      this.selectedValue2,
      this.selecteSize2).then(resp => {

       // console.log(resp)

        console.log("Guardo")
  
       
      }).catch(error => {
        console.error(error)
      })

     
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      await Toast.fire({
        icon: 'success',
        title: 'Cambios guardados'
      })
    

     

  }


  Regresar() {

    this.router.navigateByUrl('/manejo-preguntas');
  }




}


