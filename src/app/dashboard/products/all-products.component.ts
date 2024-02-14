import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ProdService } from '../../common/app-service/prod.service';
import { Product } from '../interface/product';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

  @ViewChild('confDialog')
  confDialog!: TemplateRef<any>;
  products!: Product[];
  categories!: Product[];
  selectedCategory:any;
  productData: any;
  spinner = false;
  

  constructor(
    private _prodService: ProdService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Fetch All Catogery
    this._prodService.getProdCatogery().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });
    
    this.getProductList();

  }

  // Fetch All Data
  getProductList(){
    this.spinner = true;
    this._prodService.getProdAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      this.spinner = false;
      this.selectedCategory = this.products;
    },
    (err: any) => { console.log(err) }
    );
  }

  // Confirm Dialog box for delete product
  dialogModel(prod: any) {
    const dialogRef = this.dialog.open(this.confDialog, {
      panelClass: 'model-popup-box',
      maxWidth: '500px',
      minWidth: '350px'
    });
    this.productData = prod;
  }

  // Delete One by One data
  deleteProd(productId:any){
    this._prodService.deleteProduc(productId);
    // this._prodService.addToRecycle(productId);
    // console.log(productId)
  }

  // Active or Disabled product by checkbox
  updateActive(prod: any, isActive: boolean){
    console.log(isActive);
    this._prodService.updateProdStatus(prod.id, { productEnable: isActive });
    // if(isActive){
      
    // }else {
    //   this._prodService.updateProdStatus(prod.id, { productEnable: !isActive });
    //   this._prodService.addToRecycle(prod);
    //   this._prodService.deleteProduc(prod.id);
    // }
  }






  onCategoryChange(event: Event){
    let evn = (event.target as HTMLSelectElement).value
    if(evn != 'all'){
      this.selectedCategory = this.products.filter(x => x.category == evn);
    } else {
      this.selectedCategory = this.products;
    }
  }

  gitProdTrackBy(index:number, selectedCategory:any){
    return selectedCategory.id;
  }

}

