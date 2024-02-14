import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginComponent } from '../auth/login/user-login.component';
import { UtilityService } from 'src/app/common/app-service/utility.service';
import { AuthService } from 'src/app/common/authentication/auth-service/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public totalItem: number = 0;
  public grandTotal: number = 0;
  spinner = false;
  isLogedIn = false;
  localCartValue = localStorage.getItem("localCart");
  public saveForLeterItem: any = [];
  public getCartDetail: any = [];
  public products: any = [];
  public cartNumber : number = 0;

  constructor(
    private _cartService: CartService,
    private _authService: AuthService,
    private _utilityService: UtilityService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.cartDetails();
    this.grandTotalValue();
    this._cartService.moveToCart.subscribe(res => {
      this.cartDetails();
      this.grandTotalValue();
    })

    if (this.localCartValue != null) {
      let cartValue = JSON.parse(this.localCartValue || '')
      this.totalItem = cartValue.length;
    }

    this._cartService.cartSubject.subscribe(res => {
      this.totalItem = res;
    })

    this._authService._user.subscribe(res => {
      // console.log(res)
      if (res) {
        this.dialog.closeAll();
        this.isLogedIn = true;
      } else {
        this.isLogedIn = false;
      }
    })

  }

  cartDetails() {
    if (localStorage.getItem('localCart') != null) {
      this.getCartDetail = JSON.parse(localStorage.getItem('localCart') || '');
      this.products = this.getCartDetail;
      this.totalItem = this.products.length;
    }
  }

  loginState(state: any) {
    if (state) {
      this.router.navigateByUrl('/checkout');
    }
    else {
      this.dialog.open(UserLoginComponent, {
        panelClass: 'model-popup-login-form',
        disableClose: true
      });
    }
  }

  saveForLater(data: any) {
    if (localStorage.getItem('saveForLeter') != null) {
      let index: number = -1;
      this.saveForLeterItem = JSON.parse(localStorage.getItem('saveForLeter') || '');
      if (index == -1) {
        this.saveForLeterItem.push(data);
        localStorage.setItem('saveForLeter', JSON.stringify(this.saveForLeterItem));
        this._utilityService.openSnackBar("This product is added For save for leter");
      }
    }
    else {
      this.saveForLeterItem.push(data);
      localStorage.setItem('saveForLeter', JSON.stringify(this.saveForLeterItem));
      this._utilityService.openSnackBar("This product is added For save for leter");
    }
    this.removeCartValue(data.id);
    this.grandTotalValue();
    this.cartDetails();
    this._cartService.saveForLeter.emit(data.id);
  }

  removeCartValue(item: string) {
    if (localStorage.getItem('localCart') != null) {
      this.products = JSON.parse(localStorage.getItem('localCart') || '');
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == item) {
          this.products.splice(i, 1);
          localStorage.setItem('localCart', JSON.stringify(this.products));
        }
      }
      this.cartDetails();
      this.grandTotalValue()
      if (JSON.parse(localStorage.getItem('localCart') || '').length < 0) { // Action for Remove All Cart Items
        this.saveForLeterItem = [];
        localStorage.removeItem("localCart");
        this.products = [];
      }
      this.cartValueFun();
    }
  }

  // Action for increase decrease in Cart page
  increase(productId: any, quantity: any) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === productId) {
        if (quantity != this.products[i].numOfItem) {
          this.products[i].quantity = parseInt(quantity) + 1;
          // this._cartService.openSnackBar(`You've changed 'Flipkart SmartBuy Cola Flask 500 ml Flask' QUANTITY to '${this.products[i].numOfItem}'`);
        } else {
          this._utilityService.openSnackBar("Sorry! We don't have any more units for this item.");
        }
      }
    }
    localStorage.setItem('localCart', JSON.stringify(this.products));
    this.grandTotalValue();
  }
  decrease(productId: any, quantity: any) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === productId) {
        if (quantity != 1) {
          this.products[i].quantity = parseInt(quantity) - 1;
        }
      }
    }
    localStorage.setItem('localCart', JSON.stringify(this.products));
    this.grandTotalValue()
  }

  // Total Price
  grandTotalValue() {
    if (localStorage.getItem('localCart') != null) {
      this.products = JSON.parse(localStorage.getItem('localCart') || '');
      this.grandTotal = this.products.reduce(function (acc: number, val: { price: number; quantity: number; discount: number; }) {
        let totalPrice = val.price;
        let discounted = val.price * val.discount / 100;
        return acc + ((totalPrice - discounted) * val.quantity);
      }, 0);
    }
  }

  cartValueFun(){
    let cartValue = JSON.parse(localStorage.getItem("localCart") || '');
    this.cartNumber = cartValue.length;
    // send data from here to Subject creation in cart.service.ts
    this._cartService.cartSubject.next(this.cartNumber);
  }

}