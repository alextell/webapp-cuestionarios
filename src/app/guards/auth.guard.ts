import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpserviceService } from '../services/httpservice.service';
import { EncryService } from '../services/encry.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private firebaseServiceService: HttpserviceService,
    private CRY:EncryService
) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
    {

      const user = this.firebaseServiceService.userValue;
      console.log("Guardian")
     // console.log(user.ADhdlpDEo)
      if (user) {
          // check if route is restricted by role
          const { roles } = route.data;
          if (roles && !roles.includes(this.CRY.encriptacion("",user.ADhdl))) {
              // role not authorized so redirect to home page
              this.router.navigate(['/principal']);
              return false;
          }

          

          // authorized so return true
          return true;
      }

      console.log("")
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/principal'], { queryParams: { returnUrl: state.url } });
      return false;
}
  
}
