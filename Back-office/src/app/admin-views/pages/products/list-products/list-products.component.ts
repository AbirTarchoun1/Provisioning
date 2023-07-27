import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { AddProductsComponent } from '../add-products/add-products.component';
import { Product } from 'src/app/models/entity/product';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Module } from 'src/app/models/entity/module';
import { AccessService } from 'src/app/services/access.service';
import { AccessDTO } from 'src/app/models/DTO/AccessDTO';
@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ListProductsComponent implements OnInit {
  listPrducts: Product[]=[];
  filteredProducts: Product[] =[];
  modules: Module[] =[];
  filteredAccess: AccessDTO[] =[];
  selectedProductAcces : AccessDTO[]= []
  UserProduct: any
  AccessProduct !: AccessDTO[];
  productStatus = 'All Products';
  showNoModulesMessage!: boolean;
  selectedProductModules: Module[] = [];
  products: Product[] = [];
  accesss: AccessDTO[] = [];
  selectedProduct !: Product ;
  selectedAccess !: AccessDTO;
  base_url!: string;
  PathImage =  this.base_url + '/images/logo/';
  
  constructor(
    private productService: ProductService,
    private accessService: AccessService,
    private dialog: MatDialog,
    private _Snackbar: MatSnackBar
  ) {
    const storedBaseUrl = localStorage.getItem('apiBaseUrl');
    if (storedBaseUrl) {
      this.base_url = storedBaseUrl;
      this.PathImage = this.base_url + '/images/logo/';
    }
  
  }


  ngOnInit(): void {
    this.getProducts();
    this.getModuleProducts()
  }

// filter module by product
filterAccessModulesProduct(product: Product): void {
  this.selectedProduct = product;
  if (product) {
    this.accessService.getModuleProducts().subscribe(res => {
      // Filter the modules based on the selected product
      this.accesss = Array.isArray(res) ? res.filter(access => access.productName == product.productName).map(access => {
        access.moduleName = access.moduleName;
        return access;
      }) : [];
    }

    )}
}

print(val:any){
  console.log(val);
  
}
 
  // get all products 

  getProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.listPrducts = res;
      this.filteredProducts = this.listPrducts;
    })
  }

 // get products - module childrens 

 getModuleProducts(){
  this.accessService.getModuleProducts().subscribe((res: AccessDTO[]) => {
    this.AccessProduct = res;
  });
}
    
 

  //search by products status 
  filterByStatus(status: boolean) {
    this.filteredProducts = this.listPrducts.filter(product => product.productStatus === status);
  }


  /*************************
   * delete product
   */
  onDeleteProduct(productId: number) {
    Swal.fire({
      title: 'Are you sure to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      cancelButtonColor: 'gray'
    }).then((result) => {
      if (result.value) {
        this.productService.deleteProduct(productId)
          .subscribe(
            response => {
              console.log(response);

              if (result.dismiss === Swal.DismissReason.cancel) {
              }

              this.getProducts()

            });
        //snackBar success 
        this._Snackbar.open(" Deleted Successfully", + '' + "K" + '' + '⚡', {
          duration: 8000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ["mat-toolbar", "mat-success"],
        });
      }

    });

  }


  //dialog edite product 

  onEditproduct(row: any) {
    console.log('======================id===>',this.productService.form.value.id);
    
    this.productService.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height= "80%";
    this.dialog.open(EditProductComponent, dialogConfig); }

    // create dialog config
    onCreateproduct() { 
      this.productService.initializeFormGroup();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "40%";
      dialogConfig.height= "80%";
      this.dialog.open(AddProductsComponent, dialogConfig);
  
    }


}
