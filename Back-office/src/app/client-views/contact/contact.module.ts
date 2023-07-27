import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';
import { AddContactComponent } from './add-contact/add-contact.component';


@NgModule({
  declarations: [
    AddContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule
  ]
})
export class ContactModule {  
 
} 
