import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionarioModel } from '../models/cuestionario.model';
import { HttpserviceService } from '../services/httpservice.service';
import { User } from '../models/user';

@Component({
  selector: 'app-cuestionarios',
  templateUrl: './cuestionarios.component.html',
  styleUrls: ['./cuestionarios.component.css']
})
export class CuestionariosComponent {

  cuestio!:CuestionarioModel

  respuForm!: FormGroup

  respuForm2!: FormGroup


  user?: User | null;

  nameCu:any


  idcuestio:any


  isSubmitted = false;
  signUpForm!: FormGroup ;
  datoslistar!:any
  numeroRespuestas: number[] = [1,2,3,4,5,6,7,8,9,10];


  respuestas: any[] = [];
  testeo:any
  


  test: number[] = [1,2,3];
  contador:any=0
  formulario: any;
  constructor(private rutaActiva: ActivatedRoute, private firebaseServiceService: HttpserviceService,
  public router: Router,
  private fb: FormBuilder){
    this.cuestio=new CuestionarioModel()
    this.firebaseServiceService.user.subscribe(x => this.user = x);
    this.rutaActiva.snapshot.params
    
  }

 


  ngOnInit():void{

this.testeo=this.rutaActiva.snapshot.paramMap.get('shareanswer');
this.nameCu=this.rutaActiva.snapshot.paramMap.get('name');
    if(localStorage.getItem('idCues')!=''){
      console.log(localStorage.getItem('idCues'))
    // console.log( this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!));

    this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!).subscribe(resp => {
      this.datoslistar = resp.map((e: any) => {
        //console.log(e)
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
  }else{
    this.router.navigateByUrl('/home');
  }

  

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
  console.log("Agregada")
   console.log(this.respuestas)
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

 
  

 guardarRespuestas(){
  let now = new Date();
  for (let i:any = 0; i < this.respuestas.length; i++) {
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
  //this.firebaseServiceService.registrarUsuarioConCuestionario(this.respuForm2.value).then(resp => {
     
      
  //}).catch(error => {
    //console.error(error)
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

 Regresar(){

  this.router.navigateByUrl('/manejo-preguntas');
 }

  
 

}
