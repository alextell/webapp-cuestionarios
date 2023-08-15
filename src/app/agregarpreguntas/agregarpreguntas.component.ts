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

constructor( private firebaseServiceService: HttpserviceService,
  public router: Router,){



   

  
}


onFileDropped($event) {
  this.disableTextbox=false;
  this.deleteFile(0)

  console.log("File drop")

  this.prepareFilesList($event,$event);

}

toggleDisable() {
  this.disableTextbox = !this.disableTextbox;
}

/**
 * handle file from browsing
 */
fileBrowseHandler($event) {
  this.disableTextbox=false;
  this.deleteFile(0)
  console.log("seleec con  clic")
  //console.log($event2)
  
  this.prepareFilesList($event,$event);

}

/**
 * Delete file from files list
 * @param index (File index)
 */
deleteFile(index: number) {
  console.log(index)
 
  this.files!.splice(index, 1);
  this.arr=[]
 
}

/**
 * Simulate the upload process
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

llamarListadeArchivos(){

  this.onFileChange(this.variableContieneArchivo)
}

/**
 * Convert Files list to normal array list
 * @param files (Files List)
 */
prepareFilesList(files: Array<any>,$event) {

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
 * format bytes
 * @param bytes (File size in bytes)
 * @param decimals (Decimals point)
 */
formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



ngOnInit():void{
  if(localStorage.getItem('savePreguntas')!=''){
  this.arr2 = JSON.parse(localStorage.getItem('savePreguntas')!);
  }

  this.getCategorias();




}

getCategorias(){
  this.firebaseServiceService.getCategorias().subscribe(resp => {
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
    error => {
      console.error(error);
    }
  );
}


tempPreguntas(){
 
  if(this.preguntas==''){


}else{
  this.arr.push({pregunta:this.preguntas,nomCategoria:this.seleccionado})
  this.preguntas=''
 console.log(this.arr)
}
}

guardarPreguntas(){

  if(this.arr.length>0){
  for (let i=0; i < this.arr.length; i++){
  this.envioPreguntas= new FormGroup({
    pregunta: new FormControl(this.arr[i].pregunta),
    idCuestionario:new FormControl(localStorage.getItem("idCues")),
    idUsr:new FormControl(localStorage.getItem("token")),
    nomCategoria: new FormControl(this.arr[i].nomCategoria),
    

   
   
  });
 this.firebaseServiceService.agregaPreguntas(this.envioPreguntas.value).then(resp => {
         
          
  }).catch(error => {
    console.error(error)
  })

  

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

let sumita=this.noPreguntasActual+this.arr.length
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
