import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListHistoryComponent } from './list-history/list-history.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {path: '', component:ListHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes),MaterialModule,FormsModule,ReactiveFormsModule],
  exports: [RouterModule,MaterialModule,FormsModule,ReactiveFormsModule]
})
export class HistoryRoutingModule { }
