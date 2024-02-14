import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from '../../common/app-service/utility.service';
import { ErrorService } from '../../common/error.service';
import { AuthService } from '../../common/authentication/auth-service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  adminLoginForm!: FormGroup;
  forgetPassForm!: FormGroup;
  userLogin: boolean = true;
  isLoggedIn: boolean = true;
  passwordHide : boolean = true;
  submitted : boolean = false;
  
  successMsg : boolean = false;
  requestAnimate : boolean = false;
  requestAnimateEmail: boolean = false;

  constructor(
    private fb:FormBuilder,
    private _authService: AuthService,
    private _utilityService: UtilityService,
    private _errService: ErrorService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._authService.adminUser.subscribe(res=>{
      if(res){
        this._router.navigate(['admin/dashboard']);
      }
    })
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
    this.forgetPassForm = this.fb.group({
      email: ['', [Validators.required]]
    })
  }

  get f() : { [key: string]: AbstractControl }{ return this.adminLoginForm.controls; }

  switchToAuthSetup(){
    this.userLogin = !this.userLogin;
  }

  onSubmit(userDetail:any){
    this.submitted = true;
    // console.log(userDetail.value)
    const email = this.adminLoginForm.value.email;
    const password = this.adminLoginForm.value.password;

    if(this.adminLoginForm.valid){
      this.requestAnimate = true;
      this._authService.signIn(email, password).subscribe(res=>{
        this.requestAnimate = true;
        this._router.navigate(['admin/dashboard'])
      },
      err => {
        this._utilityService.openSnackBar("Invalid User or Password");
        this.requestAnimate = false;
      })
    }
  }

  sendToEmail(){
    this.submitted = true;
    // const email = this.forgetPassForm.value.email;
    if(this.forgetPassForm.valid){
      this.requestAnimateEmail = true;
      this._authService.forgetPassword(this.forgetPassForm.value).subscribe(
        res => {
          console.log(res);
          this.requestAnimateEmail = false;
          this.successMsg = true;
        },
        err => {
          console.log(err)
          this._utilityService.openSnackBar("Email not exist");
          this.requestAnimateEmail = false;
        }
      )
    }
  }

}

// https://www.youtube.com/watch?v=ovnYGCwUe7U&list=PLLhsXdvz0qjJHtgs1b7nyue6GDcSXfJNA&index=15
// if(this.adminLoginForm.valid){
//   this._authService.signUp(email, password).subscribe(res=>{
//     console.log(res);
//   },
//   err =>{
//     console.log(err);
//   })
// }