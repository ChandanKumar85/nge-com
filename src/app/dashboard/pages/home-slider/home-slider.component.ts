import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { AddSliderComponent } from './add-slider/add-slider.component';
import { EditSliderComponent } from './edit-slider/edit-slider.component';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {

  @ViewChild('confDialog')
  confDialog!: TemplateRef<any>;
  spinner = false;
  sliderData:any;
  dilogData: any;

  constructor(
    public _prodService: ProdService,
    private dialog: MatDialog
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
    });
  }

  // Confirm Dialog box for delete product
  deleteDialog(item:any) {
    const dialogRef = this.dialog.open(this.confDialog, {
      panelClass: 'model-popup-box',
      maxWidth: '500px',
      minWidth: '350px'
    });
    this.dilogData = item;
  }

  // Delete Slider one by one
  deleteSlider(item:any){
    console.log(item)
    this._prodService.deleteHomeSlider(item);
  }

  addSliderDialog() {
    const addDialogRef = this.dialog.open(AddSliderComponent, {
      panelClass: 'model-slider-box',
      width: '800px',
    });
    // addDialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    // });
  }

  editSliderDialog(data:any) {
    const addDialogRef = this.dialog.open(EditSliderComponent, {
      panelClass: 'model-slider-box',
      width: '800px',
    });
    addDialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
    this._prodService.editSliderSubject.next(data);
  }

}
