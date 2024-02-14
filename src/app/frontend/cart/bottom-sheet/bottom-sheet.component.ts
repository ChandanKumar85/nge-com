import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/common/app-service/utility.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  public products : any = [];
  public getCartDetail : any=[];
  public grandTotal : number = 0;
  public saveForLeterItem : any = [];
  public totalItem : number = 0;

  constructor(
    private _utilityService: UtilityService,
    private _cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartDetails();
    this.grandTotalValue();
    this._cartService.moveToCart.subscribe(res=>{
      this.cartDetails();
      this.grandTotalValue();
    })
  }

  cartDetails(){
    if(localStorage.getItem('localCart') != null){
      this.getCartDetail = JSON.parse(localStorage.getItem('localCart') || '');
      this.products = this.getCartDetail;
      this.totalItem = this.products.length;
    }
  }

  removeCartValue(item:string){
    if(localStorage.getItem('localCart') != null){
      this.products = JSON.parse(localStorage.getItem('localCart') || '');
      for(let i=0; i<this.products.length; i++ ){
        if(this.products[i].id == item){
          this.products.splice(i,1);
          localStorage.setItem('localCart', JSON.stringify(this.products));
        }
      }
      this.cartDetails();
      this.grandTotalValue()
      if(JSON.parse(localStorage.getItem('localCart') || '').length < 0){ // Action for Remove All Cart Items
        this.saveForLeterItem = [];
        localStorage.removeItem("localCart");
        this.products = [];
      }
    }
  }

  // Action for increase decrease in Cart page
  increase(productId: any, quantity: any){
    for(let i=0; i<this.products.length; i++){
      if(this.products[i].id === productId){
        if(quantity != this.products[i].numOfItem){
          this.products[i].quantity = parseInt(quantity) + 1;
          // this._cartService.openSnackBar(`You've changed 'Flipkart SmartBuy Cola Flask 500 ml Flask' QUANTITY to '${this.products[i].numOfItem}'`);
        }else{
          this._utilityService.openSnackBar("Sorry! We don't have any more units for this item.");
        }
      }
    }
    localStorage.setItem('localCart', JSON.stringify(this.products));
    this.grandTotalValue();
  }
  decrease(productId: any, quantity: any){
    for(let i=0; i<this.products.length; i++){
      if(this.products[i].id === productId){
        if(quantity != 1){
          this.products[i].quantity = parseInt(quantity) - 1;
        }
      }
    }
    localStorage.setItem('localCart', JSON.stringify(this.products));
    this.grandTotalValue()
  }

    // Total Price
  grandTotalValue(){
    if(localStorage.getItem('localCart') != null){
      this.products = JSON.parse(localStorage.getItem('localCart') || '');
      this.grandTotal = this.products.reduce(function( acc: number, val: { price: number; quantity: number; discount: number; }){
        let totalPrice = val.price;
        let discounted = val.price*val.discount/100;
        return acc + ((totalPrice - discounted) * val.quantity);
      }, 0);
    }
  }

  saveForLater(data:any){
    if(localStorage.getItem('saveForLeter') != null){
      let index:number = -1;
      this.saveForLeterItem = JSON.parse(localStorage.getItem('saveForLeter') || '');
      if(index == -1){
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
    this._cartService.saveForLeter.emit(data.id);
  }

}
