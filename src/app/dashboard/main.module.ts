import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import mat assets
import { MatAssetsModule } from '../mat-assets.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { DashboardRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AllProductsComponent } from './products/all-products.component';
import { ShowProductComponent } from './products/show-product/show-product.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { LoginComponent } from './auth/login.component';
import { TrashComponent } from './trash/trash.component';
import { HomeComponent } from './home/home.component';
import { HomeSliderComponent } from './pages/home-slider/home-slider.component';
import { AddSliderComponent } from './pages/home-slider/add-slider/add-slider.component';
import { EditSliderComponent } from './pages/home-slider/edit-slider/edit-slider.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './pages/terms-condition/terms-condition.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';


@NgModule({
  declarations: [
    MainComponent,
    NavigationComponent,
    AddCategoryComponent,
    DashboardComponent,
    AllProductsComponent,
    ShowProductComponent,
    AddProductComponent,
    EditProductComponent,
    LoginComponent,
    TrashComponent,
    HomeComponent,
    HomeSliderComponent,
    AddSliderComponent,
    EditSliderComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    ContactUsComponent,
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    DashboardRoutingModule,
    MatAssetsModule,
    CKEditorModule
  ]
})
export class MaindModule { }
