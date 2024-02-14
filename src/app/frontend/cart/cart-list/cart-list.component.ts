import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  totalItem : number = 0 ;
  localCartValue = localStorage.getItem("localCart");

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<CartListComponent>,
    private _cartService: CartService,
  ) { }

  ngOnInit(): void {
    if(this.localCartValue != null){
      let cartValue = JSON.parse(this.localCartValue || '')
      this.totalItem = cartValue.length;
    }

    this._cartService.cartSubject.subscribe(res => {
      this.totalItem = res;
    })
  }

  closeBottomSheet(): void {
    this._bottomSheetRef.dismiss();
  }
}
