import { AuthService } from 'src/app/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';
import { CollectionsService } from '../collections/collections.service';
import { VendorsService } from '../../vendors/vendors.service';
import { BrandsService } from '../brands/brands.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SizeChartsService } from 'src/app/featured-apps/size-charts/size-charts.service';


interface Option {
  name: string;
  values: string[]
}

interface Variant {
  title: string;
  price: number,
  sku: string,
  compare_at_price: number;
  option1: string;
  option2: string;
  option3: string;
  inventory_quantity: number;
  barcode: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private collectionsService: CollectionsService,
    private vendorsService: VendorsService,
    private brandsService: BrandsService,
    private sharedService: SharedService,
    private sizeChartService: SizeChartsService,
    private authService: AuthService,
    private snackbarService: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) { }


  loading: boolean = false;
  URLS = URLS;
  is_vendor = this.authService.user.is_vendor;
  vendorID = this.authService.user.vendor_id;
  productTypes: any[] = [];
  productGroups: any[] = [];
  sizeCharts: any[] = [];
  collections: any[] = [];
  vendors: any[] = [];
  commissionList: any[] = [];
  brands: any[] = [];
  productTags: string[] = [];
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ]
  };
  options: Option[] = [
    {
      name: "",
      values: []
    }
  ]
  variants: Variant[] = [];
  bannerImages = [];
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
    title: ["", [Validators.required, Validators.pattern(/^[^`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    description: [""],
    features: this.fb.array([
      this.fb.group({
        feature_title: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
        feature_details: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]]
      })
    ]),

    product_images: [[]],
    product_type: [null],
    product_group: [""],
    product_brand: [null],
    vendor: [null, [Validators.required]],
    collection: [[]],
    sizechart: [[]],
    commission: [null],
    is_active: [{ value: false, disabled: true }],
    whatsapp: [true],
    hide_out_of_stock: [false],
    warranty: ["", [Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    tags: ["", [Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    has_variants: [false],
    handle: [''],
    seo_title: [''],
    seo_description: [''],
    seo_keywords: [''],
  });

  inventoryForm = this.fb.group({
    sku: ["", [Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    barcode: [null, [Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
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


  addOption() {
    this.options.push({
      name: "",
      values: []
    });
  }

  deleteOption(index) {
    this.options.splice(index, 1);
    this.makeVariantsFromOptions();
  }

  makeVariantsFromOptions() {
    var valuesArrays = this.options.map(option => option.values);
    var combinations = this.sharedService.makeCombinationsFromLists(...valuesArrays);
    (this.variantsForm.get('variants') as FormArray).clear();
    combinations.forEach((title, i) => {
      let variant = this.fb.group({
        title: [title, [Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\\\\[\]\^\|]+$/)]],
        price: [this.priceForm.get('price').value],
        compare_at_price: [this.priceForm.get('compare_at_price').value],
        cost_per_item: [this.priceForm.get('cost_per_item').value],
        inventory_quantity: [this.inventoryForm.get('inventory_quantity').value],
        is_physical: [this.inventoryForm.get('is_physical').value],
        weight: [this.inventoryForm.get('weight').value],
        option1: [title.split("/")[0] || null],
        option2: [title.split("/")[1] || null],
        option3: [title.split("/")[2] || null],
        sku: [this.inventoryForm.get('sku').value + "-" + (i + 1), [Validators.required]],
        barcode: [this.inventoryForm.get('barcode').value]
      });
      (this.variantsForm.get('variants') as FormArray).push(variant);
    });
  }

  addFeature() {
    (this.productForm.get('features') as FormArray).push(
      this.fb.group({
        feature_title: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
        feature_details: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]]
      })
    );
  }

  deleteFeature(index) {
    (this.productForm.get('features') as FormArray).removeAt(index);
  }

  getProductGroups() {
    this.productForm.patchValue({
      product_group: ""
    });
    let vendor: any
    if (this.is_vendor) {
      vendor = ""
    } else {
      vendor = "&vendor=" + this.productForm.get('vendor').value;
    }
    this.productsService.getProductGroups(1, 250, vendor, "").then(resp => {
      if (resp) {
        this.productGroups = resp.data.results;
      }
    });
  }

  getCollections() {
    let vendor: any
    if (this.is_vendor) {
      vendor = ""
    } else {
      vendor = "&vendor=" + this.productForm.get('vendor').value;
    }
    this.collectionsService.getCollectionsList(1, 250, vendor, "").then(resp => {
      if (resp) {
        this.collections = resp.data.results;
      }
    })
  }

  getSizeCharts() {
    this.sizeChartService.getSizeChartList().then(resp => {
      if (resp) {
        this.sizeCharts = resp.data.results;
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

  removeVariant(index) {
    (this.variantsForm.get('variants') as FormArray).removeAt(index);
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

  onHasVariantChange(event) {
    if (event.checked) {
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

  onPhysicalProductChange(event) {
    if (event.checked) {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([Validators.required, Validators.min(0.1)]);
      this.inventoryForm.patchValue({
        weight: 0.1
      });
    } else {
      (this.inventoryForm.controls['weight'] as FormControl).setValidators([]);
      this.inventoryForm.patchValue({
        weight: 0
      });
    }
  }

  onWeightChange() {
    let weight = this.inventoryForm.get('weight').value;
    let variants = this.variantsForm.value.variants;
    for (let i = 0; i < variants.length; i++) {
      variants[i].weight = weight;
    }
    this.variantsForm.patchValue({
      variants
    });
  }

  onSubmit() {
    let productData = this.productForm.value;
    let inventoryData = this.inventoryForm.value;
    let priceData = this.priceForm.value;
    let variantsData = this.variantsForm.value;
    let variants = [];
    let productOptions = [];

    if (!productData.has_variants) {
      let defaultVariant = {
        title: "Default Title",
        price: priceData.price,
        compare_at_price: priceData.compare_at_price,
        cost_per_item: priceData.cost_per_item,
        inventory_quantity: inventoryData.inventory_quantity,
        is_physical: inventoryData.is_physical,
        option1: "Default Title",
        option2: null,
        option3: null,
        weight: inventoryData.weight,
        sku: inventoryData.sku,
        barcode: inventoryData.barcode
      }

      variants.push(defaultVariant);
    } else {
      variants = this.variantsForm.value.variants;
      productOptions = this.options.map(option => {
        return {
          name: option.name,
          values: option.values.join(","),
          position: 1
        }
      })
    }

    productData.options = productOptions;
    productData.variants = variants;
    productData.tags = this.productTags.length ? this.productTags.join(",") : "";
    productData.track_inventory = inventoryData.track_inventory,
      productData.shipped_by = this.inventoryForm.get('shipped_by').value;
    this.loading = true;
    this.productsService.createProduct(productData).then(resp => {
      this.loading = false;
      if (resp.isAxiosError) {
        if (resp.response.status === 404) {
          alert("A variant with this SKU already exists.");
        }
      } else {
        if (resp.data) {
          this.snackbarService.open("Product created.", "", { duration: 3000 });
          this.router.navigate(["/", URLS.products]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getVendors();
    this.getSizeCharts();
    this.getBrands();
    if (this.is_vendor) {
      this.productForm.patchValue({
        vendor: this.vendorID
      })
      this.getProductGroups();
      this.getCollections();
    }
  }

}


@Component({
  selector: 'video-preview-dialog',
  templateUrl: '../dialogs/video-preview-dialog.html',
})
export class VideoPreviewDialog {
  constructor(
    public dialogRef: MatDialogRef<VideoPreviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;


}
