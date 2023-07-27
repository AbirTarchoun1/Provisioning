

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { Module } from '../models/entity/module';
import { Product } from '../models/entity/product';
import { ModuleDTO } from '../models/DTO/ModuleDTO';
import { UpdateModuleRequest } from '../models/Request/UpdateModuleRequest';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private base_url!: string;

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
    
  }

  // http options
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    })
  };

  // handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // a client-side or a network error occurred. Handle it accordingly
      console.error('An Error occurred', error.error.message);
    } else {
      // the backend may have returned a successful response code
      // the response body may contain clues as to what went wrong
      console.error(`backend returned code ${error.status}, body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened, please try again later.');
  }

 /**
 * Create a new module
 * @param item Module data
 * @returns Observable of the created module
 */
createModule(item: any): Observable<ModuleDTO> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/addModule`;
      return this.http.post<ModuleDTO>(url, item, this.httpOptions).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}
 /**
 * Get all modules
 * @returns Observable of the modules
 */
getAllModule(): Observable<ModuleDTO[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetProductNames`;
      return this.http.get<ModuleDTO[]>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

 /**
 * Get a module by ID
 * @param id Module ID
 * @returns Observable of the module
 */
getModuleById(id: number): Observable<Module> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetModuleByOneModule/${id}`;
      return this.http.get<Module>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

/**
 * Get all modules by product ID
 * @param id Product ID
 * @returns Observable of the modules
 */
getAllModulesByProductId(id: number): Observable<ModuleDTO[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetModulesByProductId/${id}`;
      return this.http.get<ModuleDTO[]>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

/**
 * Get modules by access ID
 * @param id Access ID
 * @returns Observable of the modules
 */
getModulesByAccessId(id: number): Observable<ModuleDTO[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetModulesByAccessId/${id}`;
      return this.http.get<ModuleDTO[]>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

/**
 * Get modules by product name
 * @param productName Product name
 * @returns Observable of the modules
 */
getModulesByProduct(productName: string): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetModuleByProduct?productName=${productName}`;
      return this.http.get<any>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

/**
 * Get modules by module name
 * @param moduleName Module name
 * @returns Observable of the modules
 */
getModulesByName(moduleName: string): Observable<ModuleDTO[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetModuleByName?moduleName=${moduleName}`;
      return this.http.get<ModuleDTO[]>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

/**
 * Update a module
 * @param item Module data
 * @returns Observable of the updated module
 */
updateModule(item: UpdateModuleRequest): Observable<UpdateModuleRequest> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/UpdateModule/${item.moduleId}`; 
      console.log('Update URL:', url);
      return this.http.put<UpdateModuleRequest>(url, item, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
      );
    })
  );
}


/**
 * Delete a module
 * @param moduleId Module ID
 * @returns Observable of the deleted module
 */
deleteModule(moduleId: number): Observable<Module> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/DeleteModule/${moduleId}`;
      return this.http.delete<Module>(url, this.httpOptions).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}
populateForm(moduleData: any) {
  // Extract the module object from the row data
  const module = moduleData?.module;
  // If the module object exists and contains the necessary properties, populate the form
  if (module) {
    this.form.patchValue({
      moduleId: module.moduleId,
    
      lastModificatedDate: module.lastModificatedDate,
      moduleStatus: module.moduleStatus,
      
    });
  }
}


/**
 * Get all products
 * @returns Observable of the products
 */
getAllProducts(): Observable<Product[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/GetAllProducts`;
      return this.http.get<Product[]>(url).pipe(
        retry(2), // retry failed requests 2 times
        catchError(this.handleError) // handle errors
      );
    })
  );
}

   //validation form
   form: FormGroup = new FormGroup({
    moduleId: new FormControl(null),
    description: new FormControl(),
    moduleName: new FormControl('', [Validators.required]),
    modulePackage: new FormControl(),
    createdDate: new FormControl(''),
    lastModificatedDate: new FormControl(''),
    moduleStatus: new FormControl(false),
    productId: new FormControl(''),
  });

  // inialisation form
  initializeFormGroup() {
    this.form.setValue({
      moduleId: null,
      moduleName: '',
      description: '',
      modulePackage: '',
      moduleStatus: false,
      lastModificatedDate: new Date(),
      createdDate: '',
      productId: ''
    });
  }
   
  
}

  
  
   
  
  
  