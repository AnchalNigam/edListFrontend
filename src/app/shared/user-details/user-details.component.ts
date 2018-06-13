import { Component, OnInit,Input,ViewContainerRef,OnDestroy,Output,EventEmitter} from '@angular/core';
import { SocketService } from './../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { EdListService } from './../../ed-list.service';
import { Router } from '@angular/router';
@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() designPart:string; //this is basically for managing different designs like todolist design,allusers design..
  @Input() creator?:string;
  @Input() userStatus?:string;
  @Input() ReqStatus?:string;
  @Input() sendRequestData?:any;
  @Input() requestData?:any;
  @Output() friendRequestSend = new EventEmitter();
  @Output() friendRequestRec = new EventEmitter();

  public firstChar :string;
  public reqSendId:any;
  public reqSendName:string;
  public authToken:any;
  constructor(public router: Router,vcr: ViewContainerRef,
    public SocketService: SocketService,private edListService:EdListService) { 
     
    }

  ngOnInit() {
   
    this.firstChar = this.firstName[0];
    this.reqSendId = Cookie.get("receiverId");
    this.authToken = Cookie.get('authtoken');
    this.reqSendName =  Cookie.get('receiverName');
  }

  //method to send friend request
  public sendFriendRequest=()=>{
    let fullName=`${this.sendRequestData.firstName} ${this.sendRequestData.lastName}`;
    let reqSendData={
      'reqSendId': this.reqSendId,
      'reqSendName':this.reqSendName,
      'reqRecId' :this.sendRequestData.userId,
      'reqRecName':fullName

    }
    console.log(reqSendData)
    this.edListService.getAllRequests(this.authToken).subscribe(
      (Response)=>{
       
           console.log('yes');
           if(Response.data!=null){
             var flag=0;
           for(let i of Response.data){
             if(i.reqSendId==this.reqSendId && i.reqRecId==this.sendRequestData.userId
                || i.reqSendId==this.sendRequestData.userId && i.reqRecId==this.reqSendId){
                flag=1;
                break;
             }
           }//end for
           if(flag==0){
             console.log(flag);
             console.log('user-details-emit part')
            this.friendRequestSend.emit(reqSendData);
           }
           else{
            this.friendRequestSend.emit('This Friend Request is already performed!');

           }
        
           }
           else{
             console.log(reqSendData);
            this.friendRequestSend.emit(reqSendData);
           }
        
          
      })
  
  }//end

  //method to get sendRequest
  public checkSendRequests=()=>{
    
  }//end
  //method to receive friend request
  public recFriendRequest=()=>{
  this.friendRequestRec.emit(this.requestData);


  }//end
  

  

}
