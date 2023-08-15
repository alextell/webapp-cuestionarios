import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioModel } from '../models/usuario.model';


/*Importacion de servicios locales*/
import { HttpserviceService } from '../services/httpservice.service';

import Swal from 'sweetalert2';


import { ThemePalette } from '@angular/material/core'; //npm install --save @angular/material

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  loading = false;
  submitted = false;
  error = '';

  /*Variables*/
  valor1!: string;
  valor2!: string;
  valor3!: string;
  recordarme = false;
  logueado: Boolean = false;
  background: ThemePalette = undefined;
  errormensaje!: string;

  usuario: UsuarioModel = new UsuarioModel();


  constructor(private _httpservice: HttpserviceService,
    private router: Router,
    private routes: ActivatedRoute,) {
    this.background = this.background ? undefined : 'primary';

    // redirect to home if already logged in
    console.log("LLega aqui")
    if (this._httpservice.userValue) {
      console.log(this._httpservice.userValue)
       this.router.navigate(['/info']);
      console.log("LLego aqui")
    }


  }

  ngOnInit(): void {
    if (this._httpservice.userValue) {

      this._httpservice.logout();
    }
  }

  onSubmit() {


  }


  login(form: NgForm) {
    this._httpservice.SignIn(this.usuario.correo, this.usuario.contrasenia)

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
