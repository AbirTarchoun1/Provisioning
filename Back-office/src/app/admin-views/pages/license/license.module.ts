import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicenseRoutingModule } from './license-routing.module';
import { AddLicenseComponent } from './add-license/add-license.component';
import { ListLicenseComponent } from './list-license/list-license.component';


@NgModule({
  declarations: [
    AddLicenseComponent,
    ListLicenseComponent
  ],
  imports: [
    CommonModule,
    LicenseRoutingModule
  ]
})
export class LicenseModule { }
