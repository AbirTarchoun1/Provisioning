import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductComponent } from './list-product/list-product.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [

  { path : '', component :ListProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes), CKEditorModule ,MaterialModule,FormsModule,ReactiveFormsModule,NgSelectModule],
  exports: [RouterModule,CKEditorModule ,MaterialModule,FormsModule,ReactiveFormsModule,NgSelectModule]
})
export class ProductRoutingModule { }
