import { Component } from '@angular/core';
import { AuthService } from './common/authentication/auth-service/auth.service';



@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
  // templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
})
export class AppComponent {  
  
  constructor(
    private _authService: AuthService
  ){

  }

  ngOnInit(): void {
    this._authService.autoSignIn();    
  }

}
