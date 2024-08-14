import { MatCheckboxChange } from '@angular/material/checkbox';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductsService } from './../../products/products.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { VendorsService } from '../vendors.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategorySelectorDialogComponent } from 'src/app/shared/category-selector-dialog/category-selector-dialog.component';
import { BrandsService } from '../../products/brands/brands.service';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private vendorsService: VendorsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private brandsService: BrandsService,

  ) {
    this.vendorID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = false;
  URLS = URLS;
  vendorID = '';
  vendorDetails: any
  commission_type_check: any;
  is_vendor = this.authService.user.is_vendor;
  storeCurrency = environment.currency;
  mainCategoryID = [];
  subCategoryID = [];
  superSubCategoryID = [];
  removable: boolean = true;
  categoriesTags:any[] = [];
  brands = [];


  vendorForm = this.fb.group({
    id: this.vendorID,
    name: ["", [Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    email: ["", [Validators.email]],
    phone: ["", [Validators.pattern(/^[^!"`'#%;<>={}~\$\(\)\*\/\\\?\[\]\^\|]+$/)]],
    city: ["", [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    address: ["" , [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    license_number: [null],
    commissions: this.fb.array([]),
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
    type: ['']
  });


  addCommission() {
    (this.vendorForm.get("commissions") as FormArray).push(
      this.fb.group({
        title: ["", [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
        type: ["percentage"],
        value: [0, [Validators.min(0), Validators.max(100)]],
      })
    )
  }


  removeCommission(index) {
    let commissionID = (this.vendorForm.get("commissions") as FormArray).at(index).get('id').value;
    let dialogRef = this.dialog.open(DeleteCommissionDialog, {
      width: "600px",
      data: {
        commissionID: commissionID,
        vendorID: this.vendorID
      }
    });
    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.removeCommissionAfterConfirmation(index);
      }
    });
  }

  unSelectAllApprovals(event: MatCheckboxChange) {
    if (!event.checked) {
      this.vendorForm.get('product_approval').setValue(false)
      this.vendorForm.get('product_group_approval').setValue(false)
      this.vendorForm.get('collection_approval').setValue(false)
      this.vendorForm.get('discount_approval').setValue(false)
      this.vendorForm.get('shipping_approval').setValue(false)
    }
  }


  removeCommissionAfterConfirmation(index) {
    (this.vendorForm.get("commissions") as FormArray).removeAt(index);
  }


  commisionTypeChange(event, index) {
    if (event.value === "percentage") {
      let value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if (value_validation) {
        value_validation.value.setValidators([Validators.min(0), Validators.max(100)]);
        value_validation.value.updateValueAndValidity();
      }
    } else {
      let value_validation = (this.vendorForm.get('commissions') as FormArray).at(index).get('value');
      if (value_validation) {
        value_validation.value.setValidators([Validators.min(0)]);
        value_validation.value.updateValueAndValidity();
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



  fetchSingleVendor() {
    this.loading = true;
    this.vendorsService.getSignleVendor(this.vendorID).then(resp => {
      this.loading = false;
      if (resp) {
        this.vendorDetails = resp.data

        for (let i = 0; i < this.vendorDetails.commissions.length; i++) {
          (this.vendorForm.get("commissions") as FormArray).push(
            this.fb.group({
              id: [null],
              title: [{ value: '', disabled: this.is_vendor }, [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
              type: [{ value: 'percentage', disabled: this.is_vendor }],
              value: [{ value: 0, disabled: this.is_vendor }, [Validators.min(0), Validators.max(100)]],
            })
          )
        }
        let mainCategoryArray = [];
        let subCategoryArray = [];
        let superSubCategoryArray = [];

        mainCategoryArray = resp.data.main_category.map(data => { return { category_id: data.id, category_name: data.name, category_handle: data.handle, category_type: "main" } })
        subCategoryArray = resp.data.sub_category.map(data => { return { category_id: data.id, category_name: data.name, category_handle: data.handle, category_type: "sub" } })
        superSubCategoryArray = resp.data.super_sub_category.map(data => { return { category_id: data.id, category_handle: data.handle, category_name: data.name, category_type: "superSub" } })

        this.categoriesTags = this.categoriesTags.concat(mainCategoryArray);
        this.categoriesTags = this.categoriesTags.concat(subCategoryArray);
        this.categoriesTags = this.categoriesTags.concat(superSubCategoryArray);
        this.vendorForm.patchValue(resp.data);
      }
    });
  }


  onSubmit() {
    this.loading = true;
    let productData = this.vendorForm.value;
    productData.main_category = this.categoriesTags.filter(this.filterMainCategory).map(this.mapCategoryID);
    productData.sub_category = this.categoriesTags.filter(this.filterSubCategory).map(this.mapCategoryID);
    productData.super_sub_category = this.categoriesTags.filter(this.filterSuperSubCategory).map(this.mapCategoryID);

    this.vendorsService.updateVendor(productData).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Vendor updated.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.vendors]);
      }
    });
  }

  ngOnInit(): void {
    this.getBrands();
    this.fetchSingleVendor();
  }
}


@Component({
  selector: 'delete-commission-dialog',
  templateUrl: '../dialogs/delete-commission-dialog.html',
})
export class DeleteCommissionDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteCommissionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private vendorsService: VendorsService,
    private snackBar: MatSnackBar,
    private commissionService: ProductsService,
    private fb: FormBuilder,

  ) {
    this.vendorID = this.data.vendorID
  }

  commissionList = [];
  vendorID = '';
  loading = false;
  buttonDissabled = false;
  selected: any;
  commissionID = this.data.commissionID;


  commissionDeleteForm = this.fb.group({
    commission: [''],
  });


  onSubmit() {
    this.loading = true;
    let selectedValue = (this.commissionDeleteForm.get('commission').value)
    this.vendorsService.deleteCommission(this.commissionID, selectedValue).then((resp) => {
      this.loading = false;
      if (resp) {
        this.dialogRef.close(true);
        this.snackBar.open("Commission deleted.", "", { duration: 3000 });
      }
    });
  }

  getCommissions() {
    this.commissionService.getCommissions(this.data.vendorID).then(resp => {
      if (resp) {
        this.commissionList = resp.data
      }
    })
  }


  ngOnInit(): void {
    this.getCommissions();
  }
}
