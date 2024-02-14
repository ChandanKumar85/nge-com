import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { finalize, map } from 'rxjs/operators';
import { ProdService } from 'src/app/common/app-service/prod.service';
import { Product } from '../../interface/product';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

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
  productId = this.activatedRoute.snapshot.params['id'];
  
  constructor(
    private _prodService: ProdService,
    public aFStorage: AngularFireStorage,
    public activatedRoute: ActivatedRoute, 
    private fb: FormBuilder,
    private location: Location,
    private router: Router
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
      category      : ['', [Validators.required]],
      title         : ['', [Validators.required, Validators.minLength(3)]],
      skuNumber     : ['', [Validators.required, Validators.minLength(16)]],
      price         : [  , [Validators.required, Validators.minLength(2)]],
      discount      : ['', [Validators.required]],
      numOfItem     : [  , [Validators.required]],
      description   : ['', [Validators.required, Validators.minLength(20)]],
      productImg    : [''],
      prodImg       : [''],
      productEnable : [false],
      quantity      : [1],
    })

    this.editMode();

  }


  editMode(){
    // Fetch Product to edit
    if(this.productId){
      this._prodService.getProdDetail(this.productId).snapshotChanges().subscribe(res => {
          let product= { id: res.payload.id, ...res.payload.data() as Product };
          this.addProductForm.patchValue({
            category: product.category,
            title: product.title,
            skuNumber: product.skuNumber,
            price: product.price,
            discount: product.discount,
            numOfItem: product.numOfItem,
            description: product.description,
            prodImg: product.productImg,
            productEnable: product.productEnable,
            quantity: product.quantity
          })
          this.imgUrls = product.productImg;
        },
        err => {
          console.log(err);
        }
      )
    }
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
      if(addProductForm.productImg.valueOf()){
        this.spinner = true;
        console.log("Image Changes");
        this.addProductForm.get('productImg')?.disable();
        for(let i=0; i<this.prodImgThumb.length; i++){
          let filePath = `${this._prodService.fbImagePath()}${addProductForm.category}/_${this.prodImgThumb[i].name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
          const fileRef = this.aFStorage.ref(filePath);
          this.aFStorage.upload(filePath,this.prodImgThumb[i]).snapshotChanges().pipe(
            finalize(()=>{
              fileRef.getDownloadURL().subscribe(url=>{
                this.allUrls.push(url);
                if(this.allUrls.length === this.prodImgThumb.length){
                  this.addProductForm.value.productImg = this.allUrls;
                  console.log(this.allUrls)

                  this._prodService.updateProd(this.productId, this.addProductForm.value)
                  .then(()=>{
                    this.spinner = false;
                    this.imgUrls = null;
                    this.submitted = false;
                    this.router.navigateByUrl('/admin/products');
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
      else {
        console.log("Text Changes");
        this.spinner = true;
        this.addProductForm.get('prodImg')?.disable();
        this.addProductForm.get('productImg')?.disable();
        this._prodService.updateProd(this.productId, this.addProductForm.value)
        .then(()=>{
          this.submitted = false;
          this.spinner = false;
          this.router.navigateByUrl('/admin/products');
        })
        .catch(err => {
          console.error('Error Updating Data...',err)
        })
      }
    }
  }

}