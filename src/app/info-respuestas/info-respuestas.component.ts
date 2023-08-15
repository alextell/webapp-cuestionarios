import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartDataset, ChartEvent, ChartType, Color } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-info-respuestas',
  templateUrl: './info-respuestas.component.html',
  styleUrls: ['./info-respuestas.component.css']
})
export class InfoRespuestasComponent {

public  datoslistarcategorias!:any
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  datoslistar!:any

  pruebadeArreglo:any[] = [];
   mayor:any=0

  lasCategoriasDePreguntas:any[]=[];

  perros!:any[]


  DATA:any[] = [56,78,45,33,23,90,87];

  maximo:any=120;

  datosContados:any=[]

barChartLegend: boolean|undefined;

public barChartLabels: string[] = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ];


public barChartType: ChartType = 'bar';



valores:any[]=[];

preguntas:any[]=[];


  constructor(
    private firebaseServiceService: HttpserviceService,
    public router: Router,
  ) { 
  
  }


  ngOnInit():void{

 this.respuestasDeUsuario()
 this.getCategorias()


 
  }


  respuestasDeUsuario(){
    var date 
console.log(localStorage.getItem('fechaCuestSELECT'))

   // console.log(localStorage.getItem('tokenUsuarioRESP'))
    //console.log(localStorage.getItem('idCuestSELECT'))

   // console.log( localStorage.getItem('fechaCuestSELECT'))
    setTimeout(() =>{ 
   
      this.firebaseServiceService.getRespuestasDeUsuario( localStorage.getItem('tokenUsuarioRESP'),localStorage.getItem('idCuestSELECT'),
    localStorage.getItem('fechaCuestSELECT')).subscribe(resp => {
      this.datoslistar = resp.map((e: any) => {
        //console.log("Dentro de")
      //  console.log(e.payload.doc.id)
        return {
          
          pregunta: e.payload.doc.data().pregunta,          
          valor: e.payload.doc.data().valor,
          idUsr:e.payload.doc.data().idUsr,
          idCuestionario: e.payload.doc.data().idCuestionario,
          documentId:e.payload.doc.id,
          nomCategoria:e.payload.doc.data().nomCategoria
          
        }
        
      })
      
    //this.contarPreguntas()
    //console.log("Un valor")
    //console.log(this.datoslistar)

    //console.log(this.datoslistarcategorias)

    this.datoslistar.forEach(element => {

    if(!this.lasCategoriasDePreguntas.includes(element.nomCategoria)){
      this.lasCategoriasDePreguntas.push(element.nomCategoria) 
    }
      
    });

   // console.log(this.lasCategoriasDePreguntas)
    this.lasCategoriasDePreguntas.forEach(element => {
     // console.log(element)
      
    let encontrados = this.datoslistar.filter(elemento => elemento.nomCategoria == element);

    let Sumado=0;
   
    let temp=0
    encontrados.forEach(element => {


    Sumado+=element.valor
    temp=Sumado

    if(temp>this.mayor){
      this.mayor=Sumado

     

   

    }

    });

    this.datosContados.push(Sumado)
   // console.log("Encontrados")

   //console.log(Math.max(this.datosContados))
   //this.maximo=Math.max(this.datosContados)
   //console.log(this.maximo)
   
   //console.log("Mayor")
   //console.log(this.mayor)
    });





    },
      error => {
        console.error(error);
      }
    );
     },2000);
  }

  getCategorias(){
    this.firebaseServiceService.getCategorias().subscribe(resp => {
      this.datoslistarcategorias = resp.map((e: any) => {
        //console.log(e.payload.doc.id)
        //console.log(e.payload.doc)
  
       
        return {       
          nomCategoria: e.payload.doc.data().nomCategoria,
          documentId:e.payload.doc.id,
        }
      })
  
      this.datoslistarcategorias.forEach(element => {
      this.pruebadeArreglo.push(element.nomCategoria)
     });

    //console.log(this.pruebadeArreglo)

     
    },
      error => {
        console.error(error);
      }
    );
  }

 



  public barChartOptions: ChartConfiguration['options'] = {
   
    elements: {
      line: {
        tension: 0.4
      }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        
      },
      y: {
       
      }
    },
    plugins: {
      legend: { display: true },
    }
  };

  public barChartData: ChartData<'bar'> = {
    
    labels: this.lasCategoriasDePreguntas,
   
      datasets: [
        { 

          data: this.datosContados,
          label:"Conteo por categoria",
           backgroundColor: 'red'
        },
      
      ]
    
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
   // console.log(event, active);
  }

  public randomize(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }



}
