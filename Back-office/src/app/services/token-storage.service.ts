import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


/*************************
 * 
 * @Author Tarchoun Abir
 * 
 ************************/

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor( private router : Router) { }

  //session clear
  signOut(): void {
    localStorage.clear();
    localStorage.clear();
    //location.href = '/login'
    this.router.navigate(['/auth']);
  }

  //saveToken information
  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  //get token information
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  //save user session information 
  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // get currentUser session  information
  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

}
