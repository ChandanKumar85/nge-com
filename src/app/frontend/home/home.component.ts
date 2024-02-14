import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { map } from 'rxjs/operators';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginComponent } from '../auth/login/user-login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  filterData: any = [];
  products: any = [];
  key = this.activatedRoute.snapshot.params['id'];
  spinner = false;
  isLogedIn = false;
  catog: any;

  constructor(
    private dialog: MatDialog,
    private _prodService: ProdService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.suggestedProduct('womens-clothing');
  }

  tabData = [
    {label: "Women's"},
    {label: "Footwear"},
    {label: "Jewelery"}
  ]

  onChange(event: MatTabChangeEvent) {
    const tab = event.tab.textLabel;
    if(tab == "Women's"){
      this.catog = 'womens-clothing';
      this.suggestedProduct(this.catog);
    }
    else if(tab == "Footwear") {
      this.catog = 'footwear';
      this.suggestedProduct(this.catog);
    }
    else if(tab == "Jewelery") {
      this.catog = 'jewelery';
      this.suggestedProduct(this.catog);
    }
  }

  // suggested Product list
  suggestedProduct(category:string){
    this.spinner = true;
    this._prodService.getProdAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.filterData = data;
      this.products = [];
      this.filterData.forEach((x:any) => {
        if(category == x.category && this.key != x.id){
          this.products.push(x);
        }
      })
    })
    this.spinner = false;
  }

  loginState(state:any){
    if(state) {
      this.router.navigateByUrl('/wishlist');
    }
    else {
      this.dialog.open(UserLoginComponent, {
        panelClass: 'model-popup-login-form',
        disableClose: true
      });
    }
  }

}
