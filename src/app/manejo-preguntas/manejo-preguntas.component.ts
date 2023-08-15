import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-manejo-preguntas',
  templateUrl: './manejo-preguntas.component.html',
  styleUrls: ['./manejo-preguntas.component.css']
})
export class ManejoPreguntasComponent {
[x: string]: any;
  datoslistar!:any
  preguntaeditada!:FormGroup

  editarPreguntas:any;


  noPreguntasActual=0

  campoEditado!:string

  constructor( private firebaseServiceService: HttpserviceService,
    public router: Router,){
    
  }
  ngOnInit():void{
   
    if(localStorage.getItem('idCues')!=''){
      console.log(localStorage.getItem('idCues'))
    // console.log( this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!));

    this.firebaseServiceService.getPreguntas(localStorage.getItem('idCues')!).subscribe(resp => {
      this.datoslistar = resp.map((e: any) => {
        //console.log(e.payload.doc.id)
        //console.log(e.payload.doc)
      // console.log( e.payload.doc.id)
     
       
        return {
          
          idPregunta: e.payload.doc.id,
          idCuestionario: e.payload.doc.data().idCuestionario,          
          idUsr: e.payload.doc.data().idUsr,
          pregunta:e.payload.doc.data().pregunta
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
  
  
  verCuestionario(){
    this.router.navigateByUrl('/cuestionarios');
  }

  async editarPregunta(idpregunta:any,pregunta:any){
    this.campoEditado=pregunta;
this.editarPreguntas=idpregunta;
  }
  
  guardarEdicionPregunta(idpregunta:any,idCuestionario:any){
  
    let now = new Date();
      this.preguntaeditada= new FormGroup({
        idCuestionario: new FormControl( idCuestionario),
        pregunta: new FormControl(this.campoEditado),
        idUsr:new FormControl(localStorage.getItem('token'))
      
        
        
      });

   
    this.firebaseServiceService.guardarPreguntaEditada(idpregunta,this.preguntaeditada.value).then(resp => {
      Swal.fire(
        'Guardado!',
        'Cambio guardado con exito!',
        'success'
      )
     
this.editarPreguntas="";
        }).catch(error => {
          Swal.fire(
            'Error!',
            'Error al guardar',
            'error'
          )
          console.error(error)
        })
    
  }

  eliminarPregunta(idPregunta:any){
    Swal.fire({
      title: '¿Estas seguro de eliminar este pregunta',
      text: "Esta accion no puede ser revertida",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí,eliminala!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.firebaseServiceService.eliminarPreguntaUnica(idPregunta);
       // this.firebaseServiceService.eliminarPreguntaASociadaACuestionario(item);
        Swal.fire(
          'Eliminado!',
          'Pregunta eliminada',
          'success'
        )


  this.firebaseServiceService.getUnoCuestionario(localStorage.getItem('nomC')).subscribe(resp => {
    resp.forEach(element => {
  
   
      let datos=JSON.stringify(element.data())
      let unDatops=JSON.parse(datos)

      if(unDatops.noPreguntas){
  
      this.noPreguntasActual=unDatops.noPreguntas
  
      }else{
  
      this.noPreguntasActual=0
  
      }

      //console.log(this.noPreguntasActual)

    })




let sumita=this.noPreguntasActual-1
    this.firebaseServiceService.agregarCuantasPreguntas(localStorage.getItem("idCues"),sumita).then(resp => {
      console.log("Guardo")
       
}).catch(error => {
 console.error(error)
})

  },
  error => {
    console.error(error);
  }
  );

      }else{
        Swal.fire(
          'Cancelado!',
          'Nada fue eliminado',
          'info'
        )
      }
    })

  }
}
