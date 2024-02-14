import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../common/authentication/auth-service/auth.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isLoggedIn : boolean = false;
  title: any;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._authService.adminUser.subscribe(res=>{
      if(res == null){
        this._router.navigate(['admin']);
      }
    })

    if(localStorage.getItem('userCred') != null){
      this.title = JSON.parse(localStorage.getItem('userCred')!).email.charAt(0);
    }
  }

  onSignOut(){
    this._authService.signOut();
  }

}
