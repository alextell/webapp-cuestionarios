import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreguntasModel } from '../models/preguntas.model';
import { HttpserviceService } from '../services/httpservice.service';

import * as XLSX from 'xlsx';
import { eventNames } from 'process';

type AOA = any[][];


@Component({
  selector: 'app-agregarpreguntas',
  templateUrl: './agregarpreguntas.component.html',
  styleUrls: ['./agregarpreguntas.component.css']
})
export class AgregarpreguntasComponent {


  files?: any[] = [];
  disableTextbox =  true;


  preguntaExcel:any
  categoriaExcel:any
  preguntas!:string
   arr: any[] = [];

   preguntasDeExcel:any[]=[]

   variableContieneArchivo:any


  misdatos:any[]=[];

   arr2: string[] = [];
   envioPreguntas!: FormGroup

   noPreguntasActual=0
   data: AOA = [[1, 2], [3, 4]];

   fileName: string = 'SheetJS.xlsx';

selectedValue: any;
categorias = [
  { id: 0, name: "" },
  { id: 1, name: "Low" },
  { id: 2, name: "Minor" },
  { id: 3, name: "High" },
];
seleccionado: string="Sin Categoria";
  datoslistar: any

/**
 * La función constructora inicializa las variables firebaseServiceService y router.
 * @param {HttpserviceService} firebaseServiceService - El parámetro `firebaseServiceService` es del
 * tipo `HttpserviceService` y está marcado como privado. Es un servicio que
 * proporcione métodos para interactuar con Firebase, como leer y escribir datos.
 * @param {Router} router - El parámetro del enrutador es una instancia de la clase Enrutador del
 * módulo Enrutador angular. Se utiliza para navegar entre diferentes rutas en su aplicación.
 */
          constructor( private firebaseServiceService: HttpserviceService,
  public router: Router,){
        }

/**
 * La función se activa cuando se suelta un archivo, habilita un cuadro de texto, elimina un archivo previo
 * si existe,prepara una lista de archivos.
 * @param  - El parámetro  es un objeto que representa el evento que ocurrió. En este caso,
 * es probable que sea un objeto de evento relacionado con lo que suceda con los archivos.
 */

onFileDropped($event: any[]) {
  this.disableTextbox=false;
  this.deleteFile(0)
  console.log("File drop")
  this.prepareFilesList($event,$event);
}

/**
 * La función toggleDisable alterna la propiedad disabledTextbox entre verdadero y falso.
 */
toggleDisable() {
  this.disableTextbox = !this.disableTextbox;
}


/**
 * La función `fileBrowseHandler` se activa cuando se selecciona un archivo y habilita un cuadro de
 * texto, elimina un archivo y prepara una lista de archivos.
 * @param  - El parámetro  es un objeto de evento que se pasa a la función
 * fileBrowseHandler. Contiene información sobre el evento que activó la función, como el elemento de
 * destino y cualquier dato adicional asociado con el evento.
 */
fileBrowseHandler($event: any[]) {
  this.disableTextbox=false;
  this.deleteFile(0)
  console.log("seleec con  clic")
  //console.log($event2)

  this.prepareFilesList($event,$event);

}

/**
 * La función deleteFile elimina un archivo de una matriz en el índice especificado.
 * @param {number} index - El parámetro de índice es un número que representa la posición del archivo
 * en la matriz que desea eliminar.
 */
deleteFile(index: number) {
  console.log(index)

  this.files!.splice(index, 1);
  this.arr=[]

}


/**
 * La función realiza carga de archivos incrementando el progreso de cada archivo hasta que alcanza
 * el 100%.
 * @param {number} index - El parámetro de índice se utiliza para realizar un seguimiento del archivo
 * actual que se está cargando. Se incrementa en 1 cada vez que un archivo se carga correctamente.
 */
uploadFilesSimulator(index: number) {
  setTimeout(() => {
    if (index === this.files!.length) {
      return;
    } else {
      const progressInterval = setInterval(() => {
        if (this.files![index].progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        } else {
          this.files![index].progress += 5;

          if( this.files![index].progress==100){
            this.disableTextbox=true;
            this.
            llamarListadeArchivos()
          }
        }
      }, 200);
    }
  }, 1000);
}

/**
 * La función "llamarListadeArchivos" llama a la función "onFileChange" con la variable
 * "variableContieneArchivo" como parámetro.
 */
llamarListadeArchivos(){
  this.onFileChange(this.variableContieneArchivo)
}


/**
 * La función prepara una lista de archivos para cargar, verifica si solo se seleccionó un archivo y
 * luego continúa con el proceso de carga.
 * @param files - Una matriz de archivos que deben prepararse para la carga.
 * @param {any[]}  - El parámetro  es un objeto que representa el evento que activó la
 * función. Por lo general, se usa en controladores de eventos para acceder a información sobre el
 * evento, como el elemento de destino o el tipo de evento, se usa para
 * almacenar información relacionada con los archivos.
 */
prepareFilesList(files: Array<any>,$event: any[]) {
  console.log(files.length)
  if(files.length<=1){
  for (const item of files) {
    item.progress = 0;
    this.files!.push(item);
  }
  this.uploadFilesSimulator(0);
  this.variableContieneArchivo=$event

  setTimeout(() => {

     }, 2800);
    }else{
      console.log("Solo debes agregar un archivo")
    }

 // this.onFileChange(this.files![0])
}

/**
 * La función `formatBytes` toma una cantidad de bytes y una cantidad de decimales como entrada y
 * devuelve una cadena formateada que representa los bytes en un formato legible.
 * @param {number} bytes - El parámetro `bytes` es un número que representa el tamaño en bytes que
 * desea formatear.
 * @param {number} decimals - El parámetro `decimales` es el número de posiciones decimales que se
 * incluirán en el resultado formateado. Determina la precisión del valor del tamaño.
 * @returns La función `formatBytes` devuelve una cadena formateada que representa el número dado de
 * bytes.
 */

formatBytes(bytes: number, decimals: number) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


/**
 * La función ngOnInit verifica si hay datos guardados en localStorage y los recupera si existen, luego
 * llama a la función getCategorias.
 */

ngOnInit():void{
  if(localStorage.getItem('savePreguntas')!=''){
  this.arr2 = JSON.parse(localStorage.getItem('savePreguntas')!);
  }
  this.getCategorias();
}

/**
 * La función `getCategorias()` recupera categorías de un servicio de Firebase y asigna la respuesta a
 * una matriz de objetos que contienen el nombre de la categoría y el ID del documento.
 */
getCategorias(){
  this.firebaseServiceService.getCategorias().subscribe((resp: any[]) => {
    this.datoslistar = resp.map((e: any) => {
      //console.log(e.payload.doc.id)
      //console.log(e.payload.doc)
      return {
        nomCategoria: e.payload.doc.data().nomCategoria,
        documentId:e.payload.doc.id,
      }
    })

   // console.log(this.datoslistar);
  },
    (    error: any) => {
      console.error(error);
    }
  );
}

/**
 * La función `tempPreguntas` añade una nueva pregunta a un array si la pregunta no está vacía.
 */

tempPreguntas(){
  if(this.preguntas==''){
}else{
  this.arr.push({pregunta:this.preguntas,nomCategoria:this.seleccionado})
  this.preguntas=''
 console.log(this.arr)
}
}

/**
 * La función "guardarPreguntas" guarda las preguntas en una base de datos y actualiza el número de
 * preguntas de un cuestionario.
 */
guardarPreguntas(){

  if(this.arr.length>0){
  for (let i=0; i < this.arr.length; i++){
  this.envioPreguntas= new FormGroup({
    pregunta: new FormControl(this.arr[i].pregunta),
    idCuestionario:new FormControl(localStorage.getItem("idCues")),
    idUsr:new FormControl(localStorage.getItem("token")),
    nomCategoria: new FormControl(this.arr[i].nomCategoria),
  });
 this.firebaseServiceService.agregaPreguntas(this.envioPreguntas.value).then((resp: any) => {

  }).catch((error: any) => {
    console.error(error)
  })

  this.firebaseServiceService.getUnoCuestionario(localStorage.getItem('nomC')).subscribe((resp: any[]) => {
    resp.forEach((element: { data: () => any; }) => {

      let datos=JSON.stringify(element.data())
      let unDatops=JSON.parse(datos)
      if(unDatops.noPreguntas){
      this.noPreguntasActual=unDatops.noPreguntas
      }else{
      this.noPreguntasActual=0
      }
      //console.log(this.noPreguntasActual)
    })

let sumita=this.noPreguntasActual+this.arr.length
    this.firebaseServiceService.agregarCuantasPreguntas(localStorage.getItem("idCues"),sumita).then(resp => {
      console.log("Guardo")

}).catch(error => {
 console.error(error)
})

  },
    (  error: any) => {
    console.error(error);
  }
  );
//console.log(this.noPreguntasActual)
//console.log(sumita)
  }
  Swal.fire({
    title: 'Preguntas guardadas con exito',
    confirmButtonText: 'Aceptar',
    icon: 'info',
    allowOutsideClick: false,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.router.navigateByUrl('/home');
    }
  })
}else{

  Swal.fire({
    title: 'No hay preguntas para guardar',
    confirmButtonText: 'Aceptar',
    icon: 'error',
    allowOutsideClick: false,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */

  })
}
}


/**
 * La función `onFileChange` lee un archivo de Excel y guarda los datos en una matriz.
 * @param {FileList} evt - El parámetro "evt" es de tipo FileList, que representa una lista de archivos
 * seleccionados de un elemento de entrada de tipo "archivo".
 */
onFileChange(evt: FileList) {
  console.log("Excelazo")
   /* wire up file reader */
  // const target: DataTransfer = <DataTransfer>(evt.target);
   if (evt.length !== 1) throw new Error('Cannot use multiple files');
   const reader: FileReader = new FileReader();
   reader.onload = (e: any) => {
     /* read workbook */
     const bstr: string = e.target.result;
     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
     /* grab first sheet */
     const wsname: string = wb.SheetNames[0];
     const ws: XLSX.WorkSheet = wb.Sheets[wsname];
     /* save data */
     this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
     console.log(this.data);
     this.data.forEach(element => {
let banderita=true
      element.forEach(element2 => {
        console.log(element2)
        if(banderita){
this.preguntaExcel=element2
banderita=false
        }else{
          this.categoriaExcel=element2
          banderita=true
        }
      });
               this.arr.push({pregunta:this.preguntaExcel,nomCategoria:this.categoriaExcel})
     });
   };
   reader.readAsBinaryString(evt[0]);
}
}
