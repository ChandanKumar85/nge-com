import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdService } from '../../common/app-service/prod.service';
import { UtilityService } from '../../common/app-service/utility.service';
import { map } from 'rxjs';
import { Category } from '../interface/category';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  addCategoryForm!: FormGroup;
  category!: Category[];
  submitted = false;
  spinner:boolean = false;
  btnSpinner:boolean = false;

  constructor(
    private fb:FormBuilder, 
    public _prodService: ProdService,
    private _utilityService: UtilityService,
  ) { }

  get f() : { [key: string]: AbstractControl }{ return this.addCategoryForm.controls; }

  ngOnInit(): void {
    
    // Fetch All Category
    this.spinner = true;
    this._prodService.getProdCatogery().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.category = data;
      this.spinner = false;
    });

    this.addCategoryForm = this.fb.group({
      title : ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required, Validators.minLength(3)]]
    })

  }


  onSubmit(){
    this.submitted = true;
    if (this.addCategoryForm.valid) {
      this.btnSpinner = true;
      this._prodService.addCategory(this.addCategoryForm.value).then(() => {
        this.submitted = false;
        this.btnSpinner = false;
        this.addCategoryForm.reset();
      });
      this._utilityService.openSnackBar(`${this.addCategoryForm.value.title} Category Created Successfully`);
    }
  }

  // Active or Disabled Category by checkbox
  updateCategoryStat(id: string, isActive: boolean){
    this._prodService.updateCategoryStatus(id, { productEnable: isActive })
  }

  // Delete One by One Category
  deleteCategory(category:any){
    this._prodService.deleteCategory(category.id);
    this._utilityService.openSnackBar(`${category.title} Deleted Successfully`);
  }

}
