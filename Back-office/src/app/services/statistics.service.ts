import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private base_url!: string;

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

  private waitForBaseURL(): Observable<void> {
    return from(this.apiconfigService.getApiBasePath()).pipe(
      filter(apiBaseUrl => !!apiBaseUrl),
      switchMap(() => new Observable<void>((observer) => {
        observer.next();
        observer.complete();
      }))
    );
  }

  getUsersStatistics(): Observable<any> {
    return this.waitForBaseURL().pipe(
      switchMap(() => this.http.get<any>(this.base_url + '/api/Statistics/users'))
    );
  }

  getModulesStatistics(): Observable<any> {
    return this.waitForBaseURL().pipe(
      switchMap(() => this.http.get<any>(this.base_url + '/api/Statistics/modules'))
    );
  }

  getProductsStatistics(): Observable<any> {
    return this.waitForBaseURL().pipe(
      switchMap(() => this.http.get<any>(this.base_url + '/api/Statistics/products'))
    );
  }

  getLicensesStatistics(): Observable<any> {
    return this.waitForBaseURL().pipe(
      switchMap(() => this.http.get<any>(this.base_url + '/api/Statistics/licenses'))
    );
  }

  getProductProgress(): Observable<any> {
    return this.waitForBaseURL().pipe(
      switchMap(() => this.http.get(`${this.base_url}/api/Statistics/progress`))
    );
  }

  getProductsPercentage(): Promise<number> {
    return this.waitForBaseURL().toPromise().then(() => {
      return this.http.get<number>(`${this.base_url}/api/Statistics/productsPercentage`).toPromise();
    });
  }
}
