import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  hide = true;
  applyCouponCheck: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  applyCoupon(){
    this.applyCouponCheck = !this.applyCouponCheck;
  }

}
