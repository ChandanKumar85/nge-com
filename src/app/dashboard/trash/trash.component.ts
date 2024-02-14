import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ProdService } from '../../common/app-service/prod.service';
import { Product } from '../interface/product';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {



  products!: Product[];
  spinner = false;
  

  constructor(
    private _prodService: ProdService,
  ) { }

  ngOnInit(): void { 
    this.getProductList();

  }

  // Fetch All Data
  getProductList(){
    this.spinner = true;
    this._prodService.getRecycleData().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      this.spinner = false;
    },
    (err: any) => { console.log(err) }
    );
  }

}
