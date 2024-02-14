import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProdService } from 'src/app/common/app-service/prod.service';

@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.scss']
})
export class EditSliderComponent implements OnInit {

  @ViewChild('confDialog')
  confDialog!: TemplateRef<any>;
  addSliderForm!: FormGroup;
  submitted:boolean = false;
  spinner:boolean = false;
  selectedImg:any = null;
  sliderId: any;
  sliderImageVal:string = '';
  imgUrl : string = "../../../assets/icons/prod.png";

  constructor(
    private fb:FormBuilder, 
    public _prodService: ProdService,
    public aFStorage: AngularFireStorage
  ) { 
    this.editForm();
    this._prodService.editSliderSubject.subscribe(res=>{
      this.sliderId = res.id;
      this.addSliderForm.patchValue({
        title: res.title,
        description: res.description,
        URL: res.URL,
        editSliderImage: res.sliderImage
      })
      this.sliderImageVal = res.sliderImage;
      this.imgUrl = res.sliderImage;
    })
  }

  get f() : { [key: string]: AbstractControl }{ return this.addSliderForm.controls; }

  ngOnInit(): void {
    
  }

  editForm(){
    this.addSliderForm = this.fb.group({
      title           : ['', [Validators.required, Validators.minLength(3)]],
      description     : ['', [Validators.required, Validators.minLength(3)]],
      URL             : ['', [Validators.required]],
      sliderImage     : [''],
      editSliderImage : ['']
    })
  }

  // Select Product Images
  selectProdImg(event:any){
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e:any) => {
        this.imgUrl = e.target.result;
        this.selectedImg = event.target.files[0];
      }
    }
  }

  
  onSubmit(){
    this.submitted = true;
    if(this.addSliderForm.valid) {
      this.spinner = true;
      if (this.selectedImg != null) {
        console.log("Not null");
        let filePath = `${this._prodService.fbSliderImgPath()}${'banner_slider'}/_${this.selectedImg?.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.aFStorage.ref(filePath);
        this.aFStorage.upload(filePath,this.selectedImg).snapshotChanges().pipe(
          finalize(()=>{
            fileRef.getDownloadURL().subscribe(url=>{
              this.addSliderForm.value.sliderImage = url;
              this._prodService.editHomeSlider(this.sliderId, this.addSliderForm.value)
              .then(()=>{
                this.submitted = false;
                this.spinner = false;
                this.imgUrl = "../../../assets/icons/prod.png";
                this.addSliderForm.reset();
              })
              .catch(err => {
                console.error('Error Updating Data...',err)
              })
            })
          })
        ).subscribe()
      } else {
        console.log("is null")
        this.addSliderForm.value.sliderImage = this.sliderImageVal;
        this._prodService.editHomeSlider(this.sliderId, this.addSliderForm.value)
        .then(()=>{
          this.submitted = false;
          this.spinner = false;
          this.imgUrl = "../../../assets/icons/prod.png";
          this.addSliderForm.reset();
        })
        .catch(err => {
          console.error('Error Updating Data...',err)
        })
      }
    }
  }
}