import { Injectable } from '@angular/core';
import { LicenseHistory } from '../models/entity/lisenceHistory';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
  

export class LicenseHistoryService {
  
    //http options
    httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
  
    //handle API errors
    handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        //a client-side or a network error occurred. Handle it accordingly
        console.error('An Error occurred', error.error.message);
      } else {
        // the backend may have returned a successful response code
        // the response body may contain clues as to what went wrong
        console.error(`backend returned code ${error.status}, body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened, please try again later.');
    }
  
    private base_url!: string;
  
    constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
     
    }
    
    // Get all license history
    getAllLicenseHistory(): Observable<LicenseHistory[]> {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap(apiBaseUrl => {
          const url = `${apiBaseUrl}/api/LicenseHistory/gethistories`;
          return this.http.get<LicenseHistory[]>(url).pipe(
            retry(2), // retry failed requests 2 times
            catchError(this.handleError) // handle errors
          );
        })
      );
    }

  }