import { Component } from '@angular/core';
import { HttpserviceService } from '../services/httpservice.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {

  datoslistar:any;
  editarPreguntas:any="";

  campoEditado!:string
  sinEditaridUsr!:string

  lista:string[]=["Admin","User","Colaborador"];
seleccionado:any;

 campoEditadoNombre:any
campoEditadoUsuario!:string
campoEditadoRole!:string

campoEmail!:string

usuarioEditado!:FormGroup
  constructor(
    
    private firebaseServiceService: HttpserviceService,
    public router: Router,
  ) { 
    
    console.log("Aqui llega")

  }

  ngOnInit():void{
    console.log("Aqui llega")
 this.cargarDatos()
  }



   cargarDatos(){

    var date 
    this.firebaseServiceService.getUsuariosALL().subscribe(resp => {
    this.datoslistar = resp.map((e: any) => {
      //console.log(e.payload.doc.id)
      //console.log(e.payload.doc)

     
      return {
        idUsr: e.payload.doc.data().idUsr,
        nombre: e.payload.doc.data().nombre,          
        usuario: e.payload.doc.data().usuario,
        role:e.payload.doc.data().role,
        email:e.payload.doc.data().email,
        uid:e.payload.doc.id,
      }
    })
    

  },
    error => {
      console.error(error);
    }
  );

   
   

  }

  cancelar(){
    this.editarPreguntas="";
  }

  guardarEdicionPregunta(idUsr:any,uid:any){
    console.log("Para guaradat")
console.log(idUsr)
    this.editarPreguntas="";

   
    this.usuarioEditado= new FormGroup({
      role: new FormControl( this.seleccionado),
      nombre: new FormControl(this.campoEditadoNombre),
      usuario:new FormControl( this.campoEditadoUsuario),
      email:new FormControl(this.campoEmail),
      idUsr:new FormControl(this.sinEditaridUsr),
      banderaCambios: new FormControl("1")

 
      
      
    });

 
  this.firebaseServiceService.guardarUsuarioEditado(idUsr,uid,this.usuarioEditado.value).then(resp => {
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


  eliminarPregunta(id:any){

  }

  editarPregunta(uid:any,idusr:any,nombre:any,usuario:any,role:any,email:any){
console.log(uid)
    this.editarPreguntas=idusr;
    this.sinEditaridUsr=idusr

 this.seleccionado=role
 this.campoEditadoNombre=nombre
 this.campoEditadoUsuario=usuario
 this.campoEmail=email
  }

}
