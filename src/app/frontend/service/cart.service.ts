import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cartItemList : any =[];
  public productList = new BehaviorSubject<any>([]);
  public dataToCheckOut = new BehaviorSubject<any>([null]);

  // Subject creation
  cartSubject = new Subject<number>();
  productSearchSubject = new Subject<any>();
  addToCartClick = new Subject<any>();
  clickToCloseModel = new Subject<any>();
  clickToShowBtn = new Subject<any>();
  

  @Output() public clickOnProduct = new EventEmitter<MouseEvent>();
  @Output() public storeKey = new EventEmitter<MouseEvent>();
  @Output() public saveForLeter = new EventEmitter<MouseEvent>();
  @Output() public moveToCart = new EventEmitter<MouseEvent>();
  deleteSaveFor = new EventEmitter<string>();

  constructor( ) { }

  getProducts(){
    return this.productList.asObservable();
  }

  setProduct(product : any){
    this.cartItemList.push(...product);
    this.productList.next(product);
  }

  addToCart(product : any){
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList);
    this.getTotalPrice();
  }

  getTotalPrice() : number{
    let grandTotal = 0;
    this.cartItemList.map((a:any)=>{
      if(a.discount){
        grandTotal += a.total*a.discount/100;
      } else if(!a.discount) {
        grandTotal += a.total;
      }
    })
    return grandTotal;
  }

  removeCartItem(product: any){
    this.cartItemList.map((a:any, index:any)=>{
      if(product.id === a.id){
        this.cartItemList.splice(index,1);
      }
    })
    this.productList.next(this.cartItemList);
  }

  removeAllCart(){
    this.cartItemList = []
    this.productList.next(this.cartItemList);
  }

}
