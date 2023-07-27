import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/entity/user';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.css']
})
export class ProfileUsersComponent implements OnInit {
 
  /***************************
   * variable initialisations 
   * 
   */
  currentUser !: any;
  hide = true;
  panelOpenState = true;
  user !: FormGroup;
  public refreshing: boolean | undefined;



  constructor(private token: TokenStorageService,public router: Router,private userService: UserService
    , public _Snackbar : MatSnackBar,private fb: FormBuilder) {

    //validation Form
    this.user = this.fb.group({
      userId: new FormControl(),
      username: new FormControl(),
      email: new FormControl(),
    });
  }
 

  //memoire permanant 
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.user.patchValue(this.currentUser);
    console.log(this.currentUser)
  }


 /*********************************
   * update current user info
   */
  
 save() {


  
  Swal.fire({
       title: 'Are you sure to update Your profil?',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Yes',
       cancelButtonText: 'No',
       }).then((result) => {
       if (result.value) {
        this.userService.updateCurrentUser({
             userId:this.user.value.id,
             username: this.user.value.username,
             email: this.user.value.email
             
        }).subscribe(r => {
          
          let user= JSON.parse(sessionStorage.getItem("auth-user") || " ");
          let newSessionObject={
           token:user.token,
           role:user.role,
           userStatus:user.userStatus,
           username: this.user.value.username,
           email: this.user.value.email
          }
          
           sessionStorage.setItem("auth-user",JSON.stringify(newSessionObject));
           console.log("updated", r);
          
          Swal.fire('Updated!', ' Updated successfully.', 'success');
          if (result.dismiss === Swal.DismissReason.cancel) {
         
        }
      },

        error => {
          // snackBar error
          this._Snackbar.open("Error occurend !!" + error?.message, "", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: ["mat-toolbar", "mat-warn"],
          });
        });
    }
  });
}

  }
