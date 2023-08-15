import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; //npm install sweetalert2
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CookieService } from "ngx-cookie-service";
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable} from 'rxjs';
import { NgxRolesService } from 'ngx-permissions';
import { FormControl, FormGroup } from '@angular/forms';
import { EncryService } from './encry.service';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {
  displayName?: BehaviorSubject<any | null>;
  public user: Observable<User | null>;
  MiLogueo: BehaviorSubject<any>;
  unusuario: User | undefined
  mensaje!: string
  userToken: string = ""
  cuestionario!: FormGroup
  userData: any; // Save logged in user data


  constructor(public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private cookies: CookieService, private rolesService: NgxRolesService,
    private route: ActivatedRoute,
    private CRY: EncryService) {

    this.MiLogueo = new BehaviorSubject<any>(false);
    this.leerToken();
    if (
      !this.estaAutenticado()) {
      this.logout();
    }
    let conv = JSON.parse(localStorage.getItem('usr')!)
    let conv2 = JSON.parse(conv)
    this.displayName = new BehaviorSubject(conv2);
    this.user = this.displayName!.asObservable();
  }

/**
 * La función "verificaSesion" comprueba si un usuario ha iniciado sesión y devuelve verdadero si lo
 * está y falso si no lo está.
 */
  verificaSesion() {
    this.afAuth.authState.subscribe((user) => {

      console.log(user)
      if (user != null) {
        return true
        /* this.userData = user;
         localStorage.setItem('usr', JSON.stringify(this.userData.displayName));
         JSON.parse(localStorage.getItem('usr')!);
       } else {
         localStorage.setItem('usr', 'null');
         JSON.parse(localStorage.getItem('usr')!);
         */
      } else {
        return false
      }
    });
  }

/**
 * La función devuelve el valor de la propiedad displayName.
 * @returns El valor de la propiedad `displayName`.
 */
  public get userValue() {
    //console.log("userValue")
    // console.log(this.displayName!.value)
    return this.displayName!.value;
  }

/**
 * La función `OBdisplayName()` devuelve un Observable que emite el nombre para mostrar el nombre de usuario actual.
 * @returns Se devuelve el observable `displayName`.
 */
  OBdisplayName(): Observable<any> {
     return this.displayName!.asObservable();
  }

 /**
  * La función "milogueoFueHecho" devuelve un Observable que emite el valor de "MiLogueo" como flujo
  * asíncrono.
  * @returns El método devuelve un Observable de tipo 'cualquiera'.
  */
  milogueoFueHecho(): Observable<any> {
    return this.MiLogueo!.asObservable();
  }

  rellamar() {
    console.log((this.afAuth.updateCurrentUser))
  }

 /**
  * La función anterior maneja el proceso de inicio de sesión mediante
  * correo electrónico y contraseña, y muestra los mensajes de error correspondientes según el estado
  * de autenticación.
  * @param {string} email - El parámetro de correo electrónico es una cadena que representa la
  * dirección de correo electrónico del usuario. Se utiliza para identificar al usuario durante el
  * proceso de inicio de sesión.
  * @param {string} password - El parámetro de contraseña es una cadena que representa la contraseña
  * del usuario para la autenticación.
  */
  SignIn(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.revisarSiCambiosUSR(userCredential.user.uid)
        setTimeout(() => {
          // this.contarPreguntas()
          // Signed in
          // const user = userCredential.user;
          // ...
          // console.log(userCredential.user.displayName)
          this.guardarToken(userCredential.user.uid);
          // let cortes=userCredential.user.displayName?.split('|');
          //console.log(cortes![2])
          this.displayName?.next(JSON.parse(userCredential.user.displayName!))
          this.MiLogueo.next(true);
          //console.log("JSON  "+JSON.stringify(userCredential.user.displayName!))
          localStorage.setItem("usr", JSON.stringify(userCredential.user.displayName!));
          //this.borrame();
          //console.log(userCredential.user.displayName)
          this.router.navigateByUrl('/home');
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorMessage)
        this.mensaje = ""
        if (errorMessage == "Firebase: The email address is badly formatted. (auth/invalid-email).") {
          this.mensaje = "El correo debe tener un formato correcto"
        } else {
          if (errorMessage == "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
            this.mensaje = "Cuenta bloqueada, restablece tu contraseña o intenta mas tarde"
          } else {
            if (errorMessage == "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).") {
              this.mensaje = "Error de correo o contraseña, verifica e intenta de nuevo"
            } else {
            }
          }
        }
        console.log(this.mensaje)
        Swal.fire({
          icon: 'error',
          title: 'Aviso:',
          text: errorMessage = !'' ? this.mensaje : 'Error de conexion'
        });
      });
  }

  traerDatosUSRVerificarCambios(uid: any) {

    return this.afs.collection('/usuarios-db', ref => ref.where('idUsr', '==', uid)).get();

  }

/**
 * La función revisarSiCambiosUSR comprueba si hay cambios en los datos del usuario y guarda el perfil
 * de usuario actualizado si hay cambios.
 * @param {any} uid - El parámetro "uid" es del tipo "cualquiera", lo que significa que puede aceptar
 * cualquier tipo de datos. Se utiliza como identificador para recuperar los datos del usuario para su
 * verificación.
 */
  revisarSiCambiosUSR(uid: any) {
    this.traerDatosUSRVerificarCambios(uid).subscribe(resp => {
      resp.forEach(element => {
        let datos = JSON.stringify(element.data())
        let unDatops = JSON.parse(datos)

        // console.log("per:     ",unDatops.idUsr)

        if (unDatops.banderaCambios = !0) {
          let displayNameCambios = "{\"PLGsw\":\"" + this.CRY.encriptacion("ENC", unDatops.nombre) + "\", \"FhYD\":\"" + this.CRY.encriptacion("ENC", unDatops.usuario) + "\",\"ADhdl\":\"" + this.CRY.encriptacion("ENC", unDatops.role) + "\",\"tole\":\"" + this.CRY.encriptacion("", unDatops.idUsr) + "\"}"

          //console.log("Display name   ",displayNameCambios)
          ////  console.log("\{\"PLGswF039d4fFRd01QxC\":\""+this.CRY.encriptacion("ENC",unDatops.nombre)+"\", \"FhYDW2cVFr$56p94cDSE\":\""+unDatops.usuario+"\",\"ADhdlpDEosbeHtDnVs\":\""+this.CRY.encriptacion("ENC",unDatops.role)+"\",\"uid\":\""+unDatops.idUsr+"\"}")

          this.saveUserProfile(displayNameCambios)

        } else {
          console.log("Nada")

        }

      })
    })
  }


  logueoPasado(email: string, password: string) {

  }
/*
Funciona para realizar pruebas de cambio de perfil directas
*/
  private async borrame() {

    (await this.afAuth.currentUser)?.updateProfile({
      //displayName: datosusuario.displayName,
      // displayName: "{\"nombre\":\"Ale Tellez Landin\", \"usuario\":\"alextell92\",\"role\":\"Admin\",\"uid\":\"jkXayyz6x2fvX5HG5lVK4uXxkMm1\"}"
      displayName: "{\"nombre\":\"Maria Gonzalez Gonzalez\", \"usuario\":\"princecita\",\"role\":\"User\",\"uid\":\"3IcSW4ZeDrNuXUm2Hbq1giH57Sp1\"}"

    })
      .then(() => console.log('User updated'))
      .catch(err => console.log('Error', err));
  }



  /**
   * La función "crearCuestionario" crea un nuevo cuestionario y lo agrega a una colección en una base
   * de datos.
   * @param {any} cuestionario - El parámetro "cuestionario" es un objeto que representa el
   * cuestionario a crear. Contiene la información necesaria, como el título, las preguntas, las
   * opciones y cualquier otro detalle relevante.
   * @param isAdmin - isAdmin es un valor booleano que indica si el usuario que crea el cuestionario es
   * administrador o no. Si isAdmin es verdadero, significa que el usuario es un administrador. Si
   * isAdmin es falso, significa que el usuario no es administrador.
   * @param idUsr - El id del usuario que está creando el cuestionario.
   * @returns el resultado de agregar el objeto "cuestionario" a la colección "cuestionarios-db" en la
   * base de datos de Firestore.
   */
  crearCuestionario(cuestionario: any, isAdmin, idUsr) {
   // console.log(cuestionario)
    this.getCuestionarios(isAdmin, idUsr)
    return this.afs.collection("cuestionarios-db").add(cuestionario);
  }

  /**
   * La función `getCuestionarios` recupera una colección de "cuestionarios" (cuestionarios) de una
   * base de datos basada en el rol y la identificación del usuario.
   * @param isAdmin - Un valor booleano que indica si el usuario es administrador o no.
   * @param idUsr - El id del usuario para el que se están recuperando los cuestionarios.
   * @returns La función `getCuestionarios` devuelve una colección de Firestore.
   */
  getCuestionarios(isAdmin, idUsr) {
    if (isAdmin) {
      return this.afs.collection("cuestionarios-db", ref => ref.orderBy("fechaCrea", "desc")).get();
    } else {
      return this.afs.collection("cuestionarios-db", ref => ref.orderBy("fechaCrea", "desc").where("idUsr", "==", idUsr)).get();
    }
  }

 /**
  * La función `getCuestionariosRecientesTodos` recupera cuestionarios recientes basados en los parámetros
  * proporcionados.
  * @param isAdmin - Un valor booleano que indica si el usuario es administrador o no.
  * @param idUsr - El parámetro "idUsr" se refiere al ID de usuario. Se utiliza para
  * identificar a un usuario específico en la base de datos.
  * @param idCuestionario - El parámetro "idCuestionario" es el identificador único del cuestionario
  * que desea recuperar.
  * @returns obtiene una coleccion de datos de la tabla 'cuestionarios-db'.
  */
  getCuestionariosRecientesTodos(idCuestionario) {
    return this.afs.collection('cuestionarios-db').doc(idCuestionario).valueChanges();
  }

 /**
  * La función "taerSoloRecientesCuestionarios" recupera cuestionarios recientes en base al ID del
  * usuario para saber si le pertenecen.
  * @param isAdmin - Un valor booleano que indica si el usuario es administrador o no.
  * @param idUsr - La identificación del usuario para el que desea recuperar los cuestionarios
  * recientes.
  * @returns una colección de documentos de la colección "usuario-cuestionario-db" en Firestore, donde
  * el campo "idUsr" coincide con el parámetro "idUsr" provisto.
  */
  taerSoloRecientesCuestionarios(isAdmin, idUsr) {
        return this.afs.collection("usuario-cuestionario-db", ref => ref.where("idUsr", "==", idUsr)).get();
  }



/**
 * La función `getUnoCuestionario` recupera un cuestionario específico de una colección de Firestore en
 * función de su nombre.
 * @param nomCuest - El parámetro "nomCuest" es una cadena que representa el nombre de un cuestionario.
 * @returns una promesa que se resuelve en una instantánea de consulta de Firestore.
 */
  getUnoCuestionario(nomCuest) {
    console.log(nomCuest)
    return this.afs.collection('/cuestionarios-db', ref => ref.where('nomCuestionario', '==', nomCuest)).get();
  }


  getPreguntas(idCuestionario: any) {
    console.log("Dentro: "+idCuestionario)

    return this.afs.collection('/preguntas-db', ref => ref.where('idCuestionario', '==', idCuestionario)).snapshotChanges();



    /*
        const citiesRef = this.db.collection('preguntas-db');NCbouZxfD1vm0EyHvWOW
    const snapshot = await citiesRef.where('idCuestionario', '==', 'vDrZRU1JxadPWfWe8RfO').get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    
    snapshot.forEach((doc: { id: any; data: () => any; }) => {
      console.log(doc.id, '=>', doc.data());
    });
    */
    //   return this.afs.collection("preguntas-db").doc().collection('vDrZRU1JxadPWfWe8RfO').snapshotChanges();
  }



   getEstilo(idCuestionario: string) {
    //console.log(idCuestionario)
  
    return  this.afs.collection('/cuestionarios-db').doc(idCuestionario).get();


  }


  contarPreguntas(idCuestionario: string) {
    // console.log(idCuestionario)



    return this.afs.collection('/preguntas-db', ref => ref.where('idCuestionario', '==', idCuestionario)).get();


  }

  guardarPreguntaEditada(idPregunta: any, infoActualizado: any) {
    return this.afs.collection('preguntas-db').doc(idPregunta).set(infoActualizado);

  }

  private guardarToken(idToken: string) {

    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')!;
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {

    if (this.userToken.length < 2) {
      return false;

    } else {

      this.MiLogueo.next(true)

      const expira = Number(localStorage.getItem('expira'));
      const expiraDate = new Date();
      expiraDate.setTime(expira);

      if (expiraDate > new Date()) {
        return true;
      } else {
        Swal.fire({
          title: 'Tu sesion expiro',
          text: 'Vuelve a iniciar sesión',


          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          icon: 'info',

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {


          } else if (result.isDenied) {

          }
        })


        this.MiLogueo.next(false);
        return false
      }
    }

  }




  agregaPreguntas(preguntas: any) {
    return this.afs.collection("preguntas-db").add(preguntas);

  }

  async agregarCuantasPreguntas(idCuestionario, Preguntas) {
    const cityRef = this.afs.collection('cuestionarios-db').doc(idCuestionario);

    // Set the 'capital' field of the city
    const res = await cityRef.update({ noPreguntas: Preguntas });
  }


  async agregarEstilos(idCuestionario, FondoGeneral, FondoPreguntas, cambioLetrastitulo, tamanotitulo, cambioLetrasPreguntas, tamanoPreguntas) {
    const cityRef = this.afs.collection('cuestionarios-db').doc(idCuestionario);


    const res = await cityRef.update({ fondoGeneral: FondoGeneral });

    const res2 = await cityRef.update({ fondoPreguntas: FondoPreguntas });


    const res3 = await cityRef.update({ letraTitulo: cambioLetrastitulo });

    const res4 = await cityRef.update({ tamanoLetraTitulo: tamanotitulo });

    const res5 = await cityRef.update({ letraPreguntas: cambioLetrasPreguntas });


    const res6 = await cityRef.update({ tamanoLetraPreguntas: tamanoPreguntas });

  }

  eliminarCuestionario(id: any) {
    return this.afs.collection("cuestionarios-db").doc(id).delete();
  }

  eliminarPreguntaUnica(id: any) {
    return this.afs.collection("preguntas-db").doc(id).delete();
  }


  async eliminarPreguntaASociadaACuestionario(id: any) {
    //console.log("id de do")



    // Create a query against the collection
    //const queryRef = this.afs.collection('/preguntas-db', ref => ref.where('idCuestionario', '==', id));

    //console.log(queryRef)

  }

  agregarRespuestas(respuestas: any) {
    let valor = this.afs.collection("respuestas-db").add(respuestas);


    return valor;

  }

  registrarUsuarioConCuestionario(datosUsuarioRespondio: any) {

    return this.afs.collection("usuario-cuestionario-db").add(datosUsuarioRespondio);
  }

  getUsuariosConrespuestas(idCuestionario: any) {
    // console.log("usuario: "+idUsuario)
    console.log("idCue: " + idCuestionario)

    return this.afs.collection('/usuario-cuestionario-db', ref => ref.where('idCuestionario', '==', idCuestionario)).snapshotChanges();
  }

  getRespuestasDeUsuario(idUsuario: any, idCuestionario: any, fecha: any) {

    console.log(fecha)



    return this.afs.collection('/respuestas-db', ref => ref.where('fecha', '==', fecha).where('idCuestionario', '==', idCuestionario).where('idUsr', '==', idUsuario)).snapshotChanges();

  }

  getCategorias() {
    return this.afs.collection("categorias-db").snapshotChanges();
  }


  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }


  // Sign up with email/password
  SignUp(email: string, password: string, nombre: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();

        // console.log( this.SetUserData(result));
        //console.log(result.user?.uid) 
        let cortes = nombre.split('|');

        // this.saveUserProfile("{\"nombre\":\""+cortes[0]+"\", \"usuario\":\""+cortes[1]+"\",\"role\":\"User\",\"uid\":\""+result.user?.uid+"\",\"email\":\""+email+"\"}")
        this.saveUserProfile("{\"PLGsw\":\"" + this.CRY.encriptacion("ENC", cortes[0]) + "\", \"FhYD\":\"" + this.CRY.encriptacion("ENC", cortes[1]) + "\",\"ADhdl\":\"" + this.CRY.encriptacion("ENC", "Colaborador") + "\"}")


        this.creaUsuarioReplica("{\"PLGsw\":\"" + this.CRY.encriptacion("ENC", cortes[0]) + "\", \"FhYD\":\"" + this.CRY.encriptacion("ENC", cortes[1]) + "\",\"ADhdl\":\"" + this.CRY.encriptacion("ENC", "Colaborador") + "\",\"tole\":\"" + this.CRY.encriptacion("ENC", result.user?.uid) + "\",\"email\":\"" + email + "\"}");

        return true
      })
      .catch((error) => {
        window.alert(error.message);
        return false;
      });
  }

  creaUsuarioReplica(datos: any) {
    // console.log(datos)
    let misDatos = JSON.parse(datos)
    this.cuestionario = new FormGroup({
      idUsr: new FormControl(this.CRY.encriptacion("", misDatos['tole'])),
      nombre: new FormControl(this.CRY.encriptacion("", misDatos['PLGsw'])),
      usuario: new FormControl(this.CRY.encriptacion("", misDatos['FhYD'])),
      role: new FormControl(this.CRY.encriptacion("", misDatos['ADhdl'])),
      email: new FormControl(misDatos['email']),
    });
    //console.log(this.cuestionario)
    return this.afs.collection("usuarios-db").add(this.cuestionario.value);
  }


  verificaSiYarespondio(idCuestio, idUsuario) {

    return this.afs.collection('/usuario-cuestionario-db', ref => ref.where('idCuestionario', '==', idCuestio).where('idUsr', '==', idUsuario)).get();

  }



  private async saveUserProfile(displayN) {



    (await this.afAuth.currentUser)?.updateProfile({
      //displayName: datosusuario.displayName,


      displayName: displayN
    })
      .then(() => console.log('User updated'))
      .catch(err => console.log('Error', err));

    // console.log(displayN)
  }


  getUsuariosALL() {


    console.log(this.afAuth.currentUser)

    return this.afs.collection("usuarios-db").snapshotChanges();

  }

  async guardarUsuarioEditado(uid, idUsr, datosUsuarioEditado) {

    /*
    updateProfile(idUsr, {
      displayName: "{\"nombre\":\"Ale Tellez Landin\", \"usuario\":\"alextell92\",\"role\":\"Admin\",\"uid\":\"jkXayyz6x2fvX5HG5lVK4uXxkMm1\"}"
    }).then(() => {
     console.log("Correcto")
    }).catch((error) => {
      // An error occurred
      // ...
    
      console.log("Error"+ error)
    });
    */






    return this.afs.collection('usuarios-db').doc(idUsr).set(datosUsuarioEditado);

  }



  //set full user data we get
  /* SetUserData(user) {
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: false,
      metadata: user,
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: function (): Promise<void> {
        throw new Error('Function not implemented.');
      },
      getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
        throw new Error('Function not implemented.');
      },
      getIdTokenResult: function (forceRefresh?: boolean | undefined): Promise<auth.IdTokenResult> {
        throw new Error('Function not implemented.');
      },
      reload: function (): Promise<void> {
        throw new Error('Function not implemented.');
      },
      toJSON: function (): object {
        throw new Error('Function not implemented.');
      },
      displayName: null,
      phoneNumber: null,
      photoURL: null,
      providerId: ''
    }
    return userRef.set(userData, {
      merge: true
    });
  }
  */
  /* Setting up user data when sign in with username/password, 
sign up with username/password and sign in with social auth  
provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  /* SetUserData2(user: any,nombre:string,result:any) {
     const userRef: AngularFirestoreDocument<any> = this.afs.doc(
       `users/${user.uid}`
     );
     const userData: User = {
       uid: user.uid,
       emailVerified: false,
       isAnonymous: false,
       providerData: [],
       refreshToken: '',
       tenantId: null,
       displayName: "Alejandro Tellez",
       email: user.email,
       phoneNumber: "46111215427",
       photoURL: null,
       providerId: '',
       metadata: result,
       delete: function (): Promise<void> {
         throw new Error('Function not implemented.');
       },
       getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
         throw new Error('Function not implemented.');
       },
       getIdTokenResult: function (forceRefresh?: boolean | undefined): Promise<auth.IdTokenResult> {
         throw new Error('Function not implemented.');
       },
       reload: function (): Promise<void> {
         throw new Error('Function not implemented.');
       },
       toJSON: function (): object {
         throw new Error('Function not implemented.');
       }
     };
     return userRef.set(userData, {
       merge: true,
     });
   }
   */

  VerificarCadena(string) {//solo letras y numeros
    var out = '';
    //Se añaden las letras validas
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';//Caracteres validos

    for (var i = 0; i < string.length; i++)
      if (filtro.indexOf(string.charAt(i)) != -1)
        out += string.charAt(i);
    return out;
  }


  tiene_letras_especiales(texto) {
    console.log(texto)

    let regex = /[:=#$!"#$%&()=?¡*¨_.;]/gm // Expresión regular

    //console.log(texto.search(regex))


    var midstring;
    if (texto.search(regex) != -1) {
      midstring = true
    } else {
      midstring = false
    }
    //console.log(texto + midstring + regex);




    return midstring

  }

  logout() {

    localStorage.removeItem('expira')
    localStorage.removeItem('tokenUsuarioRESP')


    localStorage.removeItem('idCuestSELECT')

    localStorage.removeItem('fechaCuestSELECT')




    localStorage.removeItem('token')
    this.cookies.delete("usr");
    this.displayName?.next("");
    localStorage.removeItem('usr')


    this.afAuth.signOut()

    this.router.navigate(['/info']);




  }



}



