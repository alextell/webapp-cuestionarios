import { Component } from '@angular/core';
import { CuestionarioModel } from '../models/cuestionario.model';
import { FormArray, FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpserviceService } from '../services/httpservice.service';
import { EncryService } from '../services/encry.service';

@Component({
  selector: 'app-sharecuestionario',
  templateUrl: './sharecuestionario.component.html',
  styleUrls: ['./sharecuestionario.component.css']
})
export class SharecuestionarioComponent {

  title = "Angular Form Validation Tutorial";
  angForm!: FormGroup;

  myForm!: FormGroup;
  user?: User | null;
  cuestio!:CuestionarioModel

  nameCu:any

  respuForm!: FormGroup

  traerEstilos: any[] = []


  respondioCuestionario!: FormGroup

  respuForm2!: FormGroup


  isSubmitted = false;
  signUpForm!: FormGroup ;
  datoslistar!:any
  numeroRespuestas: number[] = [1,2,3,4,5,6,7,8,9,10];

  idcuestio:any


  respuestas: any[] = [];

  testeo:any


  test: number[] = [1,2,3];
  contador:any=0
  formulario: any;

  datosVerificasiRespondidoIDusuario:any=""
  datosVerificasiRespondidoIDcuestionario:any=""
  esMultirespuesta:any
  color: any;
  colorBack: any="";
  selectedValue: any;
  selecteSize: any;
  selectedValue2: any;
  selecteSize2: any;
  llegaronLosEstilos: boolean=false;
  fondos: any;
  colorLetra: any;


  formBuilder: any;

  userForm!: FormGroup;

  constructor(private rutaActiva: ActivatedRoute,private firebaseServiceService: HttpserviceService,
    public router: Router,
    private fb: FormBuilder,
    private CRY:EncryService
    ){
      this.firebaseServiceService.user.subscribe(x => this.user = x);
    this.rutaActiva.snapshot.params








  }


  ngOnInit() {

    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', Validators.required),
        passwordRepeat: new FormControl('', Validators.required)
    });



let miURL=this.rutaActiva.snapshot.paramMap.get('shareanswer');


//console.log("Esta desencriptando")

let desURL=decodeURIComponent(miURL!)
/*
console.log("DesURL: "+desURL)
console.log("Cadena desen:"+
this.CRY.encriptacion("DEC",desURL))

//this.nameCu=this.rutaActiva.snapshot.paramMap.get('name');
*/

let arr = this.CRY.encriptacion("DEC",desURL).split(':');

this.nameCu=arr[1]

this.testeo=arr[0]

this.firebaseServiceService.verificaSiYarespondio(this.testeo,localStorage.getItem('token')).subscribe(resp => {

  resp.forEach(element => {

    console.log(element)
    let datos=JSON.stringify(element.data())

    let datos2=JSON.parse(datos)

    this.datosVerificasiRespondidoIDusuario=datos2["idUsr"]


    this.datosVerificasiRespondidoIDcuestionario=datos2["idCuestionario"]

    this.esMultirespuesta=datos2["multiRespuesta"]



    console.log(this.datosVerificasiRespondidoIDusuario)






  });

  setTimeout(()=>{
    this.verificarCuestionario()
  }, 1000);

},
error => {
  console.error(error);
}
);




  }

  verificarCuestionario(){

    if(this.datosVerificasiRespondidoIDusuario==""){
      console.log("primer if")
      console.log(this.datosVerificasiRespondidoIDusuario)

    if(localStorage.getItem('idCues')!=''){
      console.log("Segundo if")

    // console.log( this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!));

    this.traerDatosDePreguntas()


    }else{
      this.router.navigateByUrl('/principal');
    }

    }else{
      console.log(this.esMultirespuesta)
      if(this.esMultirespuesta){

    this.traerDatosDePreguntas()
      }else{


        this.router.navigateByUrl('/alreadyresponded');


      }
    }
  }


  traerEstilo() {



    console.log("Datos estilos fue llamado true")
     this.firebaseServiceService.getEstilo(this.testeo!).subscribe(resp => {


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


  traerDatosDePreguntas(){
    console.log("llegaa a traer preguntas")
    console.log(this.testeo)
    this.firebaseServiceService.getPreguntas(this.testeo).subscribe(resp => {
      this.datoslistar = resp.map((e: any) => {
        console.log(e)
        //console.log(e.payload.doc)
       // console.log(e.Object)

        return {
          idPregunta: e.payload.doc.id,
          idCuestionario: e.payload.doc.data().idCuestionario,
          idUsr: e.payload.doc.data().idUsr,
          pregunta:e.payload.doc.data().pregunta,
          nomCategoria:e.payload.doc.data().nomCategoria
        }

      })
      console.log("Datos preguntas")
      console.log(this.datoslistar)
    },
      error => {
        console.error(error);
      }
    );
    this.traerEstilo()
  }


  handleClick(myRadio:any,idcuestionario:any,pregunta:any,nomCategoria:any){
    let posicionencontrado=-1;
      if(this.respuestas.length>0){

        for (let i:any = 0; i < this.respuestas.length; i++) {
         // console.log(this.respuestas[i].pregunta);

          if(this.respuestas[i].pregunta==pregunta){
           // console.log("Encontro una")
           posicionencontrado=i;
          }else{
    //console.log("no existe")

          }

        }
       // console.log("Variable posicionecntoro"+posicionencontrado)
        if(posicionencontrado!=-1){
         // console.log("Encontrado aqui"+posicionencontrado)

    let elementoEliminado = this.respuestas.splice(posicionencontrado,1)
    //console.log(elementoEliminado)
    this.respuestas.push({myRadio,idcuestionario,pregunta,nomCategoria})
        }else{

    this.respuestas.push({myRadio,idcuestionario,pregunta,nomCategoria})
        }

      }else{
       // console.log("else")
         this.respuestas.push({myRadio,idcuestionario,pregunta,nomCategoria})
      }
    console.log("Agregadas")
     console.log(this.respuestas[0].idcuestionario)
     this.idcuestio=this.respuestas[0].idcuestionario

      }

    crearFormulario() {
      this.formulario = this.fb.group({
        experienciaLaboral: this.fb.array([])
      });
    }

    get experienciaLaboral(): FormArray {
      return this.formulario.get('experienciaLaboral') as FormArray;
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



   guardarRespuestas(){
    let now = new Date();
    for (let i:any = 0; i < this.respuestas.length; i++) {

      console.log("Dentro del  for")

      console.log(this.respuestas[i].idcuestionario)
    this.respuForm= new FormGroup({

      nomCategoria:new FormControl(this.respuestas[i].nomCategoria),
      valor: new FormControl(this.respuestas[i].myRadio),
      idCuestionario: new FormControl(this.respuestas[i].idcuestionario),
      pregunta:new FormControl(this.respuestas[i].pregunta),
      fecha:new FormControl(now.toLocaleString()),
      idUsr:new FormControl(localStorage.getItem('token')
      )

    });
    this.firebaseServiceService.agregarRespuestas(this.respuForm.value).then(resp => {


    }).catch(error => {
      console.error(error)
    })

    this.respuForm2= new FormGroup({

      idUsr: new FormControl( localStorage.getItem('token')),
      idCuestionario: new FormControl(localStorage.getItem('idCues')),

      fecha:new FormControl(now.toLocaleString())

    });
   // this.firebaseServiceService.registrarUsuarioConCuestionario(this.respuForm2.value).then(resp => {


   // }).catch(error => {
     // console.error(error)
   // })






  }

let name=JSON.parse(localStorage.getItem('usr')!)

console.log(name)

  this.respuForm2= new FormGroup({

    idUsr: new FormControl( localStorage.getItem('token')),
    idCuestionario: new FormControl(this.idcuestio),
    multiRespuesta: new FormControl(false),
    fecha:new FormControl(now.toLocaleString()),
    nombre:new FormControl(this.user?.nombre),
    nomCuestionario:new FormControl(this.nameCu)

  });
  this.firebaseServiceService.registrarUsuarioConCuestionario(this.respuForm2.value).then(resp => {

    setTimeout(()=>{

  this.router.navigateByUrl('/form-done-response');
    }, 1000);

  }).catch(error => {
    console.error(error)
  })



   }

   createForm() {
    console.log("AppComponent::createForm");
    this.angForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(5)]],
      surname: ["", Validators.required]
    });

    this.angForm.controls["name"].valueChanges.subscribe(data => {
      console.log(data);
    });
  }

  onSubmit() {
    if (this.angForm.valid) {
      console.log(this.angForm.value);
    } else {
      alert("ERROR!");
    }
  }




}
