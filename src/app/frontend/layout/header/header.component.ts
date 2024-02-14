import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/authentication/auth-service/auth.service';
import { UserLoginComponent } from '../../auth/login/user-login.component';
import { CartListComponent } from '../../cart/cart-list/cart-list.component';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogedIn = false;
  totalItem : number = 0 ;
  wishItem : number = 0 ;
  localCartValue = localStorage.getItem("localCart");
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _cartService: CartService,
    private _authService: AuthService,
    private _bottomSheet: MatBottomSheet,
  ) {
    this._cartService.addToCartClick.subscribe(res=>{
      this.cartView();
    })
  }

  ngOnInit(): void {

    if(this.localCartValue != null){
      let cartValue = JSON.parse(this.localCartValue || '')
      this.totalItem = cartValue.length;
    }

    this._cartService.cartSubject.subscribe(res => {
      this.totalItem = res;
    })

    this._authService._user.subscribe(res => {
      if(res){
        this.dialog.closeAll();
        this.isLogedIn = true;
      }else {
        this.isLogedIn = false;
      }
    })

  }

  loginState(state:any){
    if(state) {
      this.router.navigateByUrl('/wishlist');
    }
    else {
      this.dialog.open(UserLoginComponent, {
        panelClass: 'model-popup-login-form',
        disableClose: true
      });
    }
  }

  cartView(){
    this._bottomSheet.open(CartListComponent, {
      panelClass: 'model-popup-cart-view',
      // disableClose: true,
    });
  }



}
