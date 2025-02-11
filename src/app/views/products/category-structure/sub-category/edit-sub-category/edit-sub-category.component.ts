import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-edit-sub-category',
  templateUrl: './edit-sub-category.component.html',
  styleUrls: ['./edit-sub-category.component.scss']
})
export class EditSubCategoryComponent implements OnInit {

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: MatSnackBar) {
    this.categoryID = this.route.snapshot.paramMap.get('id');
  }

  URLS = URLS;
  loading: boolean = true;
  file_uploading: boolean = false;
  thumbnail_uploading: boolean = false;
  mobile_file_uploading: boolean = false;
  previewMobileImageSrc: string = "";
  categoryID = null;
  bannerFile: File;
  previewImageSrc: string = "";
  previewThumbnailSrc: string = "";
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  categoryForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    description: [''],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
    banner_image: [null],
    alt_text: [''],
    thumbnail_image: [null],
    is_active: [false],
    main_category: [null],
    mobile_banner_image:[null],
    commission_type: ['percentage'],
    commission_value: [null],
    meta_data: this.fb.array([])
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

  thumbnailImageSelect(e) {
    const file = e.target.files[0];
    this.thumbnail_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.thumbnail_uploading = false;
      if(resp) {
        this.previewThumbnailSrc = resp.data[0].cdn_link;
        this.categoryForm.patchValue({
          thumbnail_image: resp.data[0].id
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

  removeThumbnail() {
    this.previewThumbnailSrc = "";
    this.categoryForm.patchValue({
      thumbnail_image: null
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

  getCategoryDetail() {
    this.loading = true;
    this.categoryService.getSubCategoryDetail(this.categoryID).then(resp =>{
      this.loading = false;
      if(resp) {
        let data = resp.data;
        let banner_image = data.banner_image;
        let thumbnail_image = data.thumbnail_image;
        let mobile_banner_image = data.mobile_banner_image;
        if(data.meta_data.length) {
          for (let i = 0; i < data.meta_data.length; i++) {
            this.addMetaField()
          }
        }
        if(data.banner_image) {
          data.banner_image = banner_image.id;
          this.previewImageSrc = banner_image.cdn_link;
        }
        if(data.thumbnail_image) {
          data.thumbnail_image = thumbnail_image.id;
          data.alt_text = mobile_banner_image.alt_text
          this.previewThumbnailSrc = thumbnail_image.cdn_link;
        }


        if(data.mobile_banner_image) {
          data.mobile_banner_image = mobile_banner_image.id;
          this.previewMobileImageSrc = mobile_banner_image.cdn_link;
        }
        this.categoryForm.patchValue(data);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.categoryService.updateSubCategory(this.categoryForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Category updated.", "", {duration: 3000});
        this.router.navigate(["/", URLS.categories]);
      }
    })
  }

  ngOnInit(): void {
    this.getCategoryDetail();
  }

}
