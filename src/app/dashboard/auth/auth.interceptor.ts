import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "../../common/authentication/auth-service/auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _authService: AuthService
    ){}

    intercept(req:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this._authService.adminUser.pipe(
            take(1),
            exhaustMap((user:any) => {
                if(!user){
                    // console.log("iff ===>", user);
                    return next.handle(req);
                }
                else {
                    let modifiedReq = req.clone({
                        params: new HttpParams().set('auth', user.token)
                    })
                    // console.log("Else ===>", modifiedReq);
                    return next.handle(modifiedReq);
                }
            })
        )
    }


}