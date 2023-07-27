import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { ApiConfig } from '../models/ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ApiconfigService {
  private apiBasePathLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiBasePathSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private storageKey = 'apiBaseUrl'; // Key for storing in localStorage

  constructor(private http: HttpClient) {
    this.loadApiBasePath().subscribe();
  }

  loadApiBasePath(): Observable<boolean> {
    const storedBaseUrl = localStorage.getItem(this.storageKey);
    if (storedBaseUrl) {
      this.apiBasePathSubject.next(storedBaseUrl);
      this.apiBasePathLoaded.next(true);
      return of(true);
    }

    return this.http.get<ApiConfig>('assets/config.json').pipe(
      tap((config) => {
        const apiBaseUrl = config.apiBaseUrl;
        if (apiBaseUrl) {
          localStorage.setItem(this.storageKey, apiBaseUrl); // Store in localStorage
          this.apiBasePathSubject.next(apiBaseUrl);
          this.apiBasePathLoaded.next(true);
        } else {
          throw new Error('API base URL not found in config.json');
        }
      }),
      map(() => true)
    );
  }

  getApiBasePath(): Observable<string> {
    return this.apiBasePathLoaded.pipe(
      concatMap((loaded: any) => {
        if (loaded) {
          return this.apiBasePathSubject.pipe(take(1));
        } else {
          throw new Error('API base URL not loaded');
        }
      })
    );
  }
  getApiBaseUrl(): string | null {
    return localStorage.getItem(this.storageKey);
  }
}