import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/common/app-service/utility.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-save-for-later',
  templateUrl: './save-for-later.component.html',
  styleUrls: ['./save-for-later.component.scss']
})
export class SaveForLaterComponent implements OnInit {

  public totalItem : number = 0;
  public noOfSaveLater : number = 0;
  public productsData : any = [];
  public moveToCartItem : any = [];
  public cartNumber : number = 0;

  constructor(
    private _utilityService: UtilityService,
    private _cartService: CartService 
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('saveForLeter') != null){
      this.saveForLeterData();
    }
    this._cartService.saveForLeter.subscribe(res=>this.saveForLeterData());
    this._cartService.deleteSaveFor.subscribe(res=>this.removeSaveLeterValue(res));
  }

  // Get Cart item from localstorage for listing Details
  saveForLeterData(){
    this.productsData = JSON.parse(localStorage.getItem('saveForLeter') || '');

    // Count save For Leter items for H1 Tag
    this.totalItem = this.productsData.length;
    this.checkSaveForLater();
  }

  checkSaveForLater(){
    this.noOfSaveLater = JSON.parse(localStorage.getItem('saveForLeter') || '').length;
  }

  moveToCart(data:any){
    if(localStorage.getItem('localCart') != null){
      let index:number = -1;
      this.moveToCartItem = JSON.parse(localStorage.getItem('localCart') || '');
      if(index == -1){
        this.moveToCartItem.push(data);
        localStorage.setItem('localCart', JSON.stringify(this.moveToCartItem));
        this._utilityService.openSnackBar("This product is added For my cart");
      }
    }
    else {
      this.moveToCartItem.push(data);
      localStorage.setItem('localCart', JSON.stringify(this.moveToCartItem));
      this._utilityService.openSnackBar("This product is added For my cart");
    }
    this.removeSaveLeterValue(data.id);
    this._cartService.moveToCart.emit(data.id);
  }

  removeSaveLeterValue(item:string){
    if(localStorage.getItem('saveForLeter') != null){
      this.productsData = JSON.parse(localStorage.getItem('saveForLeter') || '');
      for(let i=0; i<this.productsData.length; i++ ){
        if(this.productsData[i].id == item){
          this.productsData.splice(i,1);
          localStorage.setItem('saveForLeter', JSON.stringify(this.productsData));
        }
      }
      this.saveForLeterData();
      if(JSON.parse(localStorage.getItem('saveForLeter') || '').length < 0){
        localStorage.removeItem("saveForLeter");
        this.moveToCartItem = [];
        this.productsData = [];
      }
      this.cartValueFun();
    }
  }

  cartValueFun(){
    let cartValue = JSON.parse(localStorage.getItem("localCart") || '');
    this.cartNumber = cartValue.length;
    // send data from here to Subject creation in cart.service.ts
    this._cartService.cartSubject.next(this.cartNumber);
  }


}
