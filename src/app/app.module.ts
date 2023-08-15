import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


import { HomeComponent } from './home/home.component';
import { PrincipalComponent } from './principal/principal.component';
import { BarratopComponent } from './share/barratop/barratop.component';
import { HeaderComponent } from './share/header/header.component';


//import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
//import { AngularFireStorageModule } from '@angular/fire/compat/storage';
//import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AgregarpreguntasComponent } from './agregarpreguntas/agregarpreguntas.component';
import { ManejoPreguntasComponent } from './manejo-preguntas/manejo-preguntas.component';
import { CuestionariosComponent } from './cuestionarios/cuestionarios.component';

//import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from "@angular/fire/compat";

import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { VerRespuestasComponent } from './ver-respuestas/ver-respuestas.component';
import { InfoRespuestasComponent } from './info-respuestas/info-respuestas.component';
import { NgChartsModule } from 'ng2-charts';

import { NgxPermissionsModule} from 'ngx-permissions';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { CuestionarioFreeComponent } from './cuestionario-free/cuestionario-free.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from './modal/modal.component';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SharecuestionarioComponent } from './sharecuestionario/sharecuestionario.component';
import { AlreadyrespondedComponent } from './alreadyresponded/alreadyresponded.component';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { FormDoneResponseComponent } from './form-done-response/form-done-response.component';
//import { DndDirective } from './dnd.directive';

import { ProgressComponent } from './progress/progress.component'


import { HttpClientModule } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InfoComponent } from './info/info.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { FormthemComponent } from './formthem/formthem.component';

import { ColorPickerModule } from 'ngx-color-picker';

import {MatSidenavModule} from '@angular/material/sidenav';


import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';


import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    CommonModule,
    AppComponent,
    HomeComponent,
    NgModule,
    InfoComponent,
    PrincipalComponent,
    BarratopComponent,
    HeaderComponent,
    AgregarpreguntasComponent,
    ManejoPreguntasComponent,
    CuestionariosComponent,
    VerRespuestasComponent,
    InfoRespuestasComponent,
    ConfiguracionComponent,
    CuestionarioFreeComponent,
    ModalComponent,
    SharecuestionarioComponent,
    AlreadyrespondedComponent,
    FormDoneResponseComponent,
   // DndDirective,
    ProgressComponent,
     PageNotFoundComponent,
      FormthemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgxPermissionsModule.forRoot(),
     MdbModalModule,
     MdbTabsModule,
     BrowserAnimationsModule,
     MdbFormsModule,
     MdbCollapseModule,
     HttpClientModule,
     MatSnackBarModule,
     MdbCarouselModule,
     ColorPickerModule,
     MatSidenavModule,
     MatSelectModule,
     MatFormFieldModule




  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
