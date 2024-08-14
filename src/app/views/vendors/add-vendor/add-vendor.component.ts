import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { VendorsService } from '../vendors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { CategorySelectorDialogComponent } from 'src/app/shared/category-selector-dialog/category-selector-dialog.component';
import { BrandsService } from '../../products/brands/brands.service';


@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private snackbar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private brandsService: BrandsService,

  ) { }

  loading: boolean  = false 
  URLS = URLS;
  commission_type_check:any;
  storeCurrency = environment.currency;
  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];
  removable: boolean = true;
  categoriesTags:any[] = [];
  brands = [];

  vendorForm = this.fb.group({
    name: ["", [Validators.required, Validators.pattern(/^[^!"`'#%;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    email: ["", [Validators.email]],
    phone: ["", [Validators.pattern(/^[^!"`'#%;<>={}~\$\(\)\*\/\\\?\[\]\^\|]+$/)]],
    city: ["", [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    address: ["", [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    license_number: [null],
    commissions:this.fb.array([]),
    notes: ["", [Validators.pattern(/^[^!"`'#%;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    is_active: [true],
    is_approval: [false],
    is_d2c: [false],
    is_offline: [false],
    d2c_payment_status: [''],
    d2c_failure_status: [''],
    product_approval: [false],
    product_group_approval: [false],
    collection_approval: [false],
    discount_approval: [false],
    shipping_approval: [false],
    main_category: [[]],
    sub_category: [[]],
    super_sub_category: [[]],
    brands: [[]],
    type: [""]
  });




  addCommission() {
    (this.vendorForm.get("commissions") as FormArray).push(
      this.fb.group({
        id:[null],
        title: ["", [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
        type: ["percentage"],
        value: [0, [Validators.min(0), Validators.max(100)]],
      })
    )
  }


  unSelectAllApprovals(event:MatCheckboxChange){
    if(!event.checked) {
        this.vendorForm.get('product_approval').setValue(false)
        this.vendorForm.get('product_group_approval').setValue(false)
        this.vendorForm.get('collection_approval').setValue(false)
        this.vendorForm.get('discount_approval').setValue(false)
        this.vendorForm.get('shipping_approval').setValue(false)
    }
  }

  removeCommission(index) {
    (this.vendorForm.get("commissions") as FormArray).removeAt(index);
  }

  commisionTypeChange(event, index) {
    if(event.value === "percentage") {
      let commission_value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if(commission_value_validation){
        commission_value_validation.value.setValidators([Validators.min(0), Validators.max(100)]);
        commission_value_validation.value.updateValueAndValidity();
      }
    } else {
      let commission_value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if(commission_value_validation){
        commission_value_validation.value.setValidators([Validators.min(0)]);
        commission_value_validation.value.updateValueAndValidity();
      }
    }
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
  

  categorySelector() {
    let dialogRef = this.dialog.open(CategorySelectorDialogComponent, {
      width: "600px",
      data: {
        selected: this.categoriesTags.map(this.mapHandle),
        valueType: "object.handle",
        multiple: true
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      this.categoriesTags = value.map(this.mapCategoryHandle);
      console.log(this.categoriesTags);
      this.mainCategoryID = this.categoriesTags.filter(this.filterMainCategory).map(this.mapCategoryID);
      this.vendorForm.patchValue({
        main_category: this.mainCategoryID
      })
      this.subCategoryID = this.categoriesTags.filter(this.filterSubCategory).map(this.mapCategoryID);
      this.vendorForm.patchValue({
        sub_category: this.subCategoryID
      })
      this.superSubCategoryID = this.categoriesTags.filter(this.filterSuperSubCategory).map(this.mapCategoryID);
      this.vendorForm.patchValue({
        super_sub_category: this.superSubCategoryID
      })
    });
  }



  removeChip(index, data) {
    this.categoriesTags.splice(index, 1);
    if(data) {
      if(data.category_type == "main") {
        let mainCategoryID = this.vendorForm.get("main_category").value;
        mainCategoryID.splice(data.category_id);
        this.vendorForm.patchValue({
          main_category: this.mainCategoryID
        })
      } else if (data.category_type == "sub") {
        let subCategoryID = this.vendorForm.get("sub_category").value;
        subCategoryID.splice(data.category_id);
        this.vendorForm.patchValue({
          sub_category: this.subCategoryID
        })
      } else if (data.category_type == "superSub") {
        let superSubCategoryID = this.vendorForm.get("super_sub_category").value;
        superSubCategoryID.splice(data.category_id);
        this.vendorForm.patchValue({
          super_sub_category: this.superSubCategoryID
        })
      }
    }  
  }

  mapHandle(data) {
    let newobj = {"category_id": data.category_id, "handle": data.category_handle,"category_name": data.category_name, "category_type": data.category_type}
    return newobj
  }

  mapCategoryHandle(data) {
    let newobj;
    if (data.category_handle) {
      newobj = {"category_id": data.category_id, "category_handle": data.category_handle,"category_name": data.category_name, "category_type": data.category_type}
    } else {
      newobj = {"category_id": data.category_id, "category_handle": data.handle,"category_name": data.category_name, "category_type": data.category_type}
    }
    return newobj
  }

  getBrands() {
    this.brandsService.getBrandsList(1, 1000, "").then(resp => {
      if(resp) {
        this.brands = resp.data.results;
      }
    });
  }


  onSubmit() {
    console.log(this.vendorForm.value);
    this.loading = true;
    this.vendorsService.createVendor(this.vendorForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.snackbar.open("Vendor created.", "", {duration: 3000});
        this.router.navigate(["/", URLS.vendors]);

      }
    });
  }

  ngOnInit(): void {
    this.getBrands();
  }

}
