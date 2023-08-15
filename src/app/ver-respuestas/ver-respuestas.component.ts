import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-ver-respuestas',
  templateUrl: './ver-respuestas.component.html',
  styleUrls: ['./ver-respuestas.component.css']
})
export class VerRespuestasComponent {
  datoslistar!:any

  constructor(
    private firebaseServiceService: HttpserviceService,
    public router: Router,
  ) { 
  
  }


  ngOnInit():void{

this.cargarDatosUsuariosConRespuestas()
 
  }

  cargarDatosUsuariosConRespuestas(){
    var date 
    this.firebaseServiceService.getUsuariosConrespuestas(localStorage.getItem('idCues')).subscribe(resp => {
      this.datoslistar = resp.map((e: any) => {
        //console.log(e.payload.doc.id)
        console.log("Trae")
      

       
        return {
          
         
         
          idUsr:e.payload.doc.data().idUsr,
          idCuestionario: e.payload.doc.data().idCuestionario,
          fecha:e.payload.doc.data().fecha,
          documentId:e.payload.doc.id,
          nombre:e.payload.doc.data().nombre,
          nomCuestionario:e.payload.doc.data().nomCuestionario,
          
        }
        
      })
      
    //this.contarPreguntas()
    console.log("Un valor")
    console.log(this.datoslistar)

    },
      error => {
        console.error(error);
      }
    );
  }


  

  informacionDeRespuestas(idUsr:any,idCuestionario:any,fecha:any){
console.log(fecha)

    localStorage.setItem('tokenUsuarioRESP',idUsr)
    localStorage.setItem('idCuestSELECT',idCuestionario)

    localStorage.setItem('fechaCuestSELECT',fecha)
    this.router.navigateByUrl('/info-respuestas?mpo');
  }
  

}
