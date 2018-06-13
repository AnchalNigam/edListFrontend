import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import {HttpClient,HttpParams,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
@Injectable()
export class EdListService {
  public baseUrl="http://edlistapi.webdeveloperjourney.xyz/api/v1"
  constructor(public http: HttpClient) { }
  
  //Method to get country list
  public getCountryList=()=>{
   
    let response=this.http.get('../assets/countryList.json');
    return response;
  }//end

  //method to get country code
  public getCountryCode=()=>{
    let response=this.http.get('../assets/codeList.json');
    return response;
  }//end

  //method to signup 
  public signup=(data):Observable<any>=>{

    const params=new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('mobileNumber', data.mobile)
      .set('password', data.password)
      .set('country',data.country)
   return this.http.post(`${this.baseUrl}/users/signup`, params);

  }//end

  //Method to verify email
  public verifyEmail = (data): Observable<any> => {
    const param = new HttpParams()
      .set('hash', data)

    return this.http.put(`${this.baseUrl}/users/verifyEmail`, param);
  }
  //end method

//method to login
  public logIn = (data): Observable<any> => {
    const param = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.baseUrl}/users/login`, param);
  }//end

  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage

  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))


  }//end setuser

  //forgot password
  public forgotPassword = (email): Observable<any> => {
    const param = new HttpParams()
      .set('email', email)

    return this.http.post(`${this.baseUrl}/users/forgotPassword`, param);
  }//end

  //reset password function
  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)
    return this.http.put(`${this.baseUrl}/users/resetPassword`, params);


  }//end password function
  
  //method to get all users of system
  public getAllUsers=(authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/users/view/all?authToken=${authToken}`);
  }//end

  //method to get all friends list to whom user has send a requests
  public getSendReqList=(reqSendId,authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/friends/${reqSendId}/view/all/sendRequests?authToken=${authToken}`);
    
  }//end

  //method to get all friends list to whom user has send a requests
  public getRecReqList=(reqRecId,authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/friends/${reqRecId}/view/all/RecRequests?authToken=${authToken}`);
    
  }//end
  
  //method to get all friends
  public getAllFriends=(userId,authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/friends/${userId}/view/all?authToken=${authToken}`);

  }//end

  //method to get all friends
  public getAllRequests=(authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/friends/view/all/requests?authToken=${authToken}`);

  }//end

 //method to create todolist
 public createTodoList=(data,authToken):Observable<any>=>{
  const params = new HttpParams()
  .set('listName', data.listName)
  .set('creator', data.creator)
  .set('creatorId', data.creatorId)

   return this.http.post(`${this.baseUrl}/lists/create?authToken=${authToken}`,params);
 }//end

 //method to get alltodo list
 public getAllToDoList=(friendsLists,authToken):Observable<any>=>{
    friendsLists=friendsLists.toString();
    return this.http.get(`${this.baseUrl}/lists/view/all?friendsList=${friendsLists}&authToken=${authToken}`);
 }//end

 //method to get all items
 public getItems=(listId,skip): Observable<any> =>{   //recevr id means roomid

  return this.http.get(`${this.baseUrl}/lists/get/all/items?listId=${listId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
    
} //end

//method to get undo list.
public undoListItems=(selectedListId): Observable<any>=>{
    return this.http.get(`${this.baseUrl}/lists/get/undoList?listId=${selectedListId}&authToken=${Cookie.get('authtoken')}`);
}//end

 public logout(): Observable<any> {

 
  let authToken=Cookie.get('authtoken');
  let data ={};
  return this.http.post(`${this.baseUrl}/users/logout?authToken=${authToken}`,data );

} // end logout function

}
