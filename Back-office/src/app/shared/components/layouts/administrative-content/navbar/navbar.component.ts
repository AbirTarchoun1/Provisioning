import {Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';


/***
 * 
 * @author Tarchoun Abir 
 * 
 */

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  currentuser?: string;
  role?: string;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.currentuser = user.username;
      this.role = user.role;
    }
  }

  logout(): void {
  this.tokenStorageService.signOut();
  }
}
