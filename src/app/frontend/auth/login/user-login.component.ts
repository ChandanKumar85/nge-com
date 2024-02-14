import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/common/app-service/utility.service';
import { AuthService } from 'src/app/common/authentication/auth-service/auth.service';
import { ErrorService } from 'src/app/common/error.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  hide = true;
  hideC = true;
  hideL = true;
  autocomplete : boolean = false;
  loginMode: boolean = true;
  createAccount: boolean = true;
  userFormLogin!: FormGroup;
  forgetPassword!: FormGroup;
  userForm!: FormGroup;
  submitted = false;
  submittedC = false;
  submittedP = false;
  requestAnimate : boolean = false;
  requestAnimateU : boolean = false;
  requestAnimateP : boolean = false;
  errMsgs: any = this._errService.errorMessage;

  constructor(
    private fb:FormBuilder,
    private _authService: AuthService,
    private _utilityService: UtilityService,
    private _errService: ErrorService,
    private _cartService: CartService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>/\\\\=\\[\\]/+;_`~/-])[A-Za-z\\d!@#$%^&*(),.?":{}|<>/\\\\=\\[\\]/+;_`~/-]{8,}$')]],
      cnfPassword: [null, [Validators.required]]
    },
    {
      validators:this.matchPassword("newPassword","cnfPassword")
    })

    this.userFormLogin = this.fb.group({
      emailId: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>/\\\\=\\[\\]/+;_`~/-])[A-Za-z\\d!@#$%^&*(),.?":{}|<>/\\\\=\\[\\]/+;_`~/-]{8,}$')]],
    })

    this.forgetPassword = this.fb.group({
      emailIdf: [null, [Validators.required, Validators.email]]
    })

  }

  get f() : { [key: string]: AbstractControl }{ return this.userForm.controls; }
  get fu() : { [key: string]: AbstractControl }{ return this.userFormLogin.controls; }
  get fp() : { [key: string]: AbstractControl }{ return this.forgetPassword.controls; }

  matchPassword(password: any, confPassword:any){
    return (formGroup:FormGroup) =>{
      const passwordControl = formGroup.controls[password];
      const cnfPasswordControl = formGroup.controls[confPassword];
      if(cnfPasswordControl.errors && !cnfPasswordControl.errors['matchPassword']){
        return;
      }
      if(passwordControl.value !== cnfPasswordControl.value){
        cnfPasswordControl.setErrors({matchPassword:true});
      }
      else {
        cnfPasswordControl.setErrors(null);
      }
    }
  }
  
  switchToSignUp(){ this.loginMode = !this.loginMode }
  registerAccount(){ this.createAccount = !this.createAccount }

  submitToRetrive(){
    this.submittedP = true;
    if(this.forgetPassword.valid){
      console.log(this.forgetPassword.value)
    }
  }







  submitToSignUp(){
    this.submitted = true;
    const email = this.userForm.value.email;
    const password = this.userForm.value.newPassword;
    if(this.userForm.valid){
      this.requestAnimate = true;
      this._authService.signUp(email, password).subscribe(res=>{
        this._utilityService.openSnackBar("Successfully you have created Account");
        this.requestAnimate = false;
      },
      err => {
        this._utilityService.openSnackBar(this.errMsgs[err.error.error.message]);
        this.requestAnimate = false;
      })
    }
  }

  submitToLogin(){
    this.submittedC = true;
    const email = this.userFormLogin.value.emailId;
    const password = this.userFormLogin.value.password;
    if(this.userFormLogin.valid){
      this.requestAnimateU = true;
      this._authService.userSignIn(email, password).subscribe(res=>{
        this._utilityService.openSnackBar("You have successfully loged in");
        this.requestAnimateU = false;
      },
      err => {
        this._utilityService.openSnackBar("User id or Password is wrong"); // this.errMsgs[err.error.error.message]
        this.requestAnimateU = false;
      })
    }
  }

}
