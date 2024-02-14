import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProdService } from 'src/app/common/app-service/prod.service';

@Component({
  selector: 'app-add-slider',
  templateUrl: './add-slider.component.html',
  styleUrls: ['./add-slider.component.scss']
})
export class AddSliderComponent implements OnInit {

  @ViewChild('confDialog')
  confDialog!: TemplateRef<any>;
  addSliderForm!: FormGroup;
  submitted = false;
  spinner = false;
  selectedImg:any = null;
  imgUrl : string = "../../../assets/icons/prod.png";

  constructor(
    private fb:FormBuilder, 
    public _prodService: ProdService,
    public aFStorage: AngularFireStorage
  ) { }

  get f() : { [key: string]: AbstractControl }{ return this.addSliderForm.controls; }

  ngOnInit(): void {
    this.addSliderForm = this.fb.group({
      title           : ['', [Validators.required, Validators.minLength(3)]],
      description     : ['', [Validators.required, Validators.minLength(3)]],
      URL             : ['', [Validators.required]],
      sliderImage     : ['', [Validators.required]]
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
      };
    }
  }

  onSubmit(){
    this.submitted = true;
    if(this.addSliderForm.valid) {
      this.spinner = true;
      let filePath = `${this._prodService.fbSliderImgPath()}${'banner_slider'}/_${this.selectedImg?.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.aFStorage.ref(filePath);
      this.aFStorage.upload(filePath,this.selectedImg).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe(url=>{
            this.addSliderForm.value.sliderImage = url;
            this._prodService.addSlider(this.addSliderForm.value)
            .then(()=>{
              this.submitted = false;
              this.spinner = false;
              this.imgUrl = "../../../assets/icons/prod.png";
              this.addSliderForm.reset();
            })
            .catch((err: any)=>{
              console.error('Error Updating Data...', err)
            })
          })
        })
      ).subscribe()
    }
  }

}
