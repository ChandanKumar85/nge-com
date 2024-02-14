import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { finalize, map } from 'rxjs/operators';
import { ProdService } from '../../../../common/app-service/prod.service';
import { Product } from '../../../interface/product';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  categories!: Product[];
  imgUrls : any = [];
  editProduct!: FormGroup;
  selectedImage : any = [];
  selectedStringImg : any = [];
  spinner : boolean = false;
  btnSpinner : boolean = false;
  submitted : boolean = false;
  prodPublist : boolean = true;
  imgUrl : string = "../../../assets/icons/prod.png";
  profImg: any;
  productId = this.activatedRoute.snapshot.params['id'];
  allImgUrls: any = [];
  newImgUrl: any = [];
  public Editor = ClassicEditor;
  storeedUrl : any;

  constructor(
    private _prodService: ProdService,
    public activatedRoute: ActivatedRoute, 
    public aFStorage: AngularFireStorage,
    private fb: FormBuilder, 
    private location: Location,
    private router: Router
  ) { }


  goBack() { this.location.back() }
  unsetProdImg(){ this.imgUrl = '../../../assets/icons/prod.png'; }
  get f(): { [key: string]: AbstractControl }{ return this.editProduct.controls; }
    
  ngOnInit(): void {
    this._prodService.getProdCatogery().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });

    // Edit Product
    this.editProduct = this.fb.group({
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

    // Fetch Product to edit
    if(this.productId){
      this.spinner = true;
      this._prodService.getProdDetail(this.productId).snapshotChanges().subscribe(res => {
          let product= { id: res.payload.id, ...res.payload.data() as Product };
          // this.editProduct.patchValue(product);
          this.storeedUrl = product.productImg;
          this.editProduct.patchValue({
            category: product.category,
            title: product.title,
            skuNumber: product.skuNumber,
            price: product.price,
            discount: product.discount,
            numOfItem: product.numOfItem,
            description: product.description,
            prodImg: product.productImg,
            productEnable: product.productEnable,
          });

          this.profImg = product;                 // Just call image thumbnail
          this.imgUrl = this.profImg.productImg;  // Just call image thumbnail
          this.imgUrls = product.productImg;
          this.spinner = false;

        },
        err => {
          console.log(err);
        }
      )
    }
    setTimeout(() => {
      console.log(this.storeedUrl)
    }, 3000);
  }

  removeThumb(id:any){
    let prodThumb: [] = this.imgUrls;
    prodThumb.splice(id, 1);
    this.selectedImage.splice(id, 1);
  }

  // Product Publish and Unpublish
  productPublish(){
    this.prodPublist = !this.prodPublist; 
  }

  // Add Product Images Section
  selectProdImg(event:any){
    if(event.target.files){
      for(let i=0; i<event.target.files.length; i++){
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (e:any) => {
          this.newImgUrl = e.target.result;
          let data = event.target.files[i];
          this.imgUrls.push(this.newImgUrl)
          this.selectedImage.push(data);
        }
      }
    }else {
      this.unsetProdImg();
    }
  }

  onSubmit(editProduct: Product){
    this.submitted = true;
    if(this.editProduct.valid) {
      if(editProduct.productImg.valueOf()){
        console.warn("Image Selected");
        this.btnSpinner = true;
        for(let i=0; i<this.selectedImage.length; i++){
          let filePath = `${this._prodService.fbImagePath()}${editProduct.category}/_${this.selectedImage[i].name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
          const fileRef = this.aFStorage.ref(filePath);
          this.aFStorage.upload(filePath,this.selectedImage[i]).snapshotChanges().pipe(
            finalize(()=>{
              fileRef.getDownloadURL().subscribe((url)=>{
                this.allImgUrls.push(url);
                if(this.allImgUrls.length === this.selectedImage.length){
                  this.editProduct.value.productImg = this.allImgUrls;
                  console.log(this.allImgUrls)

                  // this.editProduct.get('prodImg')?.disable();
                  // this._prodService.updateProd(this.productId, this.editProduct.value)
                  // .then(()=>{
                  //   this.submitted = false;
                  //   this.btnSpinner = false;
                  //   this.imgUrl = "../../../assets/icons/prod.png";
                  //   this.editProduct.reset();
                  //   this.router.navigateByUrl('/admin/products');
                  // })
                  // .catch(err => {
                  //   console.error('Error Updating Data...',err)
                  // })

                }

              })
            })
          ).subscribe();
        }
      }
      else {
        console.log("Text Changes");
        this.btnSpinner = true;
        this.editProduct.get('prodImg')?.disable();
        this.editProduct.get('productImg')?.disable();
        this._prodService.updateProd(this.productId, this.editProduct.value)
        .then(()=>{
          this.submitted = false;
          this.btnSpinner = false;
          this.imgUrl = "../../../assets/icons/prod.png";
          this.editProduct.reset();
          this.router.navigateByUrl('/admin/products');
        })
        .catch(err => {
          console.error('Error Updating Data...',err)
        })
      }
    }
  }

}