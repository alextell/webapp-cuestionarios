import { Injectable } from '@angular/core';


import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryService {
  tokenFromUI: string = "0123ABCDE456789123456FGHIJKLMNOPQR";


  request!: string;
  responce!: string;




  constructor( ) {
     }



  encriptacion(opcion,cadena){

    if(opcion=="ENC"){

     return CryptoJS.AES.encrypt(cadena, 'secret key 123').toString();

    }else{

      var bytes  = CryptoJS.AES.decrypt(cadena, 'secret key 123');


      return  bytes.toString(CryptoJS.enc.Utf8);
    }



  }

    generaNss(n) {
      let result = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < n; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

    console.log(result)

    return result;
}




}
