import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
@Injectable()
export class SocketService {
  private url = 'http://edlistapi.webdeveloperjourney.xyz';

  private socket;

  constructor(public http: HttpClient) { 
    this.socket = io.connect(this.url,{ 'force new connection': true });

  }

   //method to listen to verify user event
   public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      }); //end socket
    });//end observable

  }//end verify user event

  //emit event
public setUser=(sendData)=>{
  this.socket.emit('setUser',sendData);
}//end of this event

//method to listen online user list
public onlineUserList = () => {

  return Observable.create((observer) => {

    this.socket.on("online-user-list", (userList) => {

      observer.next(userList);

    }); // end Socket

  }); // end Observable

} // end onlineUserList

//item sending
public SendItems = (itemObject) => {

  this.socket.emit('add-item', itemObject);

} // end SendChatMessage

//item sending
public sendSubItem = (subItemObj) => {

  this.socket.emit('add-sub-item', subItemObj);

} // end SendChatMessage

//getItems
public getItemsByFriends= () => {

  return Observable.create((observer) => {
    
    this.socket.on('added-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable

} // end getItems

//method to listen addedsubitems
public listenAddedSubItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('added-sub-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to emit deletion action
public itemDeletion=(deleteData)=>{
  this.socket.emit('delete-item',deleteData);

}//end

//method to listen deletedItems
public listenDeletedItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('deleted-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to emit subitemdeletion action
public subItemDeletion=(deleteSubItem)=>{
  this.socket.emit('delete-sub-item',deleteSubItem);

}//end

//method to listen deleted subItems
public listenDeletedSubItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('deleted-sub-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to emit updation action
public itemUpdation=(updateData)=>{
  this.socket.emit('update-item',updateData);

}//end

//method to listen updatedItems
public listenUpdatedItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('updated-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to emit updation action
public subItemUpdation=(updateSubItem)=>{
  this.socket.emit('update-sub-item',updateSubItem);

}//end

//method to listen updatedsubItems
public listenUpdatedSubItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('updated-sub-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to emit edit action
public editItems=(editData)=>{
  this.socket.emit('edit-item',editData);

}//end

//method to listen editedItems
public listenEditedItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('edited-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to emit edit subitem action
public editSubItems=(editData)=>{
  this.socket.emit('edit-sub-item',editData);

}//end

//method to listen editedsubItems
public listenEditedSubItems=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('edited-sub-items', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to set undo 'add' operation for items case
public undoItemAddOperation=(sendUndoData)=>{
  this.socket.emit('undo-item-add-operation',sendUndoData);

}//end

//method to listen undo 'add' opeartion for items case
public listenUndoItemAddOperation=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('undo-item-added-operation', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to set undo 'add' operation for subitems case
public undoSubItemAddOperation=(sendUndoData)=>{
  this.socket.emit('undo-subitem-add-operation',sendUndoData);

}//end

//method to listen undo 'add' opeartion for subitems case
public listenUndoSubItemAddOperation=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('undo-subitem-added-operation', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to set undo 'delete' operation
public undoItemDeleteOperation=(sendUndoData)=>{
  this.socket.emit('undo-item-delete-operation',sendUndoData);

}//end

//method to listen undo 'delete' opeartion
public listenUndoItemDeleteOperation=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('undo-item-deleted-operation', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to set undo 'delete' operation
public undoSubItemDeleteOperation=(sendUndoData)=>{
  this.socket.emit('undo-subitem-delete-operation',sendUndoData);

}//end

//method to listen undo 'delete' opeartion
public listenUndoSubItemDeleteOperation=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('undo-subitem-deleted-operation', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to set undo 'update' operation
public undoItemUpdateOperation=(sendUndoData)=>{
  this.socket.emit('undo-item-update-operation',sendUndoData);

}//end

//method to listen undo 'updated' opeartion
public listenUndoItemUpdateOperation=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('undo-item-updated-operation', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end

//method to set undo 'update' operation for subitem case
public undoSubItemUpdateOperation=(sendUndoData)=>{
  this.socket.emit('undo-subitem-update-operation',sendUndoData);

}//end

//method to listen undo 'updated' opeartion for subitem case
public listenUndoSubItemUpdateOperation=()=>{
  return Observable.create((observer) => {
    
    this.socket.on('undo-subitem-updated-operation', (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable
}//end


//method to send friend request
public sendFriendRequest=(reqSendData)=>{
  this.socket.emit('sendRequest',reqSendData);
}//end

//method to listen receive friend requests
public receiveRequests = (userId) => {

  return Observable.create((observer) => {

    this.socket.on(userId, (reqReceived) => {

      observer.next(reqReceived);

    }); // end Socket

  }); // end Observable

} // end onlineUserList
public exitSocket = (sendData) : any =>{
  
  this.socket.emit('disconnection',sendData);


}// end exit socket

// public exitCompSocket = () : any =>{
  
//   this.socket.emit('disconnection');


// }// end exit socket

//method to approve friend request
public recFriendRequestApproval=(reqApprovalData)=>{
  this.socket.emit('RequestApproval',reqApprovalData);
}//end

//method to listen send friend requests approval
public sendRequestsApproval = (userId) => {

  return Observable.create((observer) => {

    this.socket.on(userId, (reqApproval) => {

      observer.next(reqApproval);

    }); // end Socket

  }); // end Observable

} // end onlineUserList

}
