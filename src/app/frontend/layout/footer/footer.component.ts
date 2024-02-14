import { Component, OnInit } from '@angular/core';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/dashboard/interface/product';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  categories!: Product[];
  pageData:any;
  spinner = false;

  constructor(
    private _prodService: ProdService,
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

    this.spinner = true;
    this._prodService.getPageDetail("contact-us").snapshotChanges().subscribe(res => {
      this.pageData = { ...res.payload.data() as any };
      // console.log(this.pageData)
      this.spinner = false;
      },
      err => {
        console.debug(err);
      }
    )
  }

}
