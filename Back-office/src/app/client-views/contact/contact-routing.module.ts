import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContactComponent } from './add-contact/add-contact.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';

const routes: Routes = [
  {path : '',component : AddContactComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes), CKEditorModule ,MaterialModule,FormsModule,ReactiveFormsModule,NgSelectModule],
  exports: [RouterModule,CKEditorModule ,MaterialModule,FormsModule,ReactiveFormsModule,NgSelectModule]
})
export class ContactRoutingModule { }
