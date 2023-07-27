import { NgModule } from '@angular/core';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LogComponent } from './log.component';
const routes: Routes = [
  {
    path: '', component:LogComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LogRoutingModule { }
