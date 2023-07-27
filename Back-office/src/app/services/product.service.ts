import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { Product } from '../models/entity/product';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiconfigService } from './apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getallProducts() {
    throw new Error('Method not implemented.');
  }

  idIfEdit: any = null;
  products: any;
  // api backend
  private base_url!: string;

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
    
  }


  // http option
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    })
  };

  // handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // a client-side or a network error occurred. Handle it accordingly
      console.error('An error occurred', error.error.message);
    } else {
      // the backend may have returned a successful response code
      // the response body may contain clues as to what went wrong
      console.error(`Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened, please try again later.');
  }

/**
 * Get all Products
 * @returns Observable of all Products
 */
getAllProducts(): Observable<Product[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/GetAllProducts`;
      return this.http.get<Product[]>(url);
    })
  );
}
  
 /**
 * Update a product
 * @param item Product data
 * @returns Observable of the updated product
 */
updateProduct(item: Product): Observable<Product> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/UpdateProduct/${item.productId}`;
      return this.http.put<Product>(url, item, this.httpOptions);
    })
  );
}
 /**
 * Get a product by ID
 * @param id Product ID
 * @returns Observable of the product
 */
getProductById(id: number): Observable<Product> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/${id}`;
      return this.http.get<Product>(url);
    })
  );
}

 /**
 * Add a new product
 * @param bodyRequest Product data
 * @returns Observable of the added product
 */
addProduct(bodyRequest: any): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/addNewProduct`;
      return this.http.post<any>(url, bodyRequest);
    })
  );
}

 /**
 * Create a new product intervention
 * @param data Intervention data
 * @returns Observable of the created intervention
 */
createNewProduct(data: any): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/createNewProduct`;
      return this.http.post<any>(url, data);
    })
  );
}

/**
 * Get modules by product
 * @param productName Product name
 * @returns Observable of modules
 */
getModulesByProduct(productName: string): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Module/GetModuleByProduct?productName=${productName}`;
      return this.http.get<any>(url);
    })
  );
}

 /**
 * Delete a product
 * @param productId Product ID
 * @returns Observable of the deleted product
 */
deleteProduct(productId: number): Observable<Product> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/DeleteProduct/${productId}`;
      return this.http.delete<Product>(url);
    })
  );
}

 /**
 * Upload a product image
 * @param file File to upload
 * @returns Observable of the uploaded image
 */
uploadProductImage(file: any): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/FileUpload`;
      const formData: FormData = new FormData();
      formData.append('file', file);
      return this.http.post<any>(url, formData);
    })
  );
}

  /**
 * Get all access
 * @returns Observable of all access
 */
getAccess(): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Access/GetAllAccess`;
      return this.http.get<any>(url);
    })
  );
}
  /**
 * Get all users
 * @returns Observable of all users
 */
getUsers(): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Users/GetAllUser`;
      return this.http.get<any>(url);
    })
  );
}

/**
 * Search products by name
 * @param productName Product name to search
 * @returns Observable of products matching the name
 */
searchProductByName(productName: string): Observable<Product[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/GetProductByName?productName=${productName}`;
      return this.http.get<Product[]>(url);
    })
  );
}
// most active Product 
getMostActiveProduct(): Observable<any> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.get<any>(`${apiBaseUrl}/api/Products/GetMostActiveProduct`))
  );
}

  /**
   * Populate the form with product data
   * @param product Product data
   */
  populateForm(product: any): void {
    this.form.patchValue(product);
  }

  // Validation form
  form: FormGroup = new FormGroup({
    productId: new FormControl(),
    description: new FormControl(),
    productStatus: new FormControl(),
    publishDate: new FormControl(),
    productName: new FormControl('', Validators.required, this.checkProductName.bind(this)),
    productVersion: new FormControl(),
    createdDate: new FormControl(''),
    lastModifiedDate: new FormControl(''),
    logoFilePath: new FormControl()
  });

  // Initialize form
  initializeFormGroup(): void {
    this.form.setValue({
      productId: '',
      description: '',
      productName: '',
      productVersion: '',
      productStatus: false,
      publishDate: '',
      createdDate: '',
      lastModifiedDate: new Date(),
      logoFilePath: ''
    });
  }

/**
 * Check if a product name already exists
 * @param control AbstractControl representing the product name control
 * @returns Observable of validation errors or null
 */
checkProductName(control: AbstractControl): Observable<ValidationErrors | null> {
  const productName = control.value;
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => {
      const url = `${apiBaseUrl}/api/Products/GetProductByName?productName=${productName}`;
      return this.http.get<any[]>(url);
    }),
    map((products) => {
      if (products.length > 0) {
        return { productNameExists: true };
      } else {
        return null;
      }
    })
  );
}



}