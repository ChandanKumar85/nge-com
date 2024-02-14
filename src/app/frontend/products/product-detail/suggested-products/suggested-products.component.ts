import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, { SwiperOptions } from 'swiper'; // import Swiper core and required modules

@Component({
  selector: 'app-suggested-products',
  templateUrl: './suggested-products.component.html',
  styleUrls: ['./suggested-products.component.scss']
})
export class SuggestedProductsComponent implements OnInit {

  @Input() productData: any;
  
  constructor() { }

  ngOnInit(): void {
  }

  config: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 10,
    slidesPerGroup: 1,
    loop : false,
    loopFillGroupWithBlank : true,
    navigation: true,
    pagination: false,
    scrollbar: false,
  }

}
