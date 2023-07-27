import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateModuleRequest } from 'src/app/models/Request/UpdateModuleRequest';
import { Module } from 'src/app/models/entity/module';
import { Product } from 'src/app/models/entity/product';
import { ModuleService } from 'src/app/services/module.service';
import { ProductService } from 'src/app/services/product.service';





@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css']
})
export class EditModuleComponent implements OnInit {

  @ViewChild('moduleForm', { static: false })
  moduleForm !: FormGroup;
  moduleData !: Module;
  module: UpdateModuleRequest[] = [];
  searchKey!: string;
  showspinner = false;
  productServices : Product[]=[]
  datasource = new MatTableDataSource(this.module)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {}) sort!: MatSort;
  productSelected: any;
  selectedProductIds: number[] = [];
  constructor(
    public moduleService: ModuleService,
    public dialogRef: MatDialogRef<EditModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Module // Inject the data here
  ) {
    // Assign the injected data to moduleData property
    this.moduleData = data;
  }
  ngOnInit(): void {
    this.getAllmodule();
    this.moduleData = this.data; // Assign the correct module data to moduleData property
    this.moduleService.populateForm(this.moduleData); // Call the populateForm method
    const selectedProducts = this.moduleService.form.get('productId')?.value;
    this.selectedProductIds = [...selectedProducts];
  }
  
  

  isProductSelected(productId: number): boolean {
    return this.selectedProductIds.includes(productId);
  }

  
  
  //get all module 
  getAllmodule() {
    this.moduleService.getAllModule().subscribe((response: any) => {
      this.datasource.data = response;
    })
  }



//get the selected value of products 
onProductSelectionChange(event: any) {
  const selectedProductId = +event.target.value;
  if (event.target.checked) {
    // Add the newly selected product to the list of selected products
    this.selectedProductIds.push(selectedProductId);
  } else {
    // Remove the unselected product from the list of selected products
    const index = this.selectedProductIds.indexOf(selectedProductId);
    if (index !== -1) {
      this.selectedProductIds.splice(index, 1);
    }
  }
}

onSubmit() {
  const updatedModule = this.moduleService.form.value;

  this.moduleService.updateModule(updatedModule).subscribe((response) => {
    // Refresh the data by re-fetching it from the server
    this.moduleService.getAllModule().subscribe((data) => {
      this.datasource.data = data;
    });
    
  window.location.href = '/admin/modules'
  });
}






// dialogue close 
onClose() {
this.dialogRef.close();

}
//clear data
onClear() {
this.moduleService.initializeFormGroup();
}

}