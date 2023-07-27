import { NgModule } from '@angular/core';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { ListLicenseComponent } from './list-license/list-license.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
const routes: Routes = [
  {
    path: '', component:ListLicenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MaterialModule, FormsModule,ReactiveFormsModule,MatDatepickerModule],
  exports: [RouterModule, MaterialModule,FormsModule,ReactiveFormsModule,
    MatDatepickerModule,]
})
export class LicenseRoutingModule { }
