import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { CategoryService } from '../../category.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-new-main-category',
  templateUrl: './new-main-category.component.html',
  styleUrls: ['./new-main-category.component.scss']
})
export class NewMainCategoryComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private snackbarService: MatSnackBar,
    private router: Router,
    private categoryService: CategoryService) { }

  URLS = URLS;
  loading: boolean = false;
  file_uploading: boolean = false;
  mobile_file_uploading: boolean = false;
  bannerFile: File;
  storeCurrency = environment.currency;
  vendors = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  previewImageSrc: string = "";
  previewMobileImageSrc: string = "";
  
  categoryForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
    slug: [''],
    banner_image: [null],
    alt_text: [''],
    mobile_banner_image:[null],
    commission_type: ['percentage'],
    commission_value: [null],
    is_active: [false],
    meta_data: this.fb.array([
      this.fb.group({
        field: [''],
        value: ['']
      })
    ])
  });

  addMetaField() {
    (this.categoryForm.get('meta_data') as FormArray).push(
      this.fb.group({
        field: [''],
        value: ['']
      })
    )
  }

  deleteMetaField(index) {
    (this.categoryForm.get('meta_data') as FormArray).removeAt(index);
  }

  bannerImageSelect(e) {
    const file = e.target.files[0];
    this.file_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.file_uploading = false;
      if(resp) {
        this.previewImageSrc = resp.data[0].cdn_link;
        this.categoryForm.patchValue({
          banner_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeBanner() {
    this.previewImageSrc = "";
    this.categoryForm.patchValue({
      banner_image: null
    });
  }


  mobileBannerImageSelect(e) {
    const file = e.target.files[0];
    this.mobile_file_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.mobile_file_uploading = false;
      if(resp) {
        this.previewMobileImageSrc = resp.data[0].cdn_link;
        this.categoryForm.patchValue({
          mobile_banner_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeMobileBanner() {
    this.previewMobileImageSrc = "";
    this.categoryForm.patchValue({
      mobile_banner_image: null
    });
  }


  onSubmit() {
    this.loading = true;
    this.categoryService.createMainCategory(this.categoryForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open('Category created.', "", {duration: 3000});
        this.router.navigate(['', URLS.categories]);
      }
    })
  }

  ngOnInit(): void {
  }

}
