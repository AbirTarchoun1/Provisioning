import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LicensesDTO } from 'src/app/models/DTO/LicensesDTO';
import { ModuleDTO } from 'src/app/models/DTO/ModuleDTO';
import { License } from 'src/app/models/entity/license';
import { Product } from 'src/app/models/entity/product';
import { User } from 'src/app/models/entity/user';
import { AccessService } from 'src/app/services/access.service';
import { LicenseService } from 'src/app/services/license.service';
import { ModuleService } from 'src/app/services/module.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import localeIt from '@angular/common/locales/it';
import { DatePipe, registerLocaleData } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { Access } from 'src/app/models/entity/access';
import { AccessDTO } from 'src/app/models/DTO/AccessDTO';
import * as moment from 'moment-timezone';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-license',
  templateUrl: './add-license.component.html',
  styleUrls: ['./add-license.component.css']
})
export class AddLicenseComponent implements OnInit {

  moduleServices: ModuleDTO[] = [];
  productServices: Product[] = [];
  userServices: User[] = [];
  productSelected: number = 0;
  licenseServices: LicensesDTO[] = [];
  accessServices: AccessDTO[] = [];
  userSelected: number = 0;
  moduleSelected: any;
  accesSelected: any;
  monthSelected: any;
  accessServiceS !: Access[];
  modules: any;
  currentDate: moment.Moment = moment();
  date = new Date();
  // create a new Date object
  timestamp = this.date.getTime(); // c
  selectedAccessId: number = 0;
  filteredModules: ModuleDTO[] = [];
  constructor(public moduleService: ModuleService, public productService: ProductService,
    private accessService: AccessService, private userService: UserService, private snackBar: MatSnackBar,
    public licenseService: LicenseService, public dialogRef: MatDialogRef<AddLicenseComponent>,
    private dateAdapter: DateAdapter<NativeDateAdapter>, @Inject(MAT_DATE_LOCALE) private readonly dateLocale: string, public datePipe: DatePipe
  ) {

    registerLocaleData(localeIt, 'it');


  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('it');
    this.getAllUsers();
    this.getActiveProducts();
    this.getAllAccess();
    this.getActiveModules();


  }



  //all active products 
  getActiveProducts() {
    this.productService.getAllProducts().subscribe(res => {
      console.log(res);
      this.productServices = res.filter(product => product.productStatus === true);
    });
  }


  //all licenses 
  getAlllicenses() {
    this.licenseService.getallLicense().subscribe((res: LicensesDTO[]) => {
      console.log(res)
      this.licenseServices = res;
    })
  }


  //all active modules
  getActiveModules() {
    this.moduleService.getAllModule().subscribe((res: ModuleDTO[]) => {
      this.moduleServices = res.filter(module => module.moduleStatus === true);
    });
  }

  //all access
  getAllAccess() {
    this.accessService.getallAccess().subscribe(res => {
      console.log(res)
      this.accessServices = res;
    })
  }

  //get all users 
  getAllUsers() {
    this.userService.GetallUsers().subscribe((data: any) => {
      // Filter the data based on the user role
      const users = data.filter((user: { level: string; }) => user.level !== 'admin');
      this.userServices = users;
    });
  }



  //on chnge product 
  onChangeproduct(event: any) {
    this.productSelected = Number(event.target.value);
    console.log('the product selected =>', this.productSelected)
  }

  //on chnge product 
  onChangeMonth(event: any) {
    this.monthSelected = event.target.value;
    console.log('the month selected =>', this.monthSelected)
  }


  //on chnge rol
  onChangeaccess(event: any) {
    //debugger
    this.accesSelected = event.target.value;
    this.moduleService.getModulesByAccessId(this.accesSelected).subscribe((res: ModuleDTO[]) => {
      this.filteredModules =res;
    })
  }



  //on cahange module
  onChangemodule(event: any) {
    this.moduleSelected = Number(event.target.value);
    console.log('the module selected =>', this.moduleSelected)
  }


  //on change user
  onChangeuser(event: any) {
    this.userSelected = Number(event.target.value);
    console.log('the user selected =>', this.userSelected)
  }

  //reset data 
  onClear() {
    this.licenseService.form.reset();
  }
  // dialogue close 
  onClose() {
    this.dialogRef.close();
  }




  //save licence
  license: License = new License();
  onActivationDateChange(event: Event) {
    console.log(event);
    const value = (event.target as HTMLInputElement).value;
    this.license.startDate = new Date(value);
  }
  saveLicense() {
    //debugger
    this.license.userId = this.userSelected;
  //  this.license.productId = this.productSelected;
    this.license.activationMonths = this.licenseService.form.value.activationMonths;
    this.license.accessId = this.accesSelected;
    this.license.startDate = this.licenseService.form.value.startDate = new Date();
    this.license.licenseStatus = this.licenseService.form.value.licenseStatus;
    if (
      !this.license.userId ||
      // !this.license.productId ||
      !this.license.activationMonths ||
      !this.license.accessId ||
      !this.license.startDate ||
      !this.license.licenseStatus
    ) {
      const message = 'Please fill in all the required fields.';
      const action = 'Close';
      const panelClass = ['alert-danger', 'custom-alert']; // CSS classes for red color and custom position

      this.snackBar.open(message, action, {
        panelClass: panelClass,
        duration: 5000, // Duration in milliseconds (adjust as needed)
      });      return;
    }
    this.licenseService.createLicense(this.license).subscribe((res) => { 
      window.location.href="/admin/licenses";})
    
  }

  // when i select the role module that are affected to this role must diplyed : still fixing it not work
 

  //methode  not work also
  onSelectAccess(event: any) {
    this.selectedAccessId = event.target.value;
    if (this.modules && this.modules.length > 0) {
    // Filter the modules array to only include the modules that belong to the selected access
      const accessId = event.target.value;
      this.selectedAccessId = accessId;  
      console.log("hh",accessId)  
      this.filteredModules = this.modules.filter((module: any) => module.accessId === accessId);
      console.log("accessId1", this.selectedAccessId);
console.log("modules for accessId1", this.modules);
      console.log(  this.modules.filter((module: any) => module.accessId === accessId),"********")  
  }
}


onSelectAcces(event: any): void {
    
  const accessId = event.target.value;
  const selectedAccess = this.accessServices.find((access) => access.accessId == accessId);
  if (selectedAccess) {
    this.selectedAccessId = selectedAccess.accessId;
   // this.filteredModules = this.modules.filter((module: { accessId: number; }) => module.accessId === this.selectedAccessId);

   this.filteredModules = this.modules.filter((item1: any) => {
    return this.accessServices.some(item2 => item2.moduleIds.includes(item1.moduleId));
  });
  
console.log("accessId", this.selectedAccessId);

console.log("modules for accessId", this.modules);

  } else {
    alert("module do not have accessId")
    this.filteredModules = [];
  }
}

}

