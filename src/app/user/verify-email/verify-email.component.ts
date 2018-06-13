import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EdListService } from './../../ed-list.service';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  public hash:any;
  public success:number;
  public failure:number;
  constructor(private _route: ActivatedRoute, private router: Router,public edListService: EdListService) { }

  ngOnInit() {
    this.hash = this._route.snapshot.paramMap.get('hash');
    this.edListService.verifyEmail(this.hash).subscribe(
      Response => {
        if (Response.status === 200) {
          this.success=1;
        }
        else{
          this.failure=1;
        }
        },
      error => {
       
       
      });
    

  }

}
