import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomHttpRespone } from '../models/entity/custome-http-response';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiconfigService } from './apiconfig.service';
import { switchMap } from 'rxjs/operators';

/***********************
 * 
 * @author Tarchoun Abir
 * 
 **********************/
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
    
  }

  // login
  login(username: string, password: string): Observable<any> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap((apiBasePath) => {
        const url = `${apiBasePath}/api/Users/Login`;
        return this.http.post(url, { username, password });
      })
    );
    }

  // register
  create(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string
  ): Observable<any> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap((apiBasePath) => {
        const url = `${apiBasePath}/api/Users/register`;
        return this.http.post(url, {
          username,
          email,
          password,
          confirmPassword,
          phoneNumber,
          role: 'user',
          productId: 1,
        });
      })
    );
  }

  // reset password
  public forgetPassword(email: string): Observable<CustomHttpRespone> {
    return this.apiconfigService.getApiBasePath().pipe(
      switchMap((apiBasePath) => {
        const url = `${apiBasePath}/api/Users/resetpassword/${email}`;
        return this.http.get<CustomHttpRespone>(url);
      })
    );
  }
  form: FormGroup = new FormGroup({
    userId: new FormControl(null),
    username: new FormControl(''),
    email: new FormControl(''),
    confirmPassword: new FormControl(''),
    userStatus: new FormControl(''),
    phoneNumber: new FormControl(''),
    productId: new FormControl(''),
    password: new FormControl([
      Validators.required,
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}$"),
    ]),
  });

  initializeFormGroup() {
    this.form.setValue({
      userId: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      userStatus: null,
      phoneNumber: null,
      productId: 1,
    });
  }

  populateForm(accountuser: any) {
    this.form.patchValue(accountuser);
  }
}