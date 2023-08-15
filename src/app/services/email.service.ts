import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private url = ""


  constructor(public http: HttpClient){

  }

  SendEmail(input: any) {
    return this.http.post(this.url, input).pipe(
      map(
        (response) => {
            if (response) {
        return response
            }else{
              return
            }
        },
        (error) => {
            if (error) {
        return error
            }
         }
      )
        )
      }

   

  
}
