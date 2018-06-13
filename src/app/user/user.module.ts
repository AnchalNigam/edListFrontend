import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Import components
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent},
      {path:'verify/:hash' ,component: VerifyEmailComponent},
      {path:'reset/:id',component:ResetPasswordComponent},
      
    ])
  ],
  declarations: [LoginComponent, SignupComponent, VerifyEmailComponent, ResetPasswordComponent]
})
export class UserModule { }
