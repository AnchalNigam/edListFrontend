import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { EdListService } from './../../ed-list.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ed-list-manage',
  templateUrl: './ed-list-manage.component.html',
  styleUrls: ['./ed-list-manage.component.css']
})
export class EdListManageComponent implements OnInit {
   public userName:string;
   public userId:string;
   public listName:string;
   public authToken:string;

  constructor(public router: Router,private edListService:EdListService,
    public toastr: ToastsManager,vcr: ViewContainerRef,private spinnerService: Ng4LoadingSpinnerService) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.authToken = Cookie.get('authtoken');
    this.userName =  Cookie.get('receiverName');
    this.userId = Cookie.get("receiverId");
  }

  //method to ccreate to-do-list
  public createList=()=>{
    let data={
      'listName':this.listName,
      'creator':this.userName,
      'creatorId':this.userId
    }//end data
    this.spinnerService.show()
    this.edListService.createTodoList(data,this.authToken).subscribe(
      Response=>{
        if(Response.status===200){
          this.spinnerService.hide();
          this.toastr.success('Successfully List Created!')
          setTimeout(()=>{
             this.router.navigate(['/EdLists']);
          },2000)
        }
        else{
          this.toastr.error(Response.message);
        }
      },
      error=>{
        this.toastr.error('Some Error Occured!');
      }
    )
  }
}
