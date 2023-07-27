import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleDTO } from 'src/app/models/DTO/ModuleDTO';
import { Product } from 'src/app/models/entity/product';
import { AccessService } from 'src/app/services/access.service';
import { ModuleService } from 'src/app/services/module.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  moduleServices: ModuleDTO[] = [];
  productServices: Product[] = [];
  selectedProduct: any;
  errorMessage = '';
  productName!: string;
  selectedModuleNames: string[] = [];
  constructor(
    public accessService: AccessService,
    private _snackBar: MatSnackBar,
    private productService: ProductService,
    private moduleService: ModuleService,
    public dialogRef: MatDialogRef<AddRoleComponent>
  ) {}

  ngOnInit(): void {
    this.getActiveModules();
    this.getActiveProducts();
  }

  getActiveProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      console.log(res);
      this.productServices = res.filter((product) => product.productStatus === true);
    });
  }

  getActiveModules() {
    this.moduleService.getAllModule().subscribe((res) => {
      console.log(res);
      this.moduleServices = res.filter((module) => module.moduleStatus === true);
    });
  }

  onModuleSelectionChange(event: any) {
    const moduleName = event.target.value;
    if (event.target.checked) {
      this.selectedModuleNames.push(moduleName);
    } else {
      const index = this.selectedModuleNames.indexOf(moduleName);
      if (index !== -1) {
        this.selectedModuleNames.splice(index, 1);
      }
    }
  }
  
  //onchange Product
  onChangeproduct(event: any) {
    this.productName="";
    this.selectedProduct = event.target.value
    this.getModulesByProductId(this.selectedProduct);
    this.productServices.forEach(item =>{
      console.log(item)
      if(item.productId===Number(this.selectedProduct)){
        this.productName=item.productName 
        
      }
      
    })
    console.log("the selected value ", this.selectedProduct)
  }

  onSubmit() {
    const moduleNameString: string = this.selectedModuleNames.join(','); // Join the module names into a comma-separated string

  let accessBody = {
    accessName: this.accessService.form.value.accessName,
    moduleName: moduleNameString, // Use the comma-separated string of module names
    productId: this.accessService.form.value.productId,
    productName: this.productName,
    createdDate: new Date(),
    lastModificatedDate: new Date(),
  };

    this.accessService.createAccess(accessBody).subscribe(
      (resp: any) => {
        window.location.href = '/admin/role';
      },
      (err: any) => {
        if (err.error.message) {
          this._snackBar.open(err.error.message, '', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-warn'],
          });
          return;
        }
      }
    );
  }
  
  getModulesByProductId(id: number) {
    this.moduleService.getAllModulesByProductId(id).subscribe(res => {
      this.moduleServices = res.filter(module => module.moduleStatus === true);
    });
  }

  

  onClear() {
    this.accessService.initializeFormGroup();
  }

  onClose() {
    this.dialogRef.close();
  }
}



 