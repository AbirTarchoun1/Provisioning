import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})

/*************************
 * 
 * @Author Tarchoun Abir
 * 
 ************************/

export class UploadFileService {


    //api backend
    private base_url !: string;

    constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
      this.apiconfigService.loadApiBasePath().subscribe(
        (apiConfig:any) => {
          this.base_url = apiConfig.apiBaseUrl;
          console.log('API Base URL:', this.base_url);
        },
        (error) => {
          console.log('Error retrieving API base URL:', error);
        }
      );
    }
  
  //http opttion
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json'

    })
  }
  //handel api  errors 
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //a client-side or a neetwork error occurend .Handel it accordingly
      console.error('An Error occurend', error.error.message)

    }
    else {
      // the backend may returned an successfully response code  
      // the response body may contain clues as to what went wrong 
      console.error(`backend returned code ${error.status}, ` +
        `body was : ${error.error}`
      );
    }
    // return an observabel with a user-facing error message 
    return throwError('something bad happined , please try again later .');
  };



  /**
   * for upload file 
   * @param formData 
   * @returns 
   */
  uploadFile(formData: FormData): any {
   return this.http.post( this.base_url + "/FileUpload", formData,{responseType:'text'});
  }

  /**
   * 
   * @param fileName 
   * @returns file 
   */

  getFile(fileName: string) {
    return this.http.get(this.base_url + '/FileUpload/' + fileName);
  }
}