import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LogsDTO } from 'src/app/models/DTO/LogsDto';
import { User } from 'src/app/models/entity/user';
import { LogService } from 'src/app/services/log.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  isLoggedIn = false;
  currentuser?: string;
  logs: LogsDTO[] = [];
  userServices: User[] = [];
  
  constructor(private logService: LogService , private tokenStorageService: TokenStorageService , private http: HttpClient) { }

  ngOnInit() {
    this.logService.getLogs().subscribe(
      (logs: any[]) => {
        this.logs = logs;
        this.getCurrentUser();
      },
      (error) => {
        console.log(error);
      },
      
    );
  }


  

  getCurrentUser() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.currentuser = user.username;
     
    }

}
}







