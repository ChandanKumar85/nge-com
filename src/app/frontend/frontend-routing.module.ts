import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FrontendComponent } from './frontend.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


const routes: Routes = [
  { path: '', component: FrontendComponent,
    children: [
      { path:'', component: HomeComponent },
      { path:'products', component: ProductsComponent },
      { path:'product/:id', component: ProductDetailComponent },
      { path:'cart', component: CartComponent },
      { path:'wishlist', component: WishlistComponent },
      { path:'terms-conditions', component: TermsConditionsComponent },
      { path:'privacy-policy', component: PrivacyPolicyComponent },
      { path:'checkout', component: CheckoutComponent, canActivate:[] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
