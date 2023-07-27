import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModuleDTO } from 'src/app/models/DTO/ModuleDTO';
import { UpdateAccessRequest } from 'src/app/models/Request/UpdateAccessRequest';
import { Access } from 'src/app/models/entity/access';
import { Product } from 'src/app/models/entity/product';
import { AccessService } from 'src/app/services/access.service';
import { ModuleService } from 'src/app/services/module.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {
  moduleServices : ModuleDTO[]=[];
  productServices: Product[] = [];
  selectedModuleIds: number[] = [];
  access: UpdateAccessRequest[] = [];
  datasource = new MatTableDataSource(this.access)
  selectProduct: any;
  constructor( public accessService : AccessService ,private productService: ProductService, private moduleService :ModuleService,public dialogRef: MatDialogRef<EditRoleComponent>) { }
  selectedModule : any ;

  ngOnInit(): void {
   this.getActivemodules() ;
   this.getAllProducts();
   const selectedModules = this.accessService.form.get('moduleIds')?.value;
   this.selectedModuleIds = [...selectedModules];
  }


  //get selected module 
  isModuleSelected(moduleId: number): boolean {
    return this.selectedModuleIds.includes(moduleId);
  }

 //onchange Product
 onChangeproduct(event: any)
 {
   this.selectProduct= event.target.value
   console.log("the selected value ", this.selectProduct)
  }

 

  //get active modules
  getActivemodules() {
    this.moduleService.getAllModule().subscribe(res => {
      console.log(res)
      this.moduleServices = res.filter(product => product.moduleStatus === true);
    })
  }


    // get all products 
    getAllProducts(){
      this.productService.getAllProducts().subscribe(res => {
        console.log(res)
        this.productServices = res;
      })
    }



     //get the selected value of module
     onModuleSelectionChange(event: any) {
      const selectedModuleId= +event.target.value;
      if (event.target.checked) {
        // Add the newly selected module to the list of selected modules
        this.selectedModuleIds.push(selectedModuleId);
      } else {
        // Remove the unselected module from the list of selected modules
        const index = this.selectedModuleIds.indexOf(selectedModuleId);
        if (index !== -1) {
          this.selectedModuleIds.splice(index, 1);
        }
      }
    }
  
    onSubmit() {
      const updatedAccess = this.accessService.form.value;
      
      // Set the selected module IDs in the form value
      updatedAccess.moduleIds = this.selectedModuleIds;
      
      // Call the updateAccess function to update the access data in the backend
      this.accessService.updateAccess(updatedAccess).subscribe((response) => {
        // Find the index of the updated access object in the array
        const index = this.access.findIndex(m => m.accessId === response.accessId);
        if (index !== -1) {
          // Update the existing access object in the array
          this.access[index] = response;
          // Update the datasource to reflect the changes
          this.datasource.data = this.access;
        }
        window.location.href = '/admin/role'
      });
    }
    
    

onClear() {
  this.accessService.initializeFormGroup();
}
 // dialogue close 
 onClose() {
  this.dialogRef.close();
}
}