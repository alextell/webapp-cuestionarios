import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarpreguntasComponent } from './agregarpreguntas/agregarpreguntas.component';

/**importacion de Guard */
import { AuthGuard } from './guards/auth.guard';

/**Importacion de componentes */
import { HomeComponent } from './home/home.component';
import { ManejoPreguntasComponent } from './manejo-preguntas/manejo-preguntas.component';
import { PrincipalComponent } from './principal/principal.component';
import{CuestionariosComponent} from './cuestionarios/cuestionarios.component';
import { VerRespuestasComponent } from './ver-respuestas/ver-respuestas.component';
import { InfoRespuestasComponent } from './info-respuestas/info-respuestas.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
//import { Role } from './models/role';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { SharecuestionarioComponent } from './sharecuestionario/sharecuestionario.component';
import { AlreadyrespondedComponent } from './alreadyresponded/alreadyresponded.component';
import { FormDoneResponseComponent } from './form-done-response/form-done-response.component';
import { InfoComponent } from './info/info.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormthemComponent } from './formthem/formthem.component';
import { Role } from './models/role';



/**Rutas  */
const routes: Routes = [
 
  
  {path: '', redirectTo: 'info',pathMatch: 'full' },
  {
    path: 'info', component: InfoComponent 
    
  },

  
  {path: 'home',component: HomeComponent,canActivate: [AuthGuard],data: {roles: [Role.Admin,Role.Colaborador]}},//URL que se requiere proteger con Guard(Validar que usuario continue logueado)
  {path: 'agregarpreguntas', component: AgregarpreguntasComponent,canActivate: [AuthGuard],  data: { roles: [Role.Admin,Role.Colaborador]}},
  {path: 'configuracion', component: ConfiguracionComponent,canActivate: [AuthGuard],  data: { roles: [Role.Admin]}},
  {path: 'manejo-preguntas', component: ManejoPreguntasComponent,canActivate: [AuthGuard] ,  data: { roles: [Role.Admin,Role.Colaborador]}},
  {path: 'cuestionarios/:shareanswer/:name', component: CuestionariosComponent,canActivate: [AuthGuard], data:{ roles: [Role.Admin,Role.User,Role.Colaborador]}},
  {path: 'ver-respuestas', component: VerRespuestasComponent,canActivate: [AuthGuard] ,  data: { roles: [Role.Admin,Role.Colaborador]}},
  {path: 'info-respuestas', component: InfoRespuestasComponent,canActivate: [AuthGuard],  data: { roles: [Role.Admin,Role.Colaborador]}},
  {path: 'sharecuestionario/:shareanswer/:name', component: SharecuestionarioComponent,canActivate: [AuthGuard],data: { roles: [Role.User,Role.Admin,Role.Colaborador]}},
  {path: 'alreadyresponded', component: AlreadyrespondedComponent,canActivate: [AuthGuard],data: { roles: [Role.Admin,Role.User,Role.Colaborador]}},
  {path: 'form-done-response', component: FormDoneResponseComponent,canActivate: [AuthGuard],data: { roles: [Role.Admin,Role.User,Role.Colaborador]}},
  {path: 'principal',component: PrincipalComponent},//URL que se requiere proteger con Guard(Validar que usuario continue logueado)
  {path: 'formthem/:shareanswer/:name', component: FormthemComponent,canActivate: [AuthGuard],data: { roles: [Role.Admin,Role.User,Role.Colaborador]}},
 
  {path: '**', component: PageNotFoundComponent},
 
 
 
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
