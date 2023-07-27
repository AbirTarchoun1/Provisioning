import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { AddRoleComponent } from './add-role/add-role.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';


@NgModule({
  declarations: [
    AddRoleComponent,
    ListRoleComponent, 
   EditRoleComponent 
  ],
  imports: [
    CommonModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
