// Import Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { HttpClientModule } from '@angular/common/http';
import {UserModule} from './user/user.module';
import {EdListModule} from './ed-list/ed-list.module'
import { RouterModule, Routes } from '@angular/router';
import {EdListService} from './ed-list.service';

import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
//Import components
import { AppComponent } from './app.component';

import { LoginComponent } from './user/login/login.component';
import { SortPipe } from './sort.pipe';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
// import { SocketService } from './socket.service';



@NgModule({
  declarations: [
    AppComponent,
    SortPipe,
    NotFoundComponent,
    ServerErrorComponent,

  
  ],
  imports: [
    BrowserModule,
    
    UserModule,
    EdListModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    
    Ng4LoadingSpinnerModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      {path:'404',component:NotFoundComponent},
      {path:'500',component:ServerErrorComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: LoginComponent },
      { path: '**', component: LoginComponent },
      

    ])
  ],
  providers: [EdListService,SortPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
