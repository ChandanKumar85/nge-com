import { Injectable, SimpleChanges } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../common/authentication/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  checkUser: any;

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { 
    this._authService.adminUser.subscribe(res=>{
      if(res){
        this.checkUser = true;
        // console.log(res.id)
      }
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // throw new Error('Method not implemented.');
    if (this.checkUser) {
      return true;
    } else {
      this.router.navigate(['/admin'])
      return false;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }

}
