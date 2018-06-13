import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { EdListService } from './../../ed-list.service';
import { SortPipe } from '../../sort.pipe';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public mobile: number;
  public email: any;
  public password: any;
  public confirmPassword:any;
  public countryName:any="";
  public countryList:any;
  public finalCountryList:any=[];
  public codeList:any=[];
  public code:any;
  
  
  constructor( private spinnerService: Ng4LoadingSpinnerService,private edListService:EdListService,private router:Router,public sort:SortPipe,public toastr: ToastsManager,
     vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
      }

  ngOnInit() {
    this.edListService.getCountryList().subscribe(
      Response=>{
         this.countryList=Response;
         for (var prop in this.countryList) {
          this.finalCountryList.push({
            'key': prop,
            'value': this.countryList[prop]
        });

         }
        this.finalCountryList=this.sort.transform(this.finalCountryList);
       
      }
    )
  }

  //Method to go to login page
 public goToLogin=()=>{
    this.router.navigate(['/']);
 }//end

 //method to detect change on select box to update code in mobile number input area
 public onChange=()=>{
   
  this.edListService.getCountryCode().subscribe(
    Response=>{
      this.codeList=Response;
     
      this.code=this.codeList[this.countryName];

    }
  )
 }//end

 //Method to signup
 public signUpFunction=()=>{
   let data={
     "firstName":this.firstName,
     "lastName":this.lastName,
     "email":this.email,
     "password":this.password,
     "mobile":`+${this.code}-${this.mobile}`,
     "country":this.countryName     //here country code is sending
   }//end data
   
   this.spinnerService.show();
 
   this.edListService.signup(data).subscribe(
     Response=>{
      if (Response.status === 200) {
        this.spinnerService.hide();
        this.toastr.success('Signup Successful! Confirm your Email to proceed further.');
        setTimeout(() => {

          this.goToLogin();

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
      else{
        this.spinnerService.hide();
        this.toastr.error(Response.message);

      }


     },
     error=>{
       this.spinnerService.hide();
      this.toastr.error('Server error occured');

     }

   )
  
 }//end
}
