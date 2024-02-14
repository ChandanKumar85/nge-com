import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ProdService } from 'src/app/common/app-service/prod.service';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {

  sliderData:any;

  constructor(
    public _prodService: ProdService,
  ) { }

  ngOnInit(): void {
    this._prodService.getHomeSlider().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.sliderData = data;
      // console.log(this.sliderData)
    });
  }

}
