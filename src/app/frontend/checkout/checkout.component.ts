import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { CartService } from '../service/cart.service';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public getCartDetail : any = [];
  public grandTotal : number = 0;
  public activeBtn: boolean = true;
  bellingDetail!: FormGroup;
  submitted = false;
  logedInStatus: boolean = false;
  spinner = false;
  userDetail : any;
  selectedValue!: string;

  // @ViewChild(PrivacyPolicyComponent) checkout!: PrivacyPolicyComponent;

  constructor(
    private fb: FormBuilder,
    private _prodService: ProdService,
    private _cartService: CartService,
    private dialog: MatDialog
  ) { }

  // ngAfterContentInit() {
  //   console.log(this.checkout)
  // }

  get f() : { [key: string]: AbstractControl }{ return this.bellingDetail.controls; }

  ngOnInit(): void {

    if(localStorage.getItem('localCart') != null){
      this.getCartDetail = JSON.parse(localStorage.getItem('localCart') || '');
      // Total Price
      this.grandTotal = this.getCartDetail.reduce(function( acc: number, val: { price: number; quantity: number; discount: number; }){
        let totalPrice = val.price;
        let discounted = val.price*val.discount/100;
        return acc + ((totalPrice - discounted) * val.quantity);
      }, 0);
    }

    // Form data validation
    this.bellingDetail = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      country: ['India', [Validators.required]],
      street: [null, [Validators.required]],
      cityName: [null, [Validators.required]],
      state: [null, [Validators.required]],
      pinCode: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      emailId: [null, [Validators.required, Validators.email]],
      placeNow: [],
      information: [null]
    })

  }
  
  reviewAddress(){
    this.submitted = true;
    if(this.bellingDetail.valid) {
      this.userDetail = this.bellingDetail.value;
      this.logedInStatus = true;
    }
  }

  editDetail(){
    this.logedInStatus = false;
    this.bellingDetail.get('placeNow')?.setValue(true);
  }

  // Submit form for create user
  onSubmit(){
    this.spinner = true;

    console.log(this.bellingDetail.value);
    this._prodService.userAdd(this.bellingDetail.value)
    .then(()=>{
      console.log(this.bellingDetail.value);
      this.spinner = false;
      this.bellingDetail.reset();
    })
    .catch((err: any)=>{
      console.error('Error Updating Data...', err)
    })
  }

  placeNow(e:any){
    if(e.checked == true || e.checked == false){
      this.activeBtn = !this.activeBtn;
    }
  }

  termAndCond(){
    this.dialog.open(TermsConditionsComponent, {
      panelClass: 'model_popup_term_Cond',
      disableClose: true
    });
    this._cartService.clickToShowBtn.next(true);
    this._cartService.clickToCloseModel.subscribe(()=>{
      this.dialog.closeAll();
    })
  }

  privacyPolicy(){
    this.dialog.open(PrivacyPolicyComponent, {
      panelClass: 'model_popup_term_Cond',
      disableClose: true
    });
    this._cartService.clickToShowBtn.next(true);
    this._cartService.clickToCloseModel.subscribe(()=>{
      this.dialog.closeAll();
    })
  }

}
