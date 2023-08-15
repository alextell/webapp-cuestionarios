import { Component, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbTabsComponent } from 'mdb-angular-ui-kit/tabs';
import { EmailService } from '../services/email.service';

import { Clipboard } from '@angular/cdk/clipboard';

import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';






@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})


export class ModalComponent {
[x: string]: any;

@ViewChild('tabs') tabs: MdbTabsComponent | undefined;
  title: string | null = null;
  banderin:any=false
  info:string|null=null
  email!:string
  asunto!:string
  mensaje!:string
  seleccionado:string="Verificar cuenta"
  lista:string[]=["Anonimo","Verificar cuenta","Solicitar correo"];
  name:string | null=null

url!:string
FormData!: FormGroup;




  constructor(public modalRef: MdbModalRef<ModalComponent>,private builder: FormBuilder, 
    private clipboard: Clipboard,
   ){

   }// Servicio para usar snackbars) {}

   ngOnInit():void{
  
  this.url="https://cuestionarios-analisis-app.web.app/sharecuestionario/"+encodeURIComponent(this.info!)+"/"+this.name
  //this.url="http://localhost:4200/sharecuestionario/"+encodeURIComponent(this.info!)+"/"+this.name
   }

  ngOnChanges(changes: SimpleChanges) {
   // console.log(changes);

  }

  correo(){
    console.log("correo")
  }


  enviar(){
    
  }

  async copiar(){
     // Se copia el texto del input al portapapeles
     this.clipboard.copy(this.url);
     
     // Se muestra un snackbar durante 2 segundos en la parte inferior
     console.log(this.clipboard)

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
      title: 'Copiado al portapapeles!!!'
    })
    
  }



  

 // openSnackBar(message: string, action: string) {
   // this._snackBar.open(message, action);
 // }

}


