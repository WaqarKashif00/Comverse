import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import URLS from 'src/app/shared/urls';
import { BrandsService } from '../brands.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private brandsService: BrandsService,
    private snackbarService: MatSnackBar,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS; 
  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];

  brandForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[^!"`'#%;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    image: [null, [Validators.required]],
    banner_image: [null],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
    main_category: [[]],
    sub_category: [[]],
    super_sub_category: [[]],
  });
  logo_uploading: boolean = false;
  banner_uploading: boolean = false;
  previewLogoImageSrc: string = "";
  previewBannerImageSrc: string = "";

  logoImageSelect(e) {
    const file = e.target.files[0];
    this.logo_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.logo_uploading = false;
      if(resp) {
        this.previewLogoImageSrc = resp.data[0].cdn_link;
        this.brandForm.patchValue({
          image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  bannerImageSelect(e) {
    const file = e.target.files[0];
    this.banner_uploading = true;
    this.sharedService.uploadMedia(file).then(resp => {
      this.banner_uploading = false;
      if(resp) {
        this.previewBannerImageSrc = resp.data[0].cdn_link;
        this.brandForm.patchValue({
          banner_image: resp.data[0].id
        });
        e.target.value = "";
      }
    });
  }

  removeLogo() {
    this.previewLogoImageSrc = "";
    this.brandForm.patchValue({
      image: null
    });
  }

  removeBanner() {
    this.previewBannerImageSrc = "";
    this.brandForm.patchValue({
      banner_image: null
    });
  }

  mapProductID(value) {
    return value.id;
  }

  mapCategoryID(value) {
    return value.category_id;
  }

  filterMainCategory(value) {
    return value.category_type == "main";
  }

  filterSubCategory(value) {
    return value.category_type == "sub";
  }

  filterSuperSubCategory(value) {
    return value.category_type == "superSub";
  }


  onCategorySelection(data) {
    this.mainCategoryID = data.filter(this.filterMainCategory).map(this.mapCategoryID);
    this.brandForm.patchValue({
      main_category: this.mainCategoryID
    })
    this.subCategoryID = data.filter(this.filterSubCategory).map(this.mapCategoryID);
    this.brandForm.patchValue({
      sub_category: this.subCategoryID
    })
    this.superSubCategoryID = data.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
    this.brandForm.patchValue({
      super_sub_category: this.superSubCategoryID
    })
  }


  onSubmit() {
    this.loading = true;
    this.brandsService.createBrand(this.brandForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open("Brand created successfully.", "", {duration: 3000});
        this.router.navigate(["/", URLS.brands]);
      }
    });
  }

  ngOnInit(): void {
  }

}
