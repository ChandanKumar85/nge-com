import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AllProductsComponent } from './products/all-products.component';
import { ShowProductComponent } from './products/show-product/show-product.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';

import { LoginComponent } from './auth/login.component';
import { TrashComponent } from './trash/trash.component';
import { AuthGuardService } from './auth/auth-service/auth-guard.service';
import { HomeSliderComponent } from './pages/home-slider/home-slider.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './pages/terms-condition/terms-condition.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '', component: MainComponent, canActivateChild:[AuthGuardService],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: AllProductsComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'product/:id', component: ShowProductComponent },
      { path: 'products', component: AllProductsComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'categories', component: AddCategoryComponent },
      { path: 'home', component: HomeSliderComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms-conditions', component: TermsConditionComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'about-us', component: AboutUsComponent }
      
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
