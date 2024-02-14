import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Category } from '../../dashboard/interface/category';
import { Product } from '../../dashboard/interface/product';


@Injectable({
  providedIn: 'root'
})
export class ProdService {

  private dbrecyclePath     = '/recycle';
  private dbCatogeryPath    = '/category';
  private dbProdPath        = '/products';
  private dbhomeSlider      = '/slider';
  private dbAllPages        = '/pages';
  private users             = '/users';
  
  fbImagePath(){ return `products/`; } //firebase image storage
  fbSliderImgPath(){ return `slider/`; } //firebase image storage

  editSliderSubject = new Subject<any>();

  constructor(
    private afs: AngularFirestore
  ){ }

  // Get User Detail
  getUserDetail(uDetail:any, userId: string) {
    return this.afs.collection(uDetail).doc(userId);
  }

  // Fetch product Catogery list
  getProdCatogery(): AngularFirestoreCollection<Product> {
    return this.afs.collection(this.dbCatogeryPath);
  }

  // Fetch All product list
  getProdAll(): AngularFirestoreCollection<Product> {
    return this.afs.collection(this.dbProdPath);
  }

  // Fetch One product detail
  getProdDetail(productId: string) {
    return this.afs.collection(this.dbProdPath).doc(productId);
  }

  // Delete Product one by one
  deleteProduc(productId: string): Promise<void> {
    return this.afs.collection(this.dbProdPath).doc(productId).delete();
  }

  // Update Product Status
  updateProdStatus(productId: string, isActive: any): Promise<void> {
    return this.afs.collection(this.dbProdPath).doc(productId).update(isActive);
  }

  // Add Product
  addProd(addProduct: Product): any {
    return this.afs.collection(this.dbProdPath).add({ ...addProduct });
  }

  // Update Product
  updateProd(productId: string, addProduct: Product): Promise<void> {
    return this.afs.collection(this.dbProdPath).doc(productId).update(addProduct);
  }





  // public _userDataSubject = new BehaviorSubject<any>('');
  // set setUserDataSubject(val:any){this._userDataSubject.next(val)}
  // get getUserDataSubject(){return this._userDataSubject}

  // Add Home Slider
  addSlider(addslider: any): any {
    return this.afs.collection(this.dbhomeSlider).add({ ...addslider });
  }
  // Fetch Home Slider
  getHomeSlider(): AngularFirestoreCollection<any> {
    return this.afs.collection(this.dbhomeSlider);
  }
  // Delete Home Slider
  deleteHomeSlider(sliderId: string): Promise<void> {
    return this.afs.collection(this.dbhomeSlider).doc(sliderId).delete();
  }
  // Edit Home Slider
  editHomeSlider(id: string, data: any): Promise<void> {
    return this.afs.collection(this.dbhomeSlider).doc(id).update(data);
  }


  // Get CMS page detail data
  getPageDetail(productId: string) {
    return this.afs.collection(this.dbAllPages).doc(productId);
  }
  editPageDetail(id: string, data: any): Promise<void> {
    return this.afs.collection(this.dbAllPages).doc(id).set(data);
  }




  // Add User
  userAdd(user: any): any {
    return this.afs.collection(this.users).add({ ...user });
  }




  // Add to recycle bin
  addToRecycle(addProduct: Product): any {
    return this.afs.collection(this.dbrecyclePath).add({ ...addProduct });
  }

  // Fetch All Trash product list
  getRecycleData(): AngularFirestoreCollection<Product> {
    return this.afs.collection(this.dbrecyclePath);
  }


  // ==========================  Category  ================================= //
  // Update Category Status
  updateCategoryStatus(productId: string, isActive: any): Promise<void> {
    return this.afs.collection(this.dbCatogeryPath).doc(productId).update(isActive);
  }

  // Delete Category
  deleteCategory(categoryId: string): Promise<void> {
    return this.afs.collection(this.dbCatogeryPath).doc(categoryId).delete();
  }

  // Add Category
  addCategory(addCategory: Category): any {
    return this.afs.collection(this.dbCatogeryPath).add({
      ...addCategory,
      productEnable: true
    });
  }


  // =====================================[ Cart Product ]=====================================>
  
  // Get Cart Product
  getCartAll(): AngularFirestoreCollection<Product> {
    return this.afs.collection('/cart');
  }

  // Create Cart Product
  addToCart(addToCart: Product): any {
    return this.afs.collection('/cart').add({ ...addToCart });
  }

  // Delete Cart Product
  deleteCartProd(cartProdId: string): Promise<void> {
    return this.afs.collection(`cart/${cartProdId}`).doc(cartProdId).delete();
  }


}