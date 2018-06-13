import { Component, OnInit ,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { EdListService } from './../../ed-list.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:any;
  public password:any;
  public emailNeed: number = 1; //this is when user clicks on forgotpassword without giving email
  
  constructor(public router: Router,private edListService:EdListService,private spinnerService: Ng4LoadingSpinnerService,
    public toastr: ToastsManager,vcr: ViewContainerRef) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/signup']);

  } // end goToSignUp

  //method to login
  public logInFunction = (): any => {
    let data = {
      'email': this.email,
      'password': this.password
    }
    this.spinnerService.show();
    this.edListService.logIn(data).subscribe(
      Response => {
        if (Response.status === 200) {
          Cookie.set('authtoken', Response.data.authToken);

          Cookie.set('receiverId', Response.data.userDetails.userId);

          Cookie.set('receiverName', Response.data.userDetails.firstName + ' ' + Response.data.userDetails.lastName);

          this.edListService.setUserInfoInLocalStorage(Response.data.userDetails)
          
          setTimeout(()=>{
            this.spinnerService.hide();
            this.router.navigate(['/EdLists']);
          },1000)
         

        }
        else if(Response.status==404){
          setTimeout(() => {
            this.spinnerService.hide();
            this.router.navigate(['/404']);

          },1000);
         
        }
        else if(Response.status==500){
          setTimeout(()=>{
            this.spinnerService.hide();
            this.router.navigate(['/500']);
          },1000)
          
        }
        else{
          setTimeout(()=>{
            this.spinnerService.hide();
            this.toastr.error(Response.message);
          },1000);
         
        }
       
      },
      (err) => {
        setTimeout(()=>{
          this.spinnerService.hide();
          this.toastr.error('Server Error Occured!');
        },1000)
       
       
      });
  }//end

  //method of forgot password
  public forgotPassword = (email): any => {
    if (email == undefined) {
      this.emailNeed = 0;
    }
    else {
      console.log(email);
      this.spinnerService.show();
      this.edListService.forgotPassword(email).subscribe(
        Response => {
          if (Response.status === 200) {

            this.spinnerService.hide();
            this.toastr.success('Mail has been sent.Check for further process!');
            
            setTimeout(() => {

              this.router.navigate(['/login']);
  
            }, 2000);
          }
          else if(Response.status==404){
            setTimeout(() => {
              this.spinnerService.hide();
              this.router.navigate(['/404']);

            },1000);
           
          }
          else if(Response.status==500){
            setTimeout(()=>{
              this.spinnerService.hide();
              this.router.navigate(['/500']);
            },1000)
            
          }
          else {
            this.spinnerService.hide();
            this.toastr.error(Response.message);
            
          }

        },
        error => {
          this.spinnerService.hide();
          this.toastr.error(`Some Error Occured!`);
         

        });
    }
  }//end 

}
