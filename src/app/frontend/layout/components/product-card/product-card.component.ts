import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '../../../service/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() productData: any;
  defaultProductImage: string = '../../../../../assets/icons/img-dummy-product.jpg';
  checkValue: any;

  constructor( 
    private _cartService: CartService
  ) { }

  ngOnInit(): void {

    this._cartService.storeKey.subscribe((res)=>{
      this.checkValue = res;
      // console.log(this.checkValue);
      
    })

  }

  public clickedProduct(id: MouseEvent) {
    this._cartService.clickOnProduct.emit(id);
  }


}