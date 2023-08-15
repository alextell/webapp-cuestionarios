import { Component } from '@angular/core';
import { HttpserviceService } from './services/httpservice.service';
import { User } from './models/user';
import { Role } from './models/role';
import { Router } from '@angular/router';
import { EncryService } from './services/encry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user?: User | null;
  loging: any = 0;
  info: any = "";
  info2: any = "";
  letra: any
  displayname: any;
  Nombre: any
  valores: any

  userFromApi?: any;

  loading = false;
  title = 'questionarios-app';
  constructor(private _httpservice: HttpserviceService,
    private router: Router,
    private CRY: EncryService) {
    this._httpservice.user.subscribe(x => this.user = x);


  }

  ngOnIt() {



  }

  get name() {
    return this.CRY.encriptacion("", this.user!.PLGsw)
  }

  get isAdmin() {


    return this.CRY.encriptacion("", this.user?.ADhdl) === Role.Admin;
  }

  logout() {
    this._httpservice.logout();
  }

  salir() {
    this._httpservice.logout();
  }

  iniciarSesion(){
console.log("Tratando de iniciar sesion")



this.router.navigateByUrl('/principal');

  }


    async crearCuenta() {
      const { value: formValues } = await Swal.fire({
        title: 'Crear cuenta',
        showCancelButton: true,
        confirmButtonText: 'Crear cuenta',
        showLoaderOnConfirm: true,
        html:
          '<input type="text" id="swal-input1" class="form-control"  placeholder="Usuario">' +
          '<input type="text" id="swal-input2" class="form-control"  placeholder="Nombre">' +
          '<input type="text" id="swal-input3" class="form-control"  placeholder="Apellido">' +
          '<input type="email" id="swal-input4" class="form-control"  placeholder="Correo">' +
          '<input type="password" id="swal-input5" class="form-control"  placeholder="Contraseña">',
  
        focusConfirm: false,
        preConfirm: () => {
          const userData: any = {
            nombre: (document.getElementById('swal-input2') as HTMLInputElement).value,
            apellido: (document.getElementById('swal-input3') as HTMLInputElement).value,
            correo: (document.getElementById('swal-input4') as HTMLInputElement).value,
            contrasena: (document.getElementById('swal-input5') as HTMLInputElement).value,
            usuario: (document.getElementById('swal-input1') as HTMLInputElement).value
  
          }
          return userData
  
        }
      })
  
      if (formValues) {
        // Swal.fire(JSON.stringify(formValues))
        //console.log(formValues)
        if (await this._httpservice.SignUp(formValues.correo, formValues.contrasena, formValues.nombre + "|" + formValues.apellido + "|" + formValues.usuario)) {
          Swal.fire(
            'Cuenta registrada',
            'Inicia sesion',
            'success'
          )
        } else {
          Swal.fire(
            'Hubo un problema al crear la cuenta!',
            'Algo fue mal!',
            'error'
          )
        }
  
  
      }
  
    }
  
  


}
