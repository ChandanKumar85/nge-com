import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';
import { config } from 'src/app/common/firebase-config';
import { AuthResponse } from '../interface/auth-response-interface';

import { Router } from '@angular/router';
import { ErrorService } from 'src/app/common/error.service';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { AdminUser } from 'src/app/dashboard/auth/auth-service/admin-user.model';
import { User } from 'src/app/frontend/auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  adminUser = new BehaviorSubject<AdminUser>(null!);
  _user = new BehaviorSubject<User>(null!);

  auth_Api = config.AUTH_URL;
  private tokenExpirationTimer : any;
  userIdDetail: any;

  constructor(
    private http:HttpClient,
    private _errService: ErrorService,
    private router: Router,
    private _prodService: ProdService,
  ) { }

  signIn(email: any, password: any){
    return this.http.post<AuthResponse>(`${this.auth_Api}:signInWithPassword?key=${config.API_KEY}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(err=>{
        return this._errService.handleError(err);
      }),
      tap(res=>{
        this.authenticatedAdminUser(res.email, res.localId, res.idToken, +res.expiresIn);
        // this._prodService.getUserDetail("admin_xYwpz-cxtA-detailDC", res.email).valueChanges().subscribe(resp=>{
        //   this.userIdDetail = resp;
        //   console.log(this.userIdDetail.Identifier)
        // })
      })
    )
  }

  autoSignIn(){
    const userData = JSON.parse(localStorage.getItem('userCred')!);
    if(!userData){
      return;
    }
    const loggedInUser = new AdminUser(userData.id, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loggedInUser.token) {
      this.adminUser.next(loggedInUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expirationDuration)
    }
  }

  signOut(){
    this.adminUser.next(null!);
    localStorage.removeItem("userCred");
    this.router.navigate(['/'])
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoSignOut(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration);
  }

  private authenticatedAdminUser(email: string, userId: string, token: string, expiresIn: any){
    const expirationDate = new Date(new Date().getTime()+expiresIn*1000);
    const userData = new AdminUser(email, userId, token, expirationDate);
    this.adminUser.next(userData); // Store data in User Subject
    this.autoSignOut(expiresIn*1000);
    // console.log('User => ', this.user.value)
    localStorage.setItem("userCred", JSON.stringify(userData));
  }

  forgetPassword(data: any){
    return this.http.post<any>(`${this.auth_Api}:sendOobCode?key=${config.API_KEY}`,{
      requestType: 'PASSWORD_RESET',
      email: data.email
    })
  }










  // User Sign in
  userSignIn(email: any, password: any){
    return this.http.post<AuthResponse>(`${this.auth_Api}:signInWithPassword?key=${config.API_KEY}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      tap(res=>{
        this.authenticatedUser(res.email, res.localId, res.idToken, +res.expiresIn)
      })
    )
  }

  // Create User profile For Frontend
  signUp(email: any, password: any){
    return this.http.post<AuthResponse>(`${this.auth_Api}:signUp?key=${config.API_KEY}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      tap(res=>{
        this.authenticatedUser(res.email, res.localId, res.idToken, +res.expiresIn)
      })
    )
  }

  private authenticatedUser(email: string, userId: string, token: string, expiresIn: any){
    const expiration_Date = new Date(new Date().getTime()+expiresIn*1000);
    const user = new User(email, userId, token, expiration_Date);
    this._user.next(user); // Store data in User Subject
    // this.autoSignOut(expiresIn*1000);
    console.log('User => ', this._user)
    // localStorage.setItem("userCred", JSON.stringify(userData));
  }

}

