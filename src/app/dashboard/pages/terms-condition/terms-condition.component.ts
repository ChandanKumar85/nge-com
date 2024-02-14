import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdService } from 'src/app/common/app-service/prod.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {

  pageData:any;
  updatePage!: FormGroup;
  spinner : boolean = false;
  submitted : boolean = false;
  public Editor = ClassicEditor;
  pagePath:string = 'terms-conditions'

  constructor(
    public _prodService: ProdService,
    private fb: FormBuilder, 
  ) { 

    this.editPageDetail();
    this._prodService.getPageDetail(this.pagePath).snapshotChanges().subscribe(res => {
      this.pageData = { ...res.payload.data() as any };
      this.updatePage.patchValue({
        title: this.pageData.title,
        description: this.pageData.description,
      })
      // console.log(this.pageData.description)
      },
      err => {
        console.debug(err);
      }
    )
  }

  get f(): { [key: string]: AbstractControl }{ return this.updatePage.controls; }

  ngOnInit(): void {
    
  }

  editPageDetail(){
    this.updatePage = this.fb.group({
      title         : ['', [Validators.required, Validators.minLength(3)]],
      description   : ['', [Validators.required]],
    })
  }

  onSubmit(){
    this.submitted = true;
    if (this.updatePage.valid) {
      this.spinner = true;
      this._prodService.editPageDetail(this.pagePath, this.updatePage.value)
      .then(() => {
        this.spinner = false;
      })
      .catch(err => {
        console.error('Error Updating Data...',err)
      })
    }
  }

}
