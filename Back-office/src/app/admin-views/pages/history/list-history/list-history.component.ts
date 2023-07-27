import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LicenseHistory } from 'src/app/models/entity/lisenceHistory';
import { LicenseHistoryService } from 'src/app/services/license-history.service';
import { LicenseService } from 'src/app/services/license.service';

@Component({
  selector: 'app-list-history',
  templateUrl: './list-history.component.html',
  styleUrls: ['./list-history.component.css']
})
export class ListHistoryComponent implements OnInit {
    licenseHistoryForm!: FormGroup;
    licenseHistoryData!: LicenseHistory;
    history: LicenseHistory[] = [];
    searchKey!: string;
    showspinner = false;
    ModuleList = [];
    data: any;
   datasource = new MatTableDataSource(this.history);
    displayedColumns: string[] = [
      'licenseId',
      'endDate',
      'modules',
      'product',
      'accessName'
    ];
  
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort, {}) sort!: MatSort;
    mybreakpoint!: number;
    productSearchKey !: string;
    moduleName!: string;
  
    constructor(
      private dialog: MatDialog,
      public _Snackbar: MatSnackBar,
      private licenseHistoryService: LicenseHistoryService) { }
  
  
    ngOnInit(): void {
      this.mybreakpoint = window.innerWidth <= 600 ? 1 : 6;
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;
      this.getAllLicensesHistory();
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

  getAllLicensesHistory() {
      this.licenseHistoryService.getAllLicenseHistory().subscribe((response) => {
      this.datasource.data = response;
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

  
  }
  
