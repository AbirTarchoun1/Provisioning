import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddLicenseComponent } from '../add-license/add-license.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LicenseService } from 'src/app/services/license.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { License } from 'src/app/models/entity/license';
import { LicensesDTO } from 'src/app/models/DTO/LicensesDTO';

@Component({
  selector: 'app-list-license',
  templateUrl: './list-license.component.html',
  styleUrls: ['./list-license.component.css']
})
export class ListLicenseComponent implements OnInit {
  licenseForm!: FormGroup;
  licenseData!: License;
  license:LicensesDTO[] = [];
  searchKey!: string;
  showspinner = false;
  licenseList = [];
  data: any;
  licenses: LicensesDTO[] = [];
  datasource = new MatTableDataSource(this.license);
  displayedColumns: string[] = [
    'licenseId',
    'startDate',
    'endDate',
    'licenseStatus',
    'username',
    'productName',
    'accessName',
    'moduleName',
    'actions',
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {}) sort!: MatSort;
  mybreakpoint!: number;

  constructor(
    private dialog: MatDialog,
    public _Snackbar: MatSnackBar,
    private licenseService: LicenseService,
    public dialogRef: MatDialogRef<AddLicenseComponent>) { }


  ngOnInit(): void {
    this.mybreakpoint = window.innerWidth <= 600 ? 1 : 6;
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
    this.getAllLicenses()
  }

   //pagination and sorting of data 
  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }


  /*********************
   * Get All Modules
   * 
   ***/

  getAllLicenses() {
      this.licenseService.getallLicense().subscribe((response) => {
      this.datasource.data = response;

      console.log("licenses: ", response)
    });
  }


  //search 
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  //apply filter
  applyFilter() {
    this.datasource.filter = this.searchKey.trim().toLowerCase();
  }


  /************************
   * OnDelete User
   * 
   ***/
  onDelete(licenseId: number) {
    Swal.fire({
      title: 'Are you sure to delete this module?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      cancelButtonColor: 'gray'
    }).then((result) => {
      if (result.value) {
        this.licenseService.deleteLicense(licenseId)
          .subscribe(
            (response) => {
              console.log(response);
              this.licenseList.push();
              if (result.dismiss === Swal.DismissReason.cancel) {
              }
            });
      }
      
     //window.location.href = '/admin/licenses'
    });

  }


  /************************
    * OnEdite PoP UP
    * 
    ***/

  onEdit(row: any) {
    this.licenseService.populateForm(row);
    console.log('the row ===>', JSON.stringify(row));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.height= "60%";
   this.dialog.open(AddLicenseComponent, dialogConfig);
  }



  /************************
   * On clear Form
   * 
   ***/

  onClear() {
    this.licenseService.initializeFormGroup();
  }



  /***************************
  *  Dialog Config For create 
  * 
  ****/

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.height= "60%";
    this.dialog.open(AddLicenseComponent, dialogConfig);
    this.onClear()

  }

}
