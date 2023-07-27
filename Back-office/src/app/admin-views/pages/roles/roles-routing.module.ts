import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRoleComponent } from './list-role/list-role.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [

  { path : '', component :ListRoleComponent}
];


@NgModule({
   imports: [RouterModule.forChild(routes),MaterialModule,FormsModule,ReactiveFormsModule,NgSelectModule],
  exports: [RouterModule, MaterialModule,FormsModule,ReactiveFormsModule,NgSelectModule]
})
export class RolesRoutingModule { }
