import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleDTO } from 'src/app/models/DTO/ModuleDTO';
import { Module } from 'src/app/models/entity/module';
import { Product } from 'src/app/models/entity/product';
import { ModuleService } from 'src/app/services/module.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css']
})
export class AddModuleComponent implements OnInit {
  moduleServices: ModuleDTO[] = [];
  productServices: Product[] = [];
  productSelected: any;
  filteredModules: ModuleDTO[] = [];
  selectedProductId: number[] = [];
  constructor(public moduleService: ModuleService, private _snackBar: MatSnackBar,
    private productService: ProductService, public dialogRef: MatDialogRef<AddModuleComponent>) { }

  ngOnInit(): void {
    this.getAllmodules()
    this.getACtiveProducts();
  }


  //get the selected value of products 
  onProductSelectionChange(event: any) {
    const selectedProductId = +event.target.value;
    if (event.target.checked) {
      this.selectedProductId.push(selectedProductId);

    } else {
      const index = this.selectedProductId.indexOf(selectedProductId);
      if (index !== -1) {
        this.selectedProductId.splice(index, 1);
      }
    }
    this.moduleService.form.patchValue({
      productId: this.selectedProductId[0]
    });

  }


  //get active products 
  getACtiveProducts() {
    this.productService.getAllProducts().subscribe(res => {
      console.log(res);
      this.productServices = res.filter(product => product.productStatus === true);
    });
  }
  //get all module 
  getAllmodules() {
    this.moduleService.getAllModule().subscribe((res:any)=> {
      console.log(res)
      this.moduleServices = res;
    })
  }

 

  // submit data with context EDITE : CREATE
  onSubmit() {
    const id = this.moduleService.form.value.productId;
    const moduleBody: ModuleDTO = new ModuleDTO();
    moduleBody.moduleName = this.moduleService.form.value.moduleName;
    moduleBody.modulePackage = this.moduleService.form.value.modulePackage;
    moduleBody.productId = this.moduleService.form.value.productId;
    moduleBody.description = this.moduleService.form.value.description;
    moduleBody.moduleStatus = this.moduleService.form.value.moduleStatus;

    console.log(moduleBody);
    if (id == undefined) {
      return;
    }
    this.moduleService.createModule(moduleBody).subscribe((res) => {
      window.location.href = '/admin/modules'
      this.onClose();
    },
      (err) => {

        //get error from backend  
        if (err.error.message) {
          console.log(err.error.message, "******************");
          this._snackBar.open(err.error.message, '', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-warn'],
          });
          return;
        }
      })

  }

  // reset the form 
  onClear() {
    this.moduleService.form.reset();
  }

  // dialogue close 
  onClose() {
    this.dialogRef.close();
  }
}
