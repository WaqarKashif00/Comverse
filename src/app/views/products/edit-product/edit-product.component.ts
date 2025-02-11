import { SizeChartsService } from './../../../featured-apps/size-charts/size-charts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionsService } from '../collections/collections.service';
import { VendorsService } from '../../vendors/vendors.service';
import { BrandsService } from '../brands/brands.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsChangeStatusDialog } from '../products.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { VideoPreviewDialog } from '../add-product/add-product.component';
import { ContentDisapprovalReasonDialog } from '../../content-approval/content-approval.component';


interface Variant {
  id: number,
  title: string;
  price: number,
  sku: string,
  compare_at_price: number;
  option1: string;
  option2: string;
  option3: string;
  inventory_quantity: number;
  barcode: string;
  is_physical: boolean;
  weight: number;
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private collectionsService: CollectionsService,
    private sizeChartService: SizeChartsService,
    private vendorsService: VendorsService,
    private brandsService: BrandsService,
    private sharedService: SharedService,
    private authService: AuthService,
    private snackbarService: MatSnackBar,
    private router: Router
  ) {
    this.productID = this.route.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  productID: string;
  is_vendor = this.authService.user.is_vendor;
  vendorId: number;
  sizeCharts: any[] = [];
  productTypes: any[] = [];
  productGroups: any[] = [];
  collections: any[] = [];
  vendors: any[] = [];
  brands: any[] = [];
  bannerImages = [];
  productOptions = [];
  approvalStatus: string = '';
  reason: string = '';
  variants: Variant[] = [];
  deletedVariants: Variant[] = [];
  deletedImages = [];
  originalOptions = [];
  commissionList: any;
  originalVariants: Variant[] = [];
  creatingVariants: boolean = false;
  productTags: string[] = [];
  defaultVariant: any = {};
  isMultiLocation: boolean = false;
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  afuConfig = {
    uploadAPI: this.sharedService.afuUploadAPI,
    theme: "dragNDrop",
    multiple: true,
    formatsAllowed: '.jpg,.jpeg,.png,.mp4',
    maxSize: "50",
    hideResetBtn: true,
    autoUpload: true,
    replaceTexts: {
      selectFileBtn: "Select images",
      dragNDropBox: "Drop images here.",
      uploadBtn: "Upload and save",
      sizeLimit: "Recommended resolution: 1600x1600, Size Limit"
    }
  };

  productForm = this.fb.group({
    id: [null],
    title: ["", [Validators.required, Validators.pattern(/^[^`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    description: ["", []],
    features: this.fb.array([]),
    product_images: [[]],
    product_type: [null],
    product_group: [""],
    product_brand: [null],
    commission: [null, [Validators.required]],
    vendor: [null, [Validators.required]],
    collection: [[]],
    is_active: [{ value: false, disabled: true }],
    whatsapp: [true],
    sizechart: [[]],
    hide_out_of_stock: [false],
    has_variants: [false],
    warranty: [""],
    tags: [""],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],

  });

  inventoryForm = this.fb.group({
    sku: ["", Validators.required],
    barcode: [null],
    inventory_quantity: [0],
    track_inventory: [false],
    is_physical: [true],
    shipped_by: ['market_place'],
    weight: [0.1, [Validators.required, Validators.min(0.1)]]
  });

  priceForm = this.fb.group({
    price: [0],
    compare_at_price: [0],
    cost_per_item: [0]
  });

  variantsForm = this.fb.group({
    variants: this.fb.array([])
  });


  addFeature() {
    (this.productForm.get('features') as FormArray).push(
      this.fb.group({
        feature_title: ['', [Validators.pattern(/^[^<>{}~\$\\\*\+\\\\[\]\^\|]+$/)]],
        feature_details: ['', [Validators.pattern(/^[^;<>{}~\$\\\*\\\\\[\]\^\|]+$/)]]
      })
    )
  }

  deleteFeature(index) {
    (this.productForm.get('features') as FormArray).removeAt(index);
  }

  mediaUpload(response) {
    if (response.status === 200) {
      let medias = response.body.map(media => {
        let nameArray = media.file_name.split(".");
        let extension = nameArray[nameArray.length - 1];
        if (extension === "mp4") {
          media.type = "video";
        } else {
          media.type = "image";
        }
        return media;
      });

      this.bannerImages = this.bannerImages.concat(medias);
      let imageIDs = response.body.map(image => image.id);
      let product_images = this.productForm.get('product_images').value;
      this.productForm.patchValue({
        product_images: product_images.concat(imageIDs)
      });
    }
  }

  imageSortChanged(event: CdkDragDrop<string[]>) {
    let tempImageIDs = this.productForm.get('product_images').value;
    moveItemInArray(this.bannerImages, event.previousIndex, event.currentIndex);
    moveItemInArray(tempImageIDs, event.previousIndex, event.currentIndex);
    this.productForm.patchValue({
      product_images: tempImageIDs
    });
  }

  removeImage(index) {
    this.bannerImages.splice(index, 1);
    let imageIDs = this.productForm.get('product_images').value;
    this.deletedImages.push(imageIDs[index]);
    imageIDs.splice(index, 1);
    this.productForm.patchValue({
      product_images: imageIDs
    });
  }

  videoThumbnailClick(videoURL) {
    this.dialog.open(VideoPreviewDialog, {
      width: "800px",
      data: {
        videoURL
      }
    });
  }

  getSizeCharts() {
    this.sizeChartService.getSizeChartList().then(resp => {
      if (resp) {
        this.sizeCharts = resp.data.results;
      }
    })
  }

  getProductTypes() {
    this.productsService.getProductTypes().then(resp => {
      if (resp) {
        this.productTypes = resp.data;
      }
    });
  }

  getProductGroups() {
    let vendor = this.productForm.get('vendor').value;
    this.productsService.getProductGroups(1, 250, "&vendor=" + vendor, "").then(resp => {
      if (resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  getCollections() {
    let vendor = this.productForm.get('vendor').value;
    this.collectionsService.getCollectionsList(1, 250, "&vendor=" + vendor, "").then(resp => {
      if (resp) {
        this.collections = resp.data.results;
      }
    })
  }

  getVendors() {
    this.vendorsService.getVendorsList(1, 250).then(resp => {
      if (resp) {
        this.vendors = resp.data.results;
      }
    });
  }

  getBrands() {
    this.brandsService.getBrandsList(1, 1000, "").then(resp => {
      if (resp) {
        this.brands = resp.data.results;
      }
    });
  }

  getCommissions() {
    let vendorId = this.productForm.get('vendor').value;
    this.loading = true;
    this.productsService.getCommissions(vendorId).then(resp => {
      this.loading = false;
      let commissions;
      commissions = resp;
      this.commissionList = commissions.data;
    })
  }

  getProductDetails() {
    this.loading = true;
    this.productsService.getProductDetail(this.productID).then(resp => {
      this.loading = false;
      if (resp) {
        for (let i = 0; i < resp.data.features.length; i++) {
          this.addFeature();
        }
        this.reason = resp.data.reason;
        this.approvalStatus = resp.data.status;
        // Product images
        let medias = resp.data.images.map(media => {
          let nameArray = media.file_name.split(".");
          let extension = nameArray[nameArray.length - 1];
          if (extension === "mp4") {
            media.type = "video";
          } else {
            media.type = "image";
          }
          return media;
        });

        this.bannerImages = medias;
        resp.data.product_images = this.bannerImages.map(image => image.id);
        this.isMultiLocation = resp.data.is_multilocation;
        this.productTags = resp.data.tags.length ? resp.data.tags.split(",").filter(tag => tag) : [];
        this.productForm.patchValue(resp.data);
        this.inventoryForm.patchValue({
          shipped_by: resp.data.shipped_by
        })

        this.getCommissions();
        this.getProductGroups();
        this.getCollections();
        if (resp.data.product_group) {
          (this.productForm.controls['is_active'] as FormControl).enable();
        }
        this.variants = resp.data.variants;
        if (resp.data.has_variants) {
          this.productOptions = resp.data.options;
          this.originalOptions = resp.data.options;
          this.originalVariants = resp.data.variants;
          this.inventoryForm.controls['sku'].clearValidators();
          this.inventoryForm.controls['sku'].updateValueAndValidity();
        } else {

          let variant = resp.data.variants[0];
          this.defaultVariant = variant;
          let location = variant.variant_prices[0];
          let inventoryLocation = location.variant_inventories[0];
          this.inventoryForm.patchValue({
            barcode: variant.barcode,
            inventory_quantity: inventoryLocation.inventory_quantity,
            sku: variant.sku,
            is_physical: variant.is_physical,
            weight: variant.weight,
          });
          this.priceForm.patchValue({
            price: location.price,
            compare_at_price: location.compare_at_price,
            cost_per_item: location.cost_per_item
          });
        }
      }
    });
  }




  deleteVariant(variant) {
    let dialogRef = this.dialog.open(DeleteVariantConfirmDialog, {
      width: "600px",
      data: {
        variant
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.loading = true;
        this.productsService.deleteVariant(data.id).then(resp => {
          this.loading = false;
          if (resp) {
            this.snackbarService.open("Variant deleted successfuly.", "", { duration: 3000 });
            if (resp.data.detail === "Deleted Variant Successfully!") {
              this.originalVariants = this.originalVariants.filter(variant => variant.id !== data.id);
              this.productOptions = Object.assign([], this.originalOptions);
              this.variants = this.originalVariants;

              if (this.variants.length === 0) {
                this.productForm.patchValue({
                  has_variants: false
                });
              }
            } else if (resp.data.variants) {
              let variant = resp.data.variants[0];
              this.defaultVariant = variant;

              this.productForm.patchValue({
                has_variants: false
              });
              this.inventoryForm.patchValue({
                barcode: variant.barcode,
                inventory_quantity: variant.inventory_quantity,
                sku: variant.sku
              });
              this.priceForm.patchValue({
                price: variant.price,
                compare_at_price: variant.compare_at_price
              });

              this.inventoryForm.controls['sku'].setValidators([Validators.required]);
              this.inventoryForm.controls['sku'].updateValueAndValidity();
              this.productOptions = [];
              this.variants = [];
            }
          }
        });
      }
    });
  }


  onViewReason() {
    let dialogRef = this.dialog.open(ContentDisapprovalReasonDialog, {
      width: '600px',
      data: {
        reason: this.reason
      }
    });
  }


  onEditOptions() {
    let dialogRef = this.dialog.open(EditProductOptionsDialog, {
      width: '600px',
      data: {
        options: this.productOptions,
        variants: this.variants
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.variants = data.variants;
        this.deletedVariants = data.deletedVariants;
        this.productOptions = data.options.map(option => {
          let tempOption = option;
          tempOption.values = tempOption.values.join(",");
          return tempOption;
        });
      }
    });
  }


  hasVariantsChange(event) {
    if (event.checked) {
      this.creatingVariants = true;
      this.addOption();


      (this.inventoryForm.controls['sku'] as FormControl).clearValidators();
      (this.inventoryForm.controls['sku'] as FormControl).updateValueAndValidity();

      for (let i = 0; i < (this.variantsForm.controls['variants'] as FormArray).controls.length; i++) {
        const variantGroup = (this.variantsForm.controls['variants'] as FormArray).controls[i] as FormGroup;
        variantGroup.controls['sku'].setValidators([Validators.required]);
        variantGroup.controls['sku'].updateValueAndValidity();
      }
    } else {
      (this.inventoryForm.controls['sku'] as FormControl).setValidators([Validators.required]);

      for (let i = 0; i < (this.variantsForm.controls['variants'] as FormArray).controls.length; i++) {
        const variantGroup = (this.variantsForm.controls['variants'] as FormArray).controls[i] as FormGroup;
        variantGroup.controls['sku'].setValidators([]);
        variantGroup.controls['sku'].updateValueAndValidity();
      }
    }
  }


  addOption() {
    this.productOptions.push({
      name: "",
      values: []
    });
  }


  deleteOption(index) {
    this.productOptions.splice(index, 1);
    this.makeVariantsFromOptions();
  }


  makeVariantsFromOptions() {
    var valuesArrays = this.productOptions.map(option => option.values);
    var combinations = this.sharedService.makeCombinationsFromLists(...valuesArrays);
    (this.variantsForm.get('variants') as FormArray).clear();
    combinations.forEach((title, i) => {

      let variant = this.fb.group({
        title: [title],
        price: [this.priceForm.get('price').value],
        compare_at_price: [this.priceForm.get('compare_at_price').value],
        cost_per_item: [this.priceForm.get('cost_per_item').value],
        inventory_quantity: [this.inventoryForm.get('inventory_quantity').value],
        option1: [title.split("/")[0] || null],
        option2: [title.split("/")[1] || null],
        option3: [title.split("/")[2] || null],
        sku: [this.inventoryForm.get('sku').value + "-" + (i + 1), [Validators.required]],
        barcode: [this.inventoryForm.get('barcode').value],
        is_physical: [true],
        weight: [0.1]
      });
      (this.variantsForm.get('variants') as FormArray).push(variant);
    });
  }


  removeVariant(index) {
    (this.variantsForm.get('variants') as FormArray).removeAt(index);
  }


  onVendorChange() {
    this.productForm.patchValue({
      product_group: "",
      collection: []
    });
    this.getProductGroups();
    this.getCollections();
    this.getCommissions();
  }


  onProductGroupChange() {
    let group = this.productForm.get('product_group').value;
    if (!group) {
      this.productForm.patchValue({
        is_active: false
      });
      (this.productForm.controls['is_active'] as FormControl).disable();
    } else {
      (this.productForm.controls['is_active'] as FormControl).enable();
    }
  }


  onPysicalChange(event) {
    if (event.checked) {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([Validators.required, Validators.min(0.1)]);
    } else {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([]);
      this.inventoryForm.patchValue({
        weight: 0.1
      });
    }
    if (this.creatingVariants) {
      let variants = this.variantsForm.value.variants;
      for (let i = 0; i < variants.length; i++) {
        variants[i].is_physical = event.checked;
      }
      this.inventoryForm.patchValue({
        variants
      });
    } else {
      this.variants[0].is_physical = event.checked;
    }
  }


  onWeightChange() {
    if (this.creatingVariants) {
      let variants = this.variantsForm.value.variants;
      for (let i = 0; i < variants.length; i++) {
        variants[i].weight = this.inventoryForm.get('weight').value;
      }
      this.variantsForm.patchValue({
        variants
      });
    } else {
      this.variants[0].weight = this.inventoryForm.get('weight').value;
    }
  }



  onSubmit() {
    let variants = [];
    let productData = this.productForm.value;
    let optionsData = [];
    if (this.creatingVariants) {
      variants = this.variantsForm.value.variants;
      optionsData = this.productOptions.map(option => {
        return {
          name: option.name,
          values: option.values.join(","),
          position: 1
        }
      });
      productData.deleted_variants_id = [this.defaultVariant.id];
    } else {
      variants = Object.assign([], this.variants);
      optionsData = this.productOptions;
      productData.deleted_variants_id = this.deletedVariants.map(variant => variant.id);
    }
    variants.forEach(variant => delete variant.variant_prices);
    if (!productData.has_variants) {
      variants[0].price = this.priceForm.get('price').value;
      variants[0].compare_at_price = this.priceForm.get('compare_at_price').value;
      variants[0].cost_per_item = this.priceForm.get('cost_per_item').value;
      variants[0].sku = this.inventoryForm.get('sku').value;
      variants[0].barcode = this.inventoryForm.get('barcode').value;
      variants[0].inventory_quantity = this.inventoryForm.get('inventory_quantity').value;
    }

    productData.options = optionsData;
    productData.variants = variants;
    productData.tags = this.productTags.length ? this.productTags.join(",") : "";
    productData.deleted_product_images = this.deletedImages;
    productData.track_inventory = this.inventoryForm.get('track_inventory').value;
    productData.shipped_by = this.inventoryForm.get('shipped_by').value;
    this.loading = true;
    this.productsService.updateProduct(productData).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Product updated successfuly.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.products]);
      }
    });
  }

  ngOnInit(): void {
    if (!this.is_vendor) {
      this.getVendors();
    }
    this.getBrands();
    this.getProductDetails();
    this.getSizeCharts();
  }

}


@Component({
  selector: 'delete-variant-confirm-dialog',
  templateUrl: '../dialogs/delete-variant-confirm-dialog.html',
})
export class DeleteVariantConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  loading: boolean = false;

  deleteVariant() {
    this.dialogRef.close(this.data.variant);
  }

}


@Component({
  selector: 'edit-product-options-dialog',
  templateUrl: '../dialogs/edit-product-options-dialog.html',
})
export class EditProductOptionsDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductsChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar) {
    this.originalOptions = this.data.options.map(option => {
      let tempOption = Object.assign({}, option);
      tempOption.values = option.values.split(",");
      return tempOption;
    });

    this.options = Object.assign([], this.originalOptions);
    let tempVariants = this.data.variants.map(variant => Object.assign({}, variant));
    this.editingVariants = Object.assign([], tempVariants);
  }

  loading: boolean = false;
  originalOptions = [];
  options = [];
  editingVariants = [];
  deletedVariants = [];
  confirmingDelete: boolean = false;
  formError: string = "";


  canRemoveValue() {
    if (this.options.length > 1) {
      return true;
    } else {
      return this.options[0].values.length > 1;
    }
  }


  removeValue(optionIndex, valueIndex) {
    let value = this.options[optionIndex].values[valueIndex];
    if (this.options[optionIndex].values.length === 1) {
      this.options.splice(optionIndex, 1);
      this.removeOptionFromVariants(optionIndex);
    } else {
      this.options[optionIndex].values.splice(valueIndex, 1);
      this.deleteVariantsFromOption(optionIndex, value);
    }
  }


  removeOptionFromVariants(index) {
    for (let i = 0; i < this.editingVariants.length; i++) {
      const editingVariant = this.editingVariants[i];
      editingVariant['option' + (index + 1)] = null;
      if (index < 2) {
        for (let j = index + 1; j < 3; j++) {
          editingVariant['option' + j] = editingVariant['option' + (j + 1)];
        }
        editingVariant['option3'] = null;
      }
      this.editingVariants.forEach(variant => {
        let variantTitle = [];
        this.options.forEach((option, index) => {
          let optionValue = variant['option' + (index + 1)];
          variantTitle.push(optionValue);
        });
        variant.title = variantTitle.join("/");
      });
    }
  }


  deleteVariantsFromOption(optionIndex, value) {
    let tempVariants = [];
    this.editingVariants.forEach(variant => {
      if (variant['option' + (optionIndex + 1)] === value) {
        this.deletedVariants.push(variant);
      } else {
        tempVariants.push(variant);
      }
    });
    this.editingVariants = tempVariants;
  }


  addOption() {
    this.options.push({
      name: "",
      new: true,
      values: [""]
    });
  }


  addNewOptionValue(e, optionIndex) {
    var value = e.target.value.replaceAll(",", "");
    if (value) {
      this.editingVariants.forEach(variant => {
        let variantTitle = [];
        variant['option' + (optionIndex + 1)] = value;
        this.options.forEach((option, index) => {
          variantTitle.push(variant['option' + (index + 1)]);
        });
        variant.title = variantTitle.join("/");
      });
    } else {
      if (this.options.length > 1) {
        this.options.splice(optionIndex, 1);
        this.removeOptionFromVariants(optionIndex);
      }
    }

  }


  saveOption() {
    if (!this.confirmingDelete) {
      this.formError = "";
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i];
        if (option.name == "") {
          this.formError = "Please enter name for all options.";
          return
        }

        if (option.new) {
          if (option.values[0] == "") {
            this.formError = "Please enter a default value for new option.";
            return
          }
        }
      }
      if (this.deletedVariants.length) {
        this.confirmingDelete = true;
      } else {
        this.dialogRef.close({
          variants: this.editingVariants,
          options: this.options,
          deletedVariants: this.deletedVariants
        });
      }
    } else {
      this.dialogRef.close({
        variants: this.editingVariants,
        options: this.options,
        deletedVariants: this.deletedVariants
      });
    }
  }
}
