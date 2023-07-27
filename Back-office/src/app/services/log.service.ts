import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiconfigService } from './apiconfig.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  
   //api backend
   private base_url !: string;
   constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
   
  }

  getLogs(): Observable<any[]> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => {
        const url = `${apiBaseUrl}/api/log/getlogs`;
        return this.http.get<any[]>(url);
      }),
      catchError(error => {
        console.log('Error retrieving logs:', error);
        return throwError(error);
      })
    );
  }
}
