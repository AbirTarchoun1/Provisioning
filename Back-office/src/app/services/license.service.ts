import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { License } from '../models/entity/license';
import { LicensesDTO } from '../models/DTO/LicensesDTO';
import * as moment from 'moment';
import 'moment-timezone';
import { ApiconfigService } from './apiconfig.service';


@Injectable({
  providedIn: 'root'
})

/*************************
 * 
 * @Author Tarchoun Abir
 * 
 ************************/

export class LicenseService {


  //api backend
  private base_url!: string;

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
    this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => {
        this.base_url = apiBaseUrl;
        console.log('API Base URL:', this.base_url);
        return this.apiconfigService.getApiBasePath();
      }),
      catchError(error => {
        console.log('Error retrieving API base URL:', error);
        return throwError(error);
      })
    ).subscribe();
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
   * to add license
   * @param item 
   * @returns 
   */
  

  createLicense(bodyRequest: any): Observable<any> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap(apiBaseUrl => {
        const url = `${apiBaseUrl}/api/License/addlicense`;
        return this.http.post<any>(url, bodyRequest);
      })
    );
  }

  /**
   * 
   * @returns all licenses
   */
  getallLicense(): Observable<LicensesDTO[]> {
    return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.get<LicensesDTO[]>(`${apiBaseUrl}/api/License/getLicenses`))
    );
  }


  /**
   * delete license
   * @param id 
   * @returns 
   */
  deleteLicense(licenseId: number) {
    return this.http.delete<License>(`${this.base_url}` + '/DeleteLicense/' + licenseId, this.httpOptions).pipe(retry(2), catchError(this.handleError));

  }


  //validation form
  form: FormGroup = new FormGroup({
    licenseId: new FormControl(null),
    moduleId: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
    accessId: new FormControl('', Validators.required),
    //productId: new FormControl('', Validators.required),
    activationMonths: new FormControl(''),
    licenseStatus: new FormControl(false),
    createdDate: new FormControl(''),
    startDate:
      new FormControl(
        moment().tz('Europe/Rome').format('DD-MM-YYYY HH:mm:ss a'),

        [
          Validators.required, this.startDateValidator
        ]
      ),
      endDate: new FormControl(''),
    renewMode: new FormControl(''),
    lastModificatedDate: new FormControl('')

  });

  startDateValidator(control: FormControl): { [s: string]: boolean } | null {
    const startDate = moment.tz(control.value, 'Europe/Rome');
    const today = moment.tz('Europe/Rome');
    if (startDate.isBefore(today, 'day')) {
      return { startDateInvalid: true };
    }
    return null;
  }

  // inialisation form
  initializeFormGroup() {
    this.form.setValue({
      licenseId: null,
      userId: '',
      moduleId: '',
      accessId: '',
      activationMonths: '',
      createdDate: '',
      lastModificatedDate: new Date(),
      licenseStatus: false,
      startDate: '',
      endDate: '',
      renewMode: '',
    })
  }

  //get value for update 
  populateForm(license: any) {
    this.form.patchValue(_.omit(license));
  }



}


