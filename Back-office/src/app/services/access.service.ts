import { Injectable } from '@angular/core';
import { Access } from '../models/entity/access';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Product } from '../models/entity/product';
import { AccessDTO } from '../models/DTO/AccessDTO';
import { ModuleDTO } from '../models/DTO/ModuleDTO';
import { UpdateAccessRequest } from '../models/Request/UpdateAccessRequest';
import { ApiconfigService } from './apiconfig.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  //api backend
  private base_url!: string;

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
  
  }

  /**
   * insert a new Access
   * @param item
   * @returns new Access
   */
  createAccess(item: any): Observable<Access> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.post<Access>(`${apiBaseUrl}/api/Access/addNewAccess`, item))
    );
  }

  /**
   * @returns all access
   */
  getallAccess(): Observable<AccessDTO[]> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.get<AccessDTO[]>(`${apiBaseUrl}/api/Access/GetAllAccess`))
    );
  }

  /**
   * @param id
   * @returns access by id
   */
  getByidAccess(id: number): Observable<Access> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.get<Access>(`${apiBaseUrl}/api/Access/GetAccessByOne/${id}`))
    );
  }

  /**
   * @returns products - module childrens
   */
  getModuleProducts(): Observable<AccessDTO[]> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.get<AccessDTO[]>(`${apiBaseUrl}/api/Access/products`))
    );
  }

  /**
   * @param item
   * @returns updated access
   */
  updateAccess(item: UpdateAccessRequest): Observable<UpdateAccessRequest> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.put<UpdateAccessRequest>(`${apiBaseUrl}/api/Access/UpdateAccess/${item.accessId}`, item))
    );
  }

  /**
   * to delete access
   * @param accessId
   * @returns
   */
  deleteAccess(accessId: number): Observable<Access> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.delete<Access>(`${apiBaseUrl}/api/Access/DeleteAccess/${accessId}`))
    );
  }

  /**
   * for assign an Access to a product or multiple products
   * @param productId
   * @param AccessIds
   * @returns
   */
  assignAccessToAnProduct(productId: any, AccessIds: any): Observable<any> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.get<any>(`${apiBaseUrl}/api/Access/product/assign-AccessIds/${productId}/${AccessIds}`))
    );
  }

  /**
   * @returns all Products
   */
  getallProducts(): Observable<Product[]> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.get<Product[]>(`${apiBaseUrl}/api/Products/GetAllProducts`))
    );
  }

  /**
   * @returns all modules
   */
  getallModule(): Observable<ModuleDTO[]> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => this.http.get<ModuleDTO[]>(`${apiBaseUrl}/api/Module/GetAllModules`))
    );
  }


  
   /**************************************
   * 
   * @returns Access by name
   */

   getAccessByaccessName(accessName : string): Observable<AccessDTO[]> {
    return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.get<AccessDTO[]>(`${apiBaseUrl}` + `/GetAccessByName?accessName=${accessName}` ))
 );
 }

// most active Access 
getMostActiveAccess(): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.get<any>(`${apiBaseUrl}/api/Access/GetMostActiveAccess`))
  );
}

  //get value for update
  populateForm(access: any) {
    this.form.patchValue(_.omit(access));
  }

  //validation form
  form: FormGroup = new FormGroup({
    accessId: new FormControl(null),
    accessName: new FormControl('', [Validators.required]),
    moduleName: new FormControl('', [Validators.required]),
    productId: new FormControl('', [Validators.required]),
    createdDate: new FormControl(''),
    productName: new FormControl(''),
    lastModificatedDate: new FormControl('')
  });

  // initialization form
  initializeFormGroup() {
    this.form.setValue({
      accessId: null,
      accessName: '',
      moduleName: '',
      productName: '',
      lastModificatedDate: new Date(),
      createdDate: ''
    });
  }


}