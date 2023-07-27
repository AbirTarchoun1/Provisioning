import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entity/product';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Module } from 'src/app/models/entity/module';
import { AccessService } from 'src/app/services/access.service';
import { AccessDTO } from 'src/app/models/DTO/AccessDTO';
import { ApiconfigService } from 'src/app/services/apiconfig.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
  animations: [
    trigger('activeProduct', [
      state('true', style({
        position: 'relative',
        overflow: 'hidden'
      })),
      state('false', style({
        position: 'relative'
      })),
      transition('false => true', [
        animate('0.5s ease-in-out', style({
          transform: 'translateY(0%)'
        }))
      ]),
      transition('true => false', [
        animate('0.5s ease-in-out', style({
          transform: 'translateY(100%)'
        }))
      ])
    ])
  ]
})
export class ListProductComponent implements OnInit {
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
  PathImage!: string;
  
  constructor(
    private http: HttpClient,
    private apiconfigService: ApiconfigService,
    private productService: ProductService,
    private accessService: AccessService,
    private dialog: MatDialog,
    private _Snackbar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.apiconfigService.loadApiBasePath().pipe(
      switchMap((apiConfig: any) => {
        if (apiConfig && apiConfig.apiBaseUrl) {
          this.base_url = apiConfig.apiBaseUrl;
          console.log('API Base URL:', this.base_url); // Verify the retrieved base URL
          this.PathImage = this.base_url + '/images/logo/'; // Set the PathImage using the retrieved base URL
          console.log('Image Path:', this.PathImage); // Verify the PathImage
          return this.http.get<any>(this.base_url); // Replace this with your actual HTTP request
        } else {
          throw new Error('Invalid API base URL configuration.');
        }
      })
    ).subscribe(
      () => {
        // Handle the result of the subsequent service method call here
      },
      (error) => {
        console.log('Error retrieving API base URL:', error); // Log any errors during API base URL retrieval
      }
    );
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

 
  // get all products 

  getProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      console.log('result of the product ====================>', res)
    
      this.listPrducts = res;
      this.filteredProducts = this.listPrducts;
    },
      (err: any) => { console.log('result of the product ====================>', err) })
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



}