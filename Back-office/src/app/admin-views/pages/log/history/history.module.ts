import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutingModule } from './history-routing.module';
import { ListHistoryComponent } from './list-history/list-history.component';


@NgModule({
  declarations: [
    ListHistoryComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
