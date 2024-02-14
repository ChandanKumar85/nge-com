import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import mat assets
import { MatAssetsModule } from '../mat-assets.module';
import { FrontendRoutingModule } from './frontend-routing.module';
import { FrontendComponent } from './frontend.component';
import { NgxStarRatingModule } from 'ngx-star-rating';

import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeSliderComponent } from './layout/home-slider/home-slider.component';
import { ProductCardComponent } from './layout/components/product-card/product-card.component';
import { CustomPipe } from '../common/pipe/custom.pipe';

import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { SuggestedProductsComponent } from './products/product-detail/suggested-products/suggested-products.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SaveForLaterComponent } from './cart/save-for-later/save-for-later.component';
import { UserLoginComponent } from './auth/login/user-login.component';
import { SwiperModule } from 'swiper/angular';
import { CheckoutComponent } from './checkout/checkout.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CouponComponent } from './layout/coupon/coupon.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { BottomSheetComponent } from './cart/bottom-sheet/bottom-sheet.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    FrontendComponent,
    HeaderComponent,
    FooterComponent,
    HomeSliderComponent,
    ProductCardComponent,
    CustomPipe,
    HomeComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    WishlistComponent,
    SuggestedProductsComponent,
    SaveForLaterComponent,
    UserLoginComponent,
    CheckoutComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    CouponComponent,
    CartListComponent,
    BottomSheetComponent,
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatAssetsModule,
    FrontendRoutingModule,
    NgxStarRatingModule,
    SwiperModule
  ]
})
export class FrontendModule { }
