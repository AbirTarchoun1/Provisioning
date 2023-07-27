import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiconfigService } from './apiconfig.service';
import { switchMap } from 'rxjs/operators';


/***************************
 * 
 * @author Tarchoun Abir
 * 
 **************************/

@Injectable({
  providedIn: 'root'
})
export class LoginHistoryService {
  private base_url = ''; // Empty string for now, will be updated later with API base URL

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
    this.apiconfigService.loadApiBasePath().pipe(
      switchMap(() => this.apiconfigService.getApiBasePath())
    ).subscribe(
      (apiBaseUrl: string) => {
        this.base_url = apiBaseUrl;
        console.log('API Base URL:', this.base_url); // Verify the retrieved base URL
      },
      (error: any) => {
        console.log('Error retrieving API base URL:', error); // Log any errors during API base URL retrieval
      }
    );
  }

  getLoginHistory(): Observable<any[]> {
    const apiUrl = `${this.base_url}/api/Users/GetAllUsersLoginHistory`; 
    return this.http.get<any[]>(apiUrl);
  }
}
