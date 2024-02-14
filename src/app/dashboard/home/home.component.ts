import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize, map } from 'rxjs';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { UtilityService } from 'src/app/common/app-service/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('confDialog')
  confDialog!: TemplateRef<any>;
  addSliderForm!: FormGroup;
  submitted = false;
  spinner = false;
  selectedImg:any = null;
  sliderImg : any = [];
  imgUrl : string = "../../../assets/icons/prod.png";
  sliderData:any;
  prodData: any;
  editData :any;
  sliderId: any;
  editMode: boolean = false;

  constructor(
    private fb:FormBuilder, 
    public _prodService: ProdService,
    public aFStorage: AngularFireStorage,
    private dialog: MatDialog
  ) { }

  
  get f() : { [key: string]: AbstractControl }{ return this.addSliderForm.controls; }
  removeThumb(){ this.imgUrl = "../../../assets/icons/prod.png"; }

  ngOnInit(): void {
    this.addSliderForm = this.fb.group({
      title           : ['', [Validators.required, Validators.minLength(3)]],
      description     : ['', [Validators.required, Validators.minLength(3)]],
      URL             : ['', [Validators.required]],
      sliderImage     : ['', [Validators.required]]
    })
    this.fetchSlider();

    // this._prodService.getUserDataSubject.subscribe((res:any)=>{
    //   this.editData = res;
    //   this.patchForm();
    // })

  }

  fetchSlider(){
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
  dialogModel(item:any) {
    const dialogRef = this.dialog.open(this.confDialog, {
      panelClass: 'model-popup-box',
      maxWidth: '500px',
      minWidth: '350px'
    });
    this.prodData = item;
  }

  deleteSlider(item:any){
    this._prodService.deleteHomeSlider(item);
  }


  // patchForm(){
  //   const {
  //     title,
  //     description,
  //     URL
  //   } = this.editData;
  //   this.addSliderForm.patchValue({
  //     title,
  //     description,
  //     URL
  //   })
  // }

  // Add Product Images Section
  selectProdImg(event:any){
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e:any) => {
        this.imgUrl = e.target.result;
        this.selectedImg = event.target.files[0];
        this.sliderImg.push(this.selectedImg);
      };
    }
  }

  editSlider(item:any){
    // this.editMode = true;
    // setTimeout(() => {
      
    // }, 10);
    // this.imgUrl = item.sliderImage;
    // this.sliderId = item.id;
    // this._prodService.setUserDataSubject = item;
  }

  onSubmit(){
    this.submitted = true;
    if(this.addSliderForm.valid) {
        console.log("Add Slider mode")
        this.spinner = true;
        let filePath = `${this._prodService.fbSliderImgPath()}${'banner_slider'}/_${this.sliderImg[0].name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.aFStorage.ref(filePath);
        this.aFStorage.upload(filePath,this.sliderImg[0]).snapshotChanges().pipe(
          finalize(()=>{
            fileRef.getDownloadURL().subscribe(url=>{
              this.addSliderForm.value.sliderImage = url;
              this._prodService.addSlider(this.addSliderForm.value);
              this.addSliderForm.reset();
              this.spinner = false;
            })
          })
        ).subscribe()



        
      // }
      // else {
      //   console.log("Edit Slider mode")
      //   this.aFStorage.upload(filePath,this.sliderImg[0]).snapshotChanges().pipe(
      //     finalize(()=>{
      //       fileRef.getDownloadURL().subscribe(url=>{
      //         this.addSliderForm.value.sliderImage = url;
      //         this._prodService.editHomeSlider(this.sliderId, this.addSliderForm.value);
      //         this.addSliderForm.value.sliderImage = '';
      //         this.submitted = false;
      //         this.addSliderForm.reset();
      //         this.removeThumb();
      //         this.spinner = false;
      //       })
      //     })
      //   ).subscribe()

    }
  }
}




