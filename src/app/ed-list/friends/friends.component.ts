import { Component, OnInit ,ViewContainerRef,OnDestroy} from '@angular/core';
import { EdListService } from './../../ed-list.service';
import { SocketService } from './../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
  providers: [SocketService]
 
})
export class FriendsComponent implements OnInit {
  public getSendReqList:any=[];
  public getRecReqList:any=[];
  public userId:any;
  public authToken:any;
  public userName:string;
  public allFriendsList:any=[];
  public dubFriendsList:any=[];
  public allOnlineUsersList:any=[];
  constructor(public router: Router,private edListService:EdListService,public toastr: ToastsManager,vcr: ViewContainerRef,
    public SocketService: SocketService) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.authToken = Cookie.get('authtoken');
    this.userId = Cookie.get("receiverId");
    this.userName =  Cookie.get('receiverName');
  
   this.getAllFriends();
   
   this.sendRequests();
   this.receiveRequests();
   this.receiveFriendRequestApproval();
  }//end ngonit 

  //method to get all friends
public getAllFriends=()=>{
  //getting all friends of user
  this.edListService.getAllFriends(this.userId,this.authToken).subscribe(
    (Response)=>{
      if(Response.data!=null){
       this.allFriendsList=Response.data;
        
       for(let i of this.allFriendsList){
           if(i.reqSendId==this.userId){
           
            this.dubFriendsList.push(i.reqRecId);
           }
           else{
           
            this.dubFriendsList.push(i.reqSendId);
           }
          

       }//end for
    
       console.log(this.dubFriendsList)
      }
        this.verifyUserConfirmation();
      
       
    }
 )
//end getting all users friends


}//end

//methid for user verification (socket.io)
public verifyUserConfirmation: any = () => {
  this.SocketService.verifyUser().subscribe(
   (data) => {
     
   
     let sendData={
       'authToken':this.authToken,
       'friendsList':this.dubFriendsList
     }
     console.log('setting user')
     this.SocketService.setUser(sendData);
     this.getOnlineUserList();
    
   });
}//end

//  Online user list methdlist start 
public getOnlineUserList :any =()=>{

  this.SocketService.onlineUserList().subscribe(
    userList=>{
      this.allOnlineUsersList=userList;
      console.log(this.allOnlineUsersList);
     
    });

}//end

  //method to get sendRequest
  public sendRequests=()=>{
    this.edListService.getSendReqList(this.userId,this.authToken).subscribe(
      (Response)=>{
         if(Response.status===200){
           if(Response.data!=null){
         this.getSendReqList=Response.data;
         console.log(this.getSendReqList);
           }
         }
        
      },
      error=>{
        this.toastr.error('Some Server Error Occured!')
      }

   )
  }//end

  //method to get received requests
  public receiveRequests=()=>{
    this.edListService.getRecReqList(this.userId,this.authToken).subscribe(
      (Response)=>{
        if(Response.status===200){
          if(Response.data!=null){
        this.getRecReqList=Response.data;
        console.log(this.getRecReqList);
          }
        }
        
      },
      error=>{
        this.toastr.error('Some Server Error Occured!')
      }

   )
  }//end

  //method to recve friend request approvall
  public recFriendRequest=(reqRecData:any)=>{
      this.SocketService.recFriendRequestApproval(reqRecData);
      this.toastr.success(`You have successfully accept a friend request of ${reqRecData.reqSendName}`);
  }//end

  //method to approve recve friend request
  public receiveFriendRequestApproval=()=>{
    this.SocketService.sendRequestsApproval(this.userId)
    .subscribe((reqReceivedApproval)=>{
      if(reqReceivedApproval.reqSendId==this.userId){
        this.toastr.success(`${reqReceivedApproval.reqRecName} Accepts a Friend Request`);
        }
   
        
     });
  }//end

  public logout: any = () => {

    this.edListService.logout()
      .subscribe((apiResponse) => {
  
        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authtoken');
  
          Cookie.delete('receiverId');
  
          Cookie.delete('receiverName');
  
          this.SocketService.exitSocket(this.dubFriendsList);
  
          this.router.navigate(['/']);
  
        } else {
          this.toastr.error(apiResponse.message)
  
        } // end condition
  
      }, (err) => {
        this.toastr.error('some error occured')
  
  
      });
  
  } // end logout

  ngOnDestroy(){
    this.SocketService.exitSocket(this.dubFriendsList);
  }
  
}
