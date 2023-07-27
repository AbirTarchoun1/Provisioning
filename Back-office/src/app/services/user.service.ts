import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/entity/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatePasswordService } from './validate-password.service';
import { UpdateCurentuserRequest } from '../models/Request/UpdateCurent-userRequest';
import { ApiconfigService } from './apiconfig.service';
import { switchMap } from 'rxjs/operators';



/*************************
 * 
 * @Author Tarchoun Abir
 * 
 ************************/

@Injectable({
  providedIn: 'root'
})
export class UserService {

   
  //http opttion for handel errors 
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };
  //handel api  errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //a client-side or a neetwork error occurend .Handel it accordingly
      console.error('An Error occurend', error.error.message);
    } else {
      // the backend may returned an successfully response code
      // the response body may contain clues as to what went wrong
      console.error(
        `backend returned code ${error.status}, ` + `body was : ${error.error}`
      );
    }
    // return an observabel with a user-facing error message
    return throwError('something bad happined , please try again later .');
  }

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService, private v: ValidatePasswordService) {
 
  }

  /***********************
   * 
   * CRUD OPORATION
   * 
   ****************/

  GetallUsers(): Observable<User[]> {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          const url = `${apiBasePath}/api/Users/GetAllUser`;
          return this.http.get<User[]>(url);
        })
      );
    }

    /**
     * 
     * @param AddUserRequest 
     * @returns  new user
     */
    
    createNewUser(AddUserRequest: any): Observable<any> {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          const url = `${apiBasePath}/api/Users/AddUser`;
          return this.http.post(url, AddUserRequest, this.httpOptions);
        })
      );
    }

/**
 * 
 * @param email 
 * @returns  filter by email
 */
    searchUsersByEmail(email: string): Observable<User[]> {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          const url = `${apiBasePath}/api/Users/GetUserByEmail?email=${email}`;
          return this.http.get<User[]>(url);
        })
      );
    }
    /**
     * 
     * @param username 
     * @returns  filter by uer name
     */

    searchUsersByUsername(username: string): Observable<User[]> {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          const url = `${apiBasePath}/api/Users/GetUserByUserName?username=${username}`;
          return this.http.get<User[]>(url);
        })
      );
    }
    /**
     * 
     * @param createdDate 
     * @return filter by created date 
     */
    getFilteredByCreatedDate(createdDate: Date): Observable<User[]> {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          const encodedDate = encodeURIComponent(createdDate.toISOString());
          const url = `${apiBasePath}/api/Users/GetUserByCreatedDate?createdDate=${encodedDate}`;
          return this.http.get<User[]>(url);
        })
      );
    }
    
    /**
     * 
     * @param user 
     * @returns 
     */
    UpdateUserStatut(user: User) {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          return this.http.put<User>(`${apiBasePath}/api/Users/UpdateUserStatus`, user);
        })
      );
    }
    /**
     * 
     * @param item 
     * @returns  update current user
     */
    updateCurrentUser(item: any) {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          return this.http.put<UpdateCurentuserRequest>(`${apiBasePath}/api/Users/UpdateCurrentUser`, item);
        })
      );
    }
    /**
     * 
     * @param item 
     * @returns  update user 
     */
    updateUser(item: any) {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          return this.http.put<UpdateCurentuserRequest>(`${apiBasePath}/api/Users/UpdateUser/${item.userId}`, item);
        })
      );
    }
    /**
     * 
     * @param userId 
     * @returns  delete user
     */
    deleteUser(userId: number) {
      return this.apiconfigService.getApiBasePath().pipe(
        switchMap((apiBasePath) => {
          if (!apiBasePath) {
            throw new Error('API base URL not loaded');
          }
          return this.http.delete<User>(`${apiBasePath}/api/Users/DeleteUser/${userId}`, this.httpOptions);
        })
      );
    }

  //validation form
  form: FormGroup = new FormGroup({
    userId: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    userStatus: new FormControl(''),
    password: new FormControl([
      Validators.required,
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")
    ]),
    confirmPassword: new FormControl(
      ''
    ),
  },
    this.v.passwordMatch('password', 'confirmPassword'))


  // inialisation of the formCroup
  initializeFormGroup() {
    this.form.setValue({
      userId: null,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      userStatus: '',
    });
  }


  //get value for update
  populateForm(accountuser: any) {
    this.form.patchValue(accountuser);
  }


}