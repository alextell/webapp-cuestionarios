import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

/**Importacion de servicio local */
import { HttpserviceService } from 'src/app/services/httpservice.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
//Declaracion de variables
loging:any=0;
info:any="";
info2:any="";
letra:any
displayname:any;
Nombre:any
valores:any

userFromApi?: any;

loading = false;

constructor(private _httpservice:HttpserviceService,
  private router:Router,
  private cookies: CookieService) {

  console.log("Constructor")
   }

ngOnInit(): void {


 // this._httpservice.OBdisplayName().subscribe(async (data)=>{
    // console.log("Observable")
   //console.log(await data)

   //  })


 // this.getByIdUS()
 // console.log("Header fue llamado")





/*
   //Al inicializar el componente, se obtiene el status del logueo mediante el observable.
 this._httpservice.milogueoFueHecho().subscribe(async (data) => {
   // console.log("Esta info esta aqui en el observable: "+data)
    this.loging=await data
   })


/*
      //Al inicializar el componente, se obtiene los datos del logueo mediante el observable.
    this._httpservice.obtenerDatosUsuarioDesplegar().subscribe(async (data) => {
    this.Nombre=await data
    this.letra=this.Nombre?.substr(0,2)
  })
*/
 // if(this.Nombre=!''){
   // this.router.navigateByUrl('/principal')
 // }





}



 /**En caso de logueo erroneo, redircciona a formulario de log in */
 salir()
 {
   this._httpservice.logout();
   this.router.navigateByUrl('/principal')
 }
}
