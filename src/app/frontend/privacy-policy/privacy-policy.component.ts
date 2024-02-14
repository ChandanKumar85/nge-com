import { Component, OnInit } from '@angular/core';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  pageData:any;
  spinner = false;
  hideClose: boolean = false;

  constructor(
    public _prodService: ProdService,
    public _cartService: CartService
    ) { 
      this._cartService.clickToShowBtn.subscribe((res)=>{
        this.hideClose = true;
      })
    }

  ngOnInit(): void {
    this.spinner = true;
    this._prodService.getPageDetail("privacy-policy").snapshotChanges().subscribe(res => {
      this.pageData = { ...res.payload.data() as any };
      this.spinner = false;
      },
      err => {
        console.debug(err);
      }
    )
  }

  clickToClose(){
    this._cartService.clickToCloseModel.next(true)
  }

}
