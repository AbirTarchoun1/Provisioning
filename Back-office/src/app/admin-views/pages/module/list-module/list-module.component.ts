import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Module } from 'src/app/models/entity/module';
import { AddModuleComponent } from '../add-module/add-module.component';
import { ModuleService } from 'src/app/services/module.service';
import { EditModuleComponent } from '../edit-module/edit-module.component';
import Swal from 'sweetalert2';
import { ModuleDTO } from 'src/app/models/DTO/ModuleDTO';

@Component({
  selector: 'app-list-module',
  templateUrl: './list-module.component.html',
  styleUrls: ['./list-module.component.css']
})
export class ListModuleComponent implements OnInit {
  moduleForm!: FormGroup;
  moduleData!: Module;
  module: ModuleDTO[] = [];
  searchKey!: string;
  showspinner = false;
  ModuleList = [];
  data: any;
  noDataFound !: boolean ;
  allModules: ModuleDTO[] = []; // define an array to hold all the modules
  displayedModules: ModuleDTO[] = []; // define an array to hold the modules to display on the table
  moduleStatus: string = 'All Modules';
  listModules: ModuleDTO[] = [];
  filteredModules: ModuleDTO[] = [];
  datasource = new MatTableDataSource(this.module);
  displayedColumns: string[] = [
    'moduleName',
    'productNames',
    'moduleStatus',
   // 'lastModificatedDate',
    'codMod',
    'codModPack',
    
    'actions',
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {}) sort!: MatSort;
  mybreakpoint!: number;
  productSearchKey !: string;
  moduleName!: string;

  constructor(
    private dialog: MatDialog,
    public _Snackbar: MatSnackBar,
    private moduleService: ModuleService,
    public router: Router,
    public dialogRef: MatDialogRef<AddModuleComponent>) { }


  ngOnInit(): void {
    this.mybreakpoint = window.innerWidth <= 600 ? 1 : 6;
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
    this.getAllModules();
  }


  getProductByModule() {
    if (this.productSearchKey) {
      this.moduleService.getModulesByProduct(this.productSearchKey).subscribe((data: any) => {
        // If the data is not an array, transform it to an array
        const dataArray = Array.isArray(data) ? data : [data];

        // Assign the response data to the module property
        this.module = dataArray;


        // Update the MatTableDataSource with the new data
        this.datasource = new MatTableDataSource(this.module);

        // Re-render the table
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;

      }, error => {
        console.error(error);
      });
    }

  }

  // clear data after search by product name
  onProductSearchClear() {
    this.productSearchKey = ' ';
    this.getAllModules();
  }

  // clear data after search by module name
  onModuleSearchClear() {
    this.moduleName = '';
    this.getModuleByName();
  }


  // get module by name

  getModuleByName() {
    // check if search criteria is not empty
    if (this.moduleName.trim() !== '') {
      this.moduleService.getModulesByName(this.moduleName).subscribe((data: any) => {
        const dataArray = Array.isArray(data) ? data : [data]; 
        this.module = dataArray;
        this.datasource.data = data;
        this.datasource = new MatTableDataSource(this.module);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
        if (dataArray.length === 0) {
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
        }
      });
    } else {
      // if search criteria is empty, retrieve all data
      this.moduleService.getAllModule().subscribe((data) => {
        this.module = data;
        this.datasource.data = data;
        this.datasource = new MatTableDataSource(this.module);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
        this.noDataFound = false;
      });
    }
  }

  //pagination and sorting of data 
  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }


  // get all modules
  getAllModules() {
    this.moduleService.getAllModule().subscribe((module) => {
    
      this.datasource = new MatTableDataSource(this.module);
      this.datasource.data = module;
     console.log('this.data', module)
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    });
  }

  

  // filter modules by status
  filterByStatuS(moduleStatus: boolean | null) {
    // Use the filterPredicate function of MatTableDataSource to filter the table
    this.datasource.filterPredicate = (data: ModuleDTO) => {
      const showAll = moduleStatus === null;
      return showAll || (moduleStatus === true ? data.moduleStatus : !data.moduleStatus);
    };
  
    // Set the filter value to 'true', 'false', or ''
    this.datasource.filter = moduleStatus === null ? '' : moduleStatus.toString();
  }

  onModuleNameChange(value: string) {
    this.moduleName = value;
    this.getModuleByName();
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
  onDelete(moduleId: number) {
    Swal.fire({
      title: 'Are you sure to delete this module?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      cancelButtonColor: 'gray'
    }).then((result) => {
      if (result.value) {
        this.moduleService.deleteModule(moduleId)
          .subscribe(
            (response) => {
              console.log(response);
              this.ModuleList.push();
              if (result.dismiss === Swal.DismissReason.cancel) {
              }
            });
      }
      location.href = '/admin/modules'
    });

  }


  /************************
    * OnEdite PoP UP
    * 
    ***/

  onEdit(row: any) {
    this.moduleService.populateForm(row);
    console.log('the row ===>', JSON.stringify(row));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.height = "50%";
    this.dialog.open(EditModuleComponent, dialogConfig);
  }



  /************************
   * On clear Form
   * 
   ***/

  onClear() {
    
    this.moduleService.initializeFormGroup();
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
    dialogConfig.height = "50%";
    this.dialog.open(AddModuleComponent, dialogConfig);
    this.onClear()

  }



}
