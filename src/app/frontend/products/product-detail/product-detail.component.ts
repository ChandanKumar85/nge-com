import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from '../../../dashboard/interface/product';
import { ProdService } from '../../../common/app-service/prod.service';
import { CartService } from '../../service/cart.service';
import { UtilityService } from '../../../common/app-service/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginComponent } from '../../auth/login/user-login.component';



// import Swiper core and required modules
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  public cartNumber     : number = 0;
  public productDetail  : any = [];
  public getCartDetail  : any = [];
  public itemsCart      : any = [];
  public cartProd       : any = [];
  filterData: any = [];
  products: any = [];
  key = this.activatedRoute.snapshot.params['id'];
  spinner = false;
  isLogedIn = false;
  public form!: FormGroup;
  dislayedImg = 0;
  selectedItem = 0;
  items_cart: any;

  constructor(
    private _utilityService: UtilityService,
    private _prodService: ProdService,
    private _cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.form = this.fb.group({
      rating: ['4', Validators.required],
    })
  }

  ngOnInit(): void {
    // Subscribe from event emit form card component
    this._cartService.clickOnProduct.subscribe((res)=>{
      this.key = res;
      this.getProdectDetail(this.key);
    })
    this.getProdectDetail(this.key);
    // console.log(this.count)
  }

  // Get single product detail
  getProdectDetail(keyValue:string){
    this.spinner = true;
    this._prodService.getProdDetail(keyValue).snapshotChanges().subscribe(res => {
        this.productDetail= { id: res.payload.id, ...res.payload.data() as Product };
        this.suggestedProduct(this.productDetail.category);
        this.spinner = false;
        // console.log(this.productDetail.rating.count)
        // console.log(this.productDetail.rating.rate)
      },
      err => {
        console.debug(err);
      }
    )
  }

  // suggested Product list
  suggestedProduct(category:string){
    this.spinner = true;
    this._prodService.getProdAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.filterData = data;
      this.products = [];
      this.filterData.forEach((x:any) => {
        if(category == x.category && this.key != x.id){
          this.products.push(x);
        }
      })
    })
    this.spinner = false;
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

  addToCartProduct(item: any){
    if(this.isLogedIn != false) {
      this._prodService.addToCart(item);
      this.addToCart(item);
      console.log("After Login");
    }
    else {
      this.addToCart(item);
      this.cartValueFun();
      this._cartService.addToCartClick.next(item);
      console.log("Login Out Mode");
    }
  }
  addToCart(item: any){
    if(localStorage.getItem('localCart') !== null){
      let index:number = -1;
      this.itemsCart = JSON.parse(localStorage.getItem('localCart') || '');
      for(let i=0; i<this.itemsCart.length; i++){
        if(this.itemsCart[i].id === item.id){
          index = i;
          this._utilityService.openSnackBar("This product is already added");
          break;
        }
      }
      if(index == -1){
        this.itemsCart.push(item);
        localStorage.setItem('localCart', JSON.stringify(this.itemsCart));
        this._utilityService.openSnackBar("This product is added");
      }
    }
    else {
      this.itemsCart.push(item);
      localStorage.setItem('localCart', JSON.stringify(this.itemsCart));
      this._utilityService.openSnackBar("This product is added");
    }

    if(localStorage.getItem('saveForLeter') != null){
      this.itemsCart = JSON.parse(localStorage.getItem('saveForLeter') || '');
      for(let i=0; i<this.itemsCart.length; i++){
        if(this.itemsCart[i].id === item.id){
          this._cartService.deleteSaveFor.emit(item.id);
          console.log("🚀 ~ file: product-detail.component.ts:160 ~ ProductDetailComponent ~ addToCart ~ item.id", item.id)
          this._utilityService.openSnackBar("This product is add to cart");
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


  saveForLater(item:any){
    if(localStorage.getItem('saveForLeter') !== null || localStorage.getItem('localCart') !== null){
      let index:number = -1;
      
      this.items_cart = JSON.parse(localStorage.getItem('localCart') || '');
      for(let i=0; i<this.items_cart.length; i++){
        if(this.items_cart[i].id === item.id){
          index = i;
          this._utilityService.openSnackBar("Already added to Add to cart");
          break;
        }
      }

      this.itemsCart = JSON.parse(localStorage.getItem('saveForLeter') || '');
      for(let i=0; i<this.itemsCart.length; i++){
        if(this.itemsCart[i].id === item.id){
          index = i;
          this._utilityService.openSnackBar("Already added Save for letter");
          break;
        }
      }

      if(index == -1){
        this.itemsCart.push(item);
        localStorage.setItem('saveForLeter', JSON.stringify(this.itemsCart));
        this._utilityService.openSnackBar("Added to Save for letter");
      }
    }
    else {
      this.itemsCart.push(item);
      localStorage.setItem('saveForLeter', JSON.stringify(this.itemsCart)); 
    }
  }

}