import { Component, OnInit, ViewContainerRef  } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { EdListService } from './../../ed-list.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password:any;
  public confirmpassword:any;
  constructor(private _route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService,
    public edListService:EdListService, public router: Router, private toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
     }

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  // //method to reset password
  public resetPassword = () => {
    let encodedEmail = this._route.snapshot.paramMap.get('id');
    let decodedEmail = atob(encodedEmail);
    let finalEmail = decodedEmail.substr(0, decodedEmail.length - 17); //here 17 is length of mmy seccretkey
   
      console.log(finalEmail)
      let data = {
        "email": finalEmail,
        "password": this.password
      }
      this.spinnerService.show();
      this.edListService.resetPassword(data).subscribe(
        Response => {
          if (Response.status === 200) {
           
              this.spinnerService.hide();
              this.toastr.success(Response.message);
           
            
            setTimeout(() => {

              this.router.navigate(['/']);
  
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


  

  }//end reset password
}
