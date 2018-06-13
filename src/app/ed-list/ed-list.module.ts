import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { SocketService } from './../socket.service';
//iport component
import { EdListsComponent } from './ed-lists/ed-lists.component';
import { EdListManageComponent } from './ed-list-manage/ed-list-manage.component';

import {SharedModule} from '../shared/shared.module';
import { FriendsComponent } from './friends/friends.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path:'EdLists',component:EdListsComponent},
      {path:'EdList-manage/:operationName',component:EdListManageComponent},
      {path:'friends',component:FriendsComponent}
    ])
  ],
  declarations: [EdListsComponent, EdListManageComponent, FriendsComponent],
  // providers: [SocketService]
})
export class EdListModule { }
