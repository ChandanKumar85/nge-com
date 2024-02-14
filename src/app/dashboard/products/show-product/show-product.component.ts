import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProdService } from '../../../common/app-service/prod.service';
import { Product } from '../../interface/product';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.scss']
})
export class ShowProductComponent implements OnInit {

  @ViewChild('confDialog')
  confDialog!: TemplateRef<any>;
  product: any;
  spinner = false;

  constructor(
    private _prodService: ProdService,
    public activatedRoute: ActivatedRoute, 
    private location: Location,
    private dialog: MatDialog
  ) { }

  goBack() {
    this.location.back();
  }
  
  ngOnInit(): void {
    this.spinner = true;
    let key = this.activatedRoute.snapshot.params['id'];
    this._prodService.getProdDetail(key).snapshotChanges().subscribe(res => {
        this.product= { id: res.payload.id, ...res.payload.data() as Product };
        this.spinner = false;
        // console.log(this.product)
      },
      err => {
        console.debug(err);
      }
    )
  }

  // Confirm Dialog box for delete product
  dialogModel() {
    const dialogRef = this.dialog.open(this.confDialog, {
      panelClass: 'model-popup-box',
      maxWidth: '450px',
      minWidth: '300px'
    });
  }

  // Delete One by One data
  deleteProd(productId:any){
    this._prodService.deleteProduc(productId);
    this.location.back();
    // this._prodService.addToRecycle(productId);
    // console.log(productId)
  }

}