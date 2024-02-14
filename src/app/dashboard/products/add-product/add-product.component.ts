import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { finalize, map } from 'rxjs/operators';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { Product } from '../../interface/product';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  categories!: Product[]; 
  prodImgThumb : any = [];
  imgUrls : any = [];
  addProductForm!: FormGroup;
  selectedImage:any = null;
  spinner = false;
  submitted = false;
  imgUrl : string = "../../../assets/icons/prod.png";
  allUrls: any[] = [];
  prodPublist : boolean = false;
  public Editor = ClassicEditor;
  
  constructor(
    private _prodService: ProdService,
    public aFStorage: AngularFireStorage,
    private fb: FormBuilder,
    private location: Location
  ) { }

  goBack() { this.location.back() }
  unsetProdImg(){ this.imgUrl = '../../../assets/icons/prod.png'; this.selectedImage = null; }
  get f() : { [key: string]: AbstractControl }{ return this.addProductForm.controls; }
  productPublish(){ 
    this.prodPublist = !this.prodPublist; 
  } // Product Publish and Unpublish

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

    // Form data validation
    this.addProductForm = this.fb.group({
      category      : [null, [Validators.required]],
      title         : [null, [Validators.required, Validators.minLength(3)]],
      skuNumber     : [null, [Validators.required, Validators.minLength(16)]],
      price         : [null, [Validators.required, Validators.minLength(2)]],
      discount      : [null, [Validators.required]],
      numOfItem     : [null, [Validators.required]],
      description   : [null, [Validators.required, Validators.minLength(20)]],
      productImg    : [null, [Validators.required]],
      productEnable : [false],
      quantity      : [1]
    })
  }

  // Add Product Images Section
  selectProdImg(event:any){
    if(event.target.files){
      for(let i=0; i<event.target.files.length; i++){
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (e:any) => {
          this.imgUrl = e.target.result;
          this.selectedImage = event.target.files[i];
          this.prodImgThumb.push(this.selectedImage);
          this.imgUrls.push(this.imgUrl);
        };
      }
      // console.log(this.imgUrls)
    } else {
      this.unsetProdImg();
    }
  }
  
  removeThumb(id:number){
    let prodThumb: [] = this.imgUrls;
    prodThumb.splice(id, 1);
    this.prodImgThumb.splice(id, 1);
    if(this.imgUrls.length < 1) {
      this.addProductForm.get('productImg')?.setValue(null);
    }
  }
  
  // Submit form for create product
  onSubmit(addProductForm: Product){
    this.submitted = true;
    if(this.addProductForm.valid) {
      this.spinner = true;
      // const str = this.addProductForm.value.title;
      // const prodUrl = str.replace(/[^A-Z0-9]+/ig, '-');
      // console.log(str)
      for(let i=0; i<this.prodImgThumb.length; i++){
        let filePath = `${this._prodService.fbImagePath()}${addProductForm.category}/_${this.prodImgThumb[i].name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.aFStorage.ref(filePath);
        this.aFStorage.upload(filePath,this.prodImgThumb[i]).snapshotChanges().pipe(
          finalize(()=>{
            fileRef.getDownloadURL().subscribe(url=>{
              this.allUrls.push(url);
              if(this.allUrls.length === this.prodImgThumb.length){
                this.addProductForm.value.productImg = this.allUrls;
                // this.addProductForm.value.url = prodUrl.toLowerCase();
                this._prodService.addProd(this.addProductForm.value)
                .then(()=>{
                  this.spinner = false;
                  this.imgUrls = null;
                  this.submitted = false;
                  this.addProductForm.reset();
                })
                .catch((err: any) => {
                  console.error('Error Updating Data...',err)
                })
              }
            })
          })
        ).subscribe()
      }
    }
  }

}