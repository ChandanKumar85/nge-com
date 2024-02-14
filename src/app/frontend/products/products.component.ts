import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/common/app-service/utility.service';
import { ProdService } from '../../common/app-service/prod.service';
import { Product } from '../../dashboard/interface/product';
import { UserLoginComponent } from '../auth/login/user-login.component';
import { CartService } from '../service/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  spinner = false;
  isLogedIn = false;
  
  products!: Product[];
  categories!: Product[];
  filteredProduct: any = [];
  filterProdByCategory: any = [];

  
  p: number = 1;
  itemsCart: any = [];
  public cartNumber : number = 0;

  constructor( 
    private dialog: MatDialog,
    private router: Router,
    private _utilityService: UtilityService,
    private _prodService: ProdService,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {

    // Fetch All Catogery
    this._prodService.getProdCatogery().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });
    
    // Fetch All Products  
    this.spinner = true;
    this._prodService.getProdAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      this.filteredProduct = this.products;
      this.spinner = false;
      // console.log(this.filteredProduct)
    });

  }

  // Filter Products
  filterData(event:any, selectedCategory:any){
    if(event.checked){
      const filteredProductsCategory = this.products.filter((data:any)=>data.category === selectedCategory);
      filteredProductsCategory.forEach((x:any)=>{
        this.filterProdByCategory.push(x);
      })
      this.filteredProduct = this.filterProdByCategory;
      console.log(this.filteredProduct)
    }
    else {
      this.filterProdByCategory = this.filterProdByCategory.filter((data:any)=>{
        return data.category !== selectedCategory;
      })
      this.filteredProduct = this.filterProdByCategory;
      console.log(this.filteredProduct)
    }
    if(this.filterProdByCategory.length == 0){
      this.filteredProduct = this.products;
    }
  }










  










  addToCartProduct(item: any){
    if(this.isLogedIn != false) {
      this._prodService.addToCart(item);
      this.addToCart(item);
      console.log("After Login");
    }
    else {
      this.addToCart(item);
      this.cartValueFun();
      // this._cartService.addToCartClick.next(item);
      console.log("Login Out Mode");
    }
  }
  addToCart(item: any){
    if(localStorage.getItem('localCart') != null){
      let index:number = -1;
      // console.log(index)
      this.itemsCart = JSON.parse(localStorage.getItem('localCart') || '');
      for(let i=0; i<this.itemsCart.length; i++){
        if(this.itemsCart[i].id === item.id){
          index = i;
          console.log(index)
          this._utilityService.openSnackBar("This product is already added to cart");
          break;
        }
      }
      if(index == -1){
        this.itemsCart.push(item);
        localStorage.setItem('localCart', JSON.stringify(this.itemsCart));
        this._utilityService.openSnackBar("This product is added to cart");
      }
    }
    else {
      let storeDataGet:any = [];
      storeDataGet.push(item);
      localStorage.setItem('localCart', JSON.stringify(storeDataGet));
      this._utilityService.openSnackBar("This product is added to cart");
    }

    if(localStorage.getItem('saveForLeter') != null){
      this.itemsCart = JSON.parse(localStorage.getItem('saveForLeter') || '');
      for(let i=0; i<this.itemsCart.length; i++){
        if(this.itemsCart[i].id === item.id){
          this._cartService.deleteSaveFor.next(item.id);
          this._utilityService.openSnackBar("This product is moved to cart");
        }
      }
    }

  }

  cartValueFun(){
    let cartValue = JSON.parse(localStorage.getItem("localCart") || '');
    this.cartNumber = cartValue.length;
    // send data from here to Subject creation in cart.service.ts
    this._cartService.cartSubject.next(this.cartNumber);
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

}

