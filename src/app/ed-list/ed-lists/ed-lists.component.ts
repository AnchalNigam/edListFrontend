import { Component, OnInit,ViewContainerRef ,OnDestroy,HostListener} from '@angular/core';
import { EdListService } from './../../ed-list.service';
import { SocketService } from './../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import * as shortid from 'shortid';


@Component({
  selector: 'app-ed-lists',
  templateUrl: './ed-lists.component.html',
  styleUrls: ['./ed-lists.component.css'],
 
  providers: [SocketService]
})
export class EdListsComponent implements OnInit {
 
  public authToken:any;
  public receiverId:any;
  public receiverName:string;
  public userInfo:any;
  public allUsersList:any=[];
  public finalAllUsersList:any=[];
  public disconnectedSocket: boolean;
  public allOnlineUsersList:any=[];
  public allFriendsList:any=[];
  public listOfFriends:any=[];
  public finalAllFriendsList:any=[];
  public dubFriendsList:any=[];    //this is for getting todolists of all friends
  public onlineFriendList:any=[];
  public allToDoList:any=[];
  public itemList:any=[];
  public pageValue:number=0;
  public itemText:any;
  public subItemText:any;
  public loadingPreviousItem:boolean;
  public selectedListId:any;
  public selectedListCreatorId:any;
  public scrollToChatTop:boolean=true;
  public editTime:boolean=false;
  public editSubItemTime:boolean=false;
  public subItemAddition:boolean=false;
  public itemId:any;
  public undoObj:any;

  public itemLists:any=[];

  constructor(public router: Router,private edListService:EdListService,public toastr: ToastsManager,vcr: ViewContainerRef,
    public SocketService: SocketService) 
    { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    
    this.authToken = Cookie.get('authtoken');
    this.receiverId = Cookie.get("receiverId");
    console.log(this.authToken)
    console.log(this.receiverId)
    this.receiverName =  Cookie.get('receiverName');
    
    this.userInfo = this.edListService.getUserInfoFromLocalstorage();
    

  if( Cookie.get('selectedListId')!=null && Cookie.get('selectedListId')!=undefined && Cookie.get('selectedListId')!=''){
    
    let data={'listId':Cookie.get('selectedListId'),
                'creatorId':Cookie.get('selectedListCreatorId')};
    this.listSelected(data);
  }


   
    this.getAllFriends();
   
    this.receiveFriendRequest();
    this.receiveFriendRequestApproval();
    this.getItems();
    this.deletedItems();
    this.updatedItems();
    this.editedItems();
    this.addedSubItems();
    this.deletedSubItems();
    this.updatedSubItems();
    this.editedSubItems();
    this.undoAddItem();
    this.undoDeleteItem();
    this.undoUpdateItem();
    this.undoAddSubItem();
    this.undoDeleteSubItem();
    this.undoUpdateSubItem();
    
  }//ng onit end
 
  
  //methid for user verification (socket.io)
  public verifyUserConfirmation: any = () => {
    this.SocketService.verifyUser().subscribe(
     (data) => {
       
       this.disconnectedSocket = false;
       let sendData={
         'authToken':this.authToken,
         'friendsList':this.dubFriendsList
       }
       this.SocketService.setUser(sendData);
       this.getOnlineUserList();
      
     });
}//end

//  Online user list methdlist start 
public getOnlineUserList :any =()=>{

  this.SocketService.onlineUserList().subscribe(
    userList=>{
      this.allOnlineUsersList=userList;
      console.log(this.allOnlineUsersList)
     
      for(let i of this.finalAllFriendsList){
        let flag=0;
        for(let j of this.allOnlineUsersList ){
            if(i.friendId==j.userId){
              flag=1;
              break;
            }
            
        }
        if(flag==1){
          i.status="Online";
         

        }
        else{
          i.status="offline"
        }
      }//end outer loop
      console.log(this.finalAllFriendsList);
    }
    
  )

}//end

//method to get all friends
public getAllFriends=()=>{
  //getting all friends of user
  this.edListService.getAllFriends(this.receiverId,this.authToken).subscribe(
    (Response)=>{
      if(Response.data!=null){
       this.allFriendsList=Response.data;
        
       for(let i of this.allFriendsList){
           if(i.reqSendId==this.receiverId){
            let temp={'friendId':i.reqRecId,'friendName':i.reqRecName,'status':'offline'};
            this.finalAllFriendsList.push(temp);
            this.dubFriendsList.push(i.reqRecId);
           }
           else{
            let temp={'friendId':i.reqSendId,'friendName':i.reqSendName,'status':'offline'};
            this.finalAllFriendsList.push(temp);
            this.dubFriendsList.push(i.reqSendId);
           }
          

       }//end for
       console.log(this.finalAllFriendsList)
       console.log(this.dubFriendsList)
      }
        this.verifyUserConfirmation();
        this.getAllUsers();
       
        this.getAllList();
       
    }
 )
//end getting all users friends


}//end

//method to get all users on the system
public getAllUsers=()=>{
  
  //getting all users on the system
  this.edListService.getAllUsers(this.authToken).subscribe(
    Response=>{
      if (Response.status === 200) {
        // this.finalAllUsersList=Response.data;
        this.allUsersList=Response.data;
        this.listOfFriends=this.dubFriendsList;
          this.listOfFriends=this.listOfFriends.filter((friend)=>{
            return friend!=this.receiverId;
          })
        
         
        if(this.listOfFriends.length>0){
        
          for(let j of this.allUsersList){
            let flag=0;
            for(let i of this.listOfFriends){
              if(i==j.userId){
                flag=1;
                break;
              }
            }

            if(flag==0 && j.userId!=this.receiverId){
              this.finalAllUsersList.push(j);
              
            }
        
          }
            
           console.log(this.finalAllUsersList);
        }
        else{
          this.finalAllUsersList=this.allUsersList;
        }
        
       
      }
      else{
        this.toastr.error(Response.message);
      }
     
    },
    error=>{
      this.toastr.error('Server Error Occured!');
    });
//end getting all users
   
}//end

//method to get all list
public getAllList=()=>{
  //gettinga ll todolists of all friends
    this.dubFriendsList.push(this.receiverId);
    this.edListService.getAllToDoList(this.dubFriendsList,this.authToken).subscribe(
      (Response)=>{
        
        if(Response.data.length!=0){
        this.allToDoList=Response.data;
        for(let i of this.allToDoList){
          i.active=false;
        }
        }
        console.log(this.allToDoList)
       
      },
      error=>{
        this.toastr.error('Some Server Error!')
      }
    )
    //end getting al todolist
 

}

//method to when list selected
public listSelected=(list)=>{
    console.log('click');
    this.allToDoList.map((val)=>{
       if(val.listId==list.listId){
          val.active=true;
       }
       else{

        val.active=false;
       }
    });//end map
    Cookie.set('selectedListId', list.listId);
    Cookie.set('selectedListCreatorId', list.creatorId);

    this.selectedListId = list.listId;
    this.selectedListCreatorId=Cookie.get('selectedListCreatorId');
   
  
    this.itemList = [];
  
    this.pageValue = 0;
    this.getPreviousItems();       

}//end

//methid to send message using enter
public sendItemUsingKeypress: any = (event: any) => {
 
  if (event.keyCode === 13) { // 13 is keycode of enter.
    if(this.editTime==true){
      this.sendEditItem();
    }
    else if(this.subItemAddition==true){
      this.sendSubItem();
    }
    else if(this.editSubItemTime==true){
      this.sendEditSubItem();
    }
    else{
      this.sendItem();
    }
    

  }

} // end sendMessageUsingKeypress

//Method to send message
public sendItem: any = () => {

  if(this.itemText){

    let itemObject = {
      itemId:shortid.generate(),
      adder: this.userInfo.firstName + " " + this.userInfo.lastName,
      adderId: this.userInfo.userId,
      creatorId:this.selectedListCreatorId,
      listId:this.selectedListId,
      itemName: this.itemText,
      status:0,
      createdOn: new Date(),
      modifiedOn: new Date()
     
    } // end itemObject
   console.log(`item object : ${itemObject}`);
    this.SocketService.SendItems(itemObject);
    this.pushToItemWindow(itemObject);
      
    

  }
  else{
    this.toastr.warning('Text message can not be empty')

  }

} // end sendMessage

//Method to push your chats to chat window
public pushToItemWindow : any =(data)=>{

  this.itemText="";
 
  
  this.itemList.unshift(data);
  this.scrollToChatTop = true;


}// end push to chat window


//Method to send editmessage
public sendEditItem: any = () => {
   let item:any=JSON.parse(Cookie.get('editItem'));

  if(this.itemText){

    this.itemList.map((val)=>{
       if(val.itemId==item.itemId){
         val.itemName=this.itemText;
         val.modifiedOn=new Date();
       }
    });//end

    let editData={
      'itemList':this.itemList,
      'creatorId':this.selectedListCreatorId,
      'editorName':this.userInfo.firstName + " " + this.userInfo.lastName,
      'beforeEditItem':item
  
    }//end deletedData
    
  
    this.SocketService.editItems(editData);
    this.pushToEditItemWindow(editData);
      
    

  }
  else{
    this.toastr.warning('Text message can not be empty')

  }

} // end sendMessage

//Method to push your chats to chat window
public pushToEditItemWindow : any =(data)=>{

  this.itemText="";
 
  this.itemList=data.itemList;
 Cookie.delete('editItem');
 this.editTime=false;
  this.scrollToChatTop = false;


}// end push to chat window


//method to add subitem
public sendSubItem=()=>{
  let itemId=Cookie.get('itemId');
  console.log(this.subItemText)
  let subItemObj={
     'subItemId':shortid.generate(),
     'itemId':itemId,
     'listId':this.selectedListId,
     'subItemName':this.subItemText,
     'adder':this.userInfo.firstName + " " + this.userInfo.lastName,
     'adderId': this.userInfo.userId,
     'createdOn':new Date(),
     'modifiedOn': new Date(),
     'status':0

  }//end subitem obj
  this.itemList.map((val)=>{
    if(val.itemId==itemId){
      if(val.hasOwnProperty('subItems')){
        val.subItems.unshift(subItemObj)
      }
      else{
        val.subItems=[];
        val.subItems.unshift(subItemObj);
      }
    }

  })//end map
  let sendSubItemObj={
    itemList:this.itemList,
    creatorId:this.selectedListCreatorId,
    subItemObj:subItemObj
  }//end
  this.SocketService.sendSubItem(sendSubItemObj);
 this.SubItemWindow();
 
  
}//end 

//method to push to subitem wincdw and send to otther friends
public SubItemWindow=()=>{

  
  this.subItemAddition=false;
  this.subItemText="";
  Cookie.delete('itemId');
  

}//end

//Method to send editmessage
public sendEditSubItem: any = () => {
 

 if(this.itemText){
  let editData:any=JSON.parse(Cookie.get('editSubItem'));
   
   for(let i of this.itemList){
     if(editData.itemId==i.itemId){
      i.subItems.map((subbItem)=>{
       if(subbItem.subItemId==editData.subItemId){
         subbItem.subItemName=this.itemText;
         subbItem.modifiedOn=new Date()
       }

      });

     }
} 

 let editedData={
     'itemList':this.itemList,
     'creatorId':this.selectedListCreatorId,
     'editorName':this.userInfo.firstName + " " + this.userInfo.lastName,
     'beforeEditItem':editData
 
   }//end editedData
   
 
   this.SocketService.editSubItems(editedData);
   this.pushToEditSubItemWindow(editedData);
     
   

 }
 else{
   this.toastr.warning('Text message can not be empty')

 }

} // end sendMessage



//Method to push your chats to chat window
public pushToEditSubItemWindow : any =(data)=>{

  this.itemText="";
 
  this.itemList=data.itemList;
 Cookie.delete('editSubItem');
 this.editSubItemTime=false;
  

}// end push to chat window


//Method to get items
public getItems :any =()=>{
 
  this.SocketService.getItemsByFriends()
  .subscribe((data)=>{
    
    (this.selectedListId==data.listId)?this.itemList.unshift(data) : '';
    if(data.operationName=="add"){
      this.toastr.success(`${data.adder} added : ${data.itemName}`)
    }
    else{
      this.toastr.success(`${data.adder} edited : ${data.itemName}`)
    }
    
    this.scrollToChatTop=true;
  
  });//end subscribe

}// end get items 

//Method to get subitems
public addedSubItems :any =()=>{
 
  this.SocketService.listenAddedSubItems()
  .subscribe((data)=>{
    this.itemList=data.itemList;
    this.toastr.success(`${data.subItemObj.adder} added subitem called ${data.subItemObj.subItemName}`);
  
  });//end subscribe

}// end get items 

//methid to get previous items
public getPreviousItems=()=>{
  let previousData = (this.itemList.length > 0 ? this.itemList.slice() : []);
  this.edListService.getItems(this.selectedListId, this.pageValue * 4)
  .subscribe((apiResponse) => {


    if (apiResponse.status == 200) {
      console.log(apiResponse.data);
      this.itemList = previousData.concat(apiResponse.data);

    } else {

      this.itemList = previousData;
      this.toastr.warning('No Messages available')

     

    }

    this.loadingPreviousItem = false;

  }, (err) => {

    this.toastr.error('some error occured')


  });

}//end

//method to load previous items
public loadEarlierPageOfItem: any = () => {

  this.loadingPreviousItem = true;

  this.pageValue++;
  this.scrollToChatTop = false;

  this.getPreviousItems() 

} // end 

//method to delete item
public deleteItem=(item)=>{
   this.itemList=this.itemList.filter((val)=>{
      return val.itemId!=item.itemId;
   
   });
  let deleteData={
    'itemList':this.itemList,
    'creatorId':this.selectedListCreatorId,
    'deletorName':this.userInfo.firstName + " " + this.userInfo.lastName,
    'deletedItem':item

  }//end deletedData
  console.log(deleteData);
  this.SocketService.itemDeletion(deleteData)
   
}//end

//method to delete subitem
public deleteSubItem=(subItem,itemId)=>{
  console.log('clicked delete')
 
  this.itemList=this.itemList.filter((item)=>{
    if(item.itemId==itemId){
      item.subItems=item.subItems.filter((subbItem)=>{
         return subbItem.subItemId!=subItem.subItemId;
      })
      if(item.subItems.length!=0){
        return item;
      }
      else{
        delete item.subItems;
        return item;
      }
    
    }
    else{
      return item;
    }

  })//end

  let deleteSubItem={
     'itemList':this.itemList,
     'creatorId':this.selectedListCreatorId,
     'deletorName':this.userInfo.firstName + " " + this.userInfo.lastName,
     'deletedSubItem':subItem
  }

  this.SocketService.subItemDeletion(deleteSubItem)
  
}//end

//method to update item
public updateItem=(item)=>{
  
  this.itemList.map((val)=>{
    if(val.itemId==item.itemId){
      val.status=1;
      val.modifiedOn=new Date();
      
    }
   
  });
 
 let updateData={
   'itemList':this.itemList,
   'creatorId':this.selectedListCreatorId,
   'updatorName':this.userInfo.firstName + " " + this.userInfo.lastName,
   'beforeUpdateItem':item

 }//end updateData
 
 this.SocketService.itemUpdation(updateData)
  
}//end

//method to update subitem
public updateSubItem=(subItem,itemId)=>{
  
  for(let i of this.itemList){
    if(i.itemId==itemId){
       i.subItems.map((subbItem)=>{
         if(subbItem.subItemId==subItem.subItemId){
            subbItem.status=1;
            subbItem.modifiedOn=new Date();
         }
       })

    }
  }

 let updateSubItemData={
   'itemList':this.itemList,
   'creatorId':this.selectedListCreatorId,
   'updatorName':this.userInfo.firstName + " " + this.userInfo.lastName,
   'beforeUpdateItem':subItem

 }//end updateData
 
 this.SocketService.subItemUpdation(updateSubItemData)
  
}//end

//method to edit item
public editItem=(item)=>{
  console.log('edited')
  this.editTime=true;
  this.itemText=item.itemName;
 
  Cookie.set('editItem',JSON.stringify(item));
  


}//end

//method to edit subitem
public editSubItem=(subItem,itemId)=>{
  console.log('edited subitem')
  this.editSubItemTime=true;
  this.itemText=subItem.subItemName;
  
  Cookie.set('editSubItem',JSON.stringify(subItem));
  


}//end


//method to listen deleted items
public deletedItems=()=>{
   this.SocketService.listenDeletedItems().subscribe(
    (data)=>{
      this.itemList=data.itemList;
     
      this.toastr.warning(`${data.deletorName} deleted ${data.deletedItem.itemName}`)
    }
   )
}//end

//method to listen deleted subitems
public deletedSubItems=()=>{
  this.SocketService.listenDeletedSubItems().subscribe(
   (data)=>{
     this.itemList=data.itemList;
    
     this.toastr.warning(`${data.deletorName} deleted subitem called ${data.deletedSubItem.subItemName}`)
   }
  )
}//end

//method to listen updated items
public updatedItems=()=>{
  this.SocketService.listenUpdatedItems().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.success(`${data.updatorName} updated ${data.beforeUpdateItem.itemName}`)
   }
  )
}//end

//method to listen updated subitems
public updatedSubItems=()=>{
  this.SocketService.listenUpdatedSubItems().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.success(`${data.updatorName} updated subitem called ${data.beforeUpdateItem.subItemName}`)
   }
  )
}//end

//method to listen edited items
public editedItems=()=>{
  this.SocketService.listenEditedItems().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.editorName} edited ${data.beforeEditItem.itemName}`)
   }
  )
}//end

//method to listen edited items
public editedSubItems=()=>{
  this.SocketService.listenEditedSubItems().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.editorName} edited subitem called ${data.beforeEditItem.subItemName}`)
   }
  )
}//end

//method to check whether the subitems are there are not
public checkSubitem=(item):boolean=>{
    if(item.hasOwnProperty('subItems'))
  {
    return true;
  }
  else{
    return false;
  }
}//end

//method to add subitem
public addSubItem=(itemId)=>{
  this.subItemAddition=true;
  Cookie.set('itemId',itemId);
  this.itemId=Cookie.get('itemId');
 
}//end

//method to do undo using keyboard
@HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(event.ctrlKey && event.key=='z' || event.metaKey && event.key=='z'){
      // console.log(event);
      if(this.selectedListId){
        this.undoList(this.selectedListId);
      }
     
    }
    
  }//end


//method to undo my list 
public undoList=(selectedListId)=>{
  this.edListService.undoListItems(selectedListId).subscribe(
    (Response)=>{
      if(Response.status===200){
        this.undoObj=Response.data;
        if(this.undoObj.hasOwnProperty('itemName')){
          if(this.undoObj.operationName=="add"){
            this.itemList=this.itemList.filter((item)=>{
                  return item.itemId!=this.undoObj.itemId;
            });

            let sendUndoData={
              'itemList':this.itemList,
              'creatorId':this.selectedListCreatorId,
              'undoPerson':this.userInfo.firstName + " " + this.userInfo.lastName,
               'undoData':this.undoObj
            }//end send undo data

            this.SocketService.undoItemAddOperation(sendUndoData);

          }//end operation 'add'
         
          if(this.undoObj.operationName=="delete"){
          
            this.itemList.unshift(this.undoObj);
             let sendUndoData={
              'itemList':this.itemList,
              'creatorId':this.selectedListCreatorId,
              'undoPerson':this.userInfo.firstName + " " + this.userInfo.lastName,
               'undoData':this.undoObj
            }//end send undo data

            this.SocketService.undoItemDeleteOperation(sendUndoData);


          }  //end delete operation
          
          if(this.undoObj.operationName=="update"){
            this.itemList.map((item)=>{
              if(item.itemId==this.undoObj.itemId){
                  item.itemName=this.undoObj.itemName;
                  item.status=this.undoObj.status;
                  item.modifiedOn=this.undoObj.modifiedOn;
              }

            });//end map
            
            let sendUndoData={
              'itemList':this.itemList,
              'creatorId':this.selectedListCreatorId,
              'undoPerson':this.userInfo.firstName + " " + this.userInfo.lastName,
               'undoData':this.undoObj
            }//end send undo data


            this.SocketService.undoItemUpdateOperation(sendUndoData);
          

          }//end update operation


        }//end item undo

        else if(this.undoObj.hasOwnProperty('subItemName')){
          if(this.undoObj.operationName=="add"){
            this.itemList=this.itemList.filter((item)=>{
              if(item.itemId==this.undoObj.itemId){
                item.subItems=item.subItems.filter((subbItem)=>{
                   return subbItem.subItemId!=this.undoObj.subItemId;
                })
                if(item.subItems.length!=0){
                  return item;
                }
                else{
                  delete item.subItems;
                  return item;
                }
              
              }
              else{
                return item;
              }
          
            })//end

           
            let sendUndoData={
              'itemList':this.itemList,
              'creatorId':this.selectedListCreatorId,
              'undoPerson':this.userInfo.firstName + " " + this.userInfo.lastName,
              'undoData':this.undoObj
            }//end send undo data

            this.SocketService.undoSubItemAddOperation(sendUndoData);

          }//end operation 'add'
           
          if(this.undoObj.operationName=="delete"){
          
            this.itemList.map((val)=>{
              if(val.itemId==this.undoObj.itemId){
                if(val.hasOwnProperty('subItems')){
                  val.subItems.unshift(this.undoObj)
                }
                else{
                  val.subItems=[];
                  val.subItems.unshift(this.undoObj);
                }
              }
          
            })//end map

             let sendUndoData={
              'itemList':this.itemList,
              'creatorId':this.selectedListCreatorId,
              'undoPerson':this.userInfo.firstName + " " + this.userInfo.lastName,
               'undoData':this.undoObj
            }//end send undo data
          
            this.SocketService.undoSubItemDeleteOperation(sendUndoData);


          }  //end delete operation

          if(this.undoObj.operationName=="update"){

            for(let i of this.itemList){
              if(i.itemId==this.undoObj.itemId){
                 i.subItems.map((subbItem)=>{
                   if(subbItem.subItemId==this.undoObj.subItemId){
                      subbItem.status=this.undoObj.status;
                      subbItem.subItemName=this.undoObj.subItemName;
                      subbItem.modifiedOn=new Date();
                   }
                 })
          
              }
            }
           
            
            let sendUndoData={
              'itemList':this.itemList,
              'creatorId':this.selectedListCreatorId,
              'undoPerson':this.userInfo.firstName + " " + this.userInfo.lastName,
               'undoData':this.undoObj
            }//end send undo data


            this.SocketService.undoSubItemUpdateOperation(sendUndoData);
          

          }//end update operation



        }
          
      }
      else{
        this.toastr.warning('No undo items found!');
      }

    },
    error=>{
      this.toastr.error('Some Server error occured!');

    }
  )
}//end

//method to listen added items undo
public undoAddItem=()=>{
  this.SocketService.listenUndoItemAddOperation().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.undoPerson} undo ${data.undoData.itemName}`)
   }
  )
}//end

//method to listen added subitems undo
public undoAddSubItem=()=>{
  this.SocketService.listenUndoSubItemAddOperation().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.undoPerson} undo ${data.undoData.subItemName}`)
   }
  )
}//end

//method to listen deletedd items undo
public undoDeleteItem=()=>{
  this.SocketService.listenUndoItemDeleteOperation().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.undoPerson} undo ${data.undoData.itemName}`)
   }
  )
}//end

//method to listen deletedd subitems undo
public undoDeleteSubItem=()=>{
  this.SocketService.listenUndoSubItemDeleteOperation().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.undoPerson} undo ${data.undoData.subItemName}`)
   }
  )
}//end

//method to listen updated items undo
public undoUpdateItem=()=>{
  this.SocketService.listenUndoItemUpdateOperation().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.undoPerson} undo ${data.undoData.itemName}`)
   }
  )
}//end

//method to listen updated subitems undo
public undoUpdateSubItem=()=>{
  this.SocketService.listenUndoSubItemUpdateOperation().subscribe(
   (data)=>{
     this.itemList=data.itemList;
   
     this.toastr.warning(`${data.undoPerson} undo ${data.undoData.subItemName}`)
   }
  )
}//end


//method to send friend reuest
public sendFriendRequest=(reqSendData:any)=>{
   if(typeof(reqSendData)=="string"){
     this.toastr.warning(reqSendData);
     setTimeout(()=>{
      this.router.navigate(['/friends']);
     
    },1000)
   }
   else{
    this.SocketService.sendFriendRequest(reqSendData);
    this.toastr.success(`Request Successfully sent to ${reqSendData.reqRecName}`);
   
   }
 
  
}//end

//method to receive friend Request
public receiveFriendRequest=()=>{
  
  this.SocketService.receiveRequests(this.receiverId)
  .subscribe((reqReceived)=>{
       if(reqReceived.reqSendId!=this.receiverId){
      
      this.toastr.success(`${reqReceived.reqSendName} Sends a Friend Request`);
      
       }
    
        
     });
}//end

//method to approve recve friend request
public receiveFriendRequestApproval=()=>{
  this.SocketService.sendRequestsApproval(this.receiverId)
  .subscribe((reqReceivedApproval)=>{
    if(reqReceivedApproval.reqSendId==this.receiverId){
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
        Cookie.delete('selectedListId');

        Cookie.delete('receiverName');
        Cookie.delete('selectedListCreatorId');
 
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
  console.log('destroy and leave edlist');
}


}
