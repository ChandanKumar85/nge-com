import { Component, OnInit } from '@angular/core';
import { ProdService } from '../../../../common/app-service/prod.service';
import { Product } from '../../../../dashboard/interface/product';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html'
  // styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {

  categories!: Product[];
  products!: Product[];

  constructor(
    private _prodService: ProdService
  ) { }

  ngOnInit(): void {
    // Fetch All Category
    
  }

}
