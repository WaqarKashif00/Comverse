import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-edit-variant',
  templateUrl: './edit-variant.component.html',
  styleUrls: ['./edit-variant.component.scss']
})
export class EditVariantComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private router: Router
  ) {
    this.productID = this.route.snapshot.paramMap.get("productID");
    this.variantID = this.route.snapshot.paramMap.get("id");
  }

  loading: boolean = true;
  URLS = URLS;
  productID: string;
  variantID: string;
  optionsError: string = "";
  variantAvailable: boolean = true;
  variantPrices = [];
  productData = {
    options: [],
    variants: [],
    is_discount: false,
    is_multilocation: false
  };
  variantForm = this.fb.group({
    id: [null],
    barcode: [""],
    option1: [null],
    option2: [null],
    option3: [null],
    sku: ["", [Validators.required]],
    title: ["", [Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    is_physical: [true],
    weight: [0.1, [Validators.required, Validators.min(0.1)]],
    variant_prices: this.fb.array([])
  });

  getVariantDetail() {
    this.productsService.getVariantDetail(this.variantID).then(resp => {
      this.loading = false;
      if (resp) {
        this.variantPrices = resp.data.variant_prices;
        resp.data.variant_prices.forEach(variant_price => {

          // Create variantInventories array based on coming data.
          let variantInventories = this.fb.array([]);

          variant_price.variant_inventories.forEach(variant_inventory => {
            variantInventories.push(this.fb.group({
              id: variant_inventory.id,
              inventory_quantity: variant_inventory.inventory_quantity,
              sub_location: variant_inventory.sub_location
            }));
          });

          // Create variant_prices array based on coming data and assign variantInventories array created above.
          (this.variantForm.get('variant_prices') as FormArray).push(this.fb.group({
            id: [variant_price.id],
            location: [variant_price.location],
            compare_at_price: [variant_price.compare_at_price],
            cost_per_item: [variant_price.cost_per_item],
            price: [variant_price.price],
            variant_inventories: variantInventories
          }))
        });
        this.variantForm.patchValue(resp.data);
        console.log(this.variantForm.value);
      }
    })
  }

  getProductDetail() {
    this.productsService.getProductDetail(this.productID).then(resp => {
      if (resp) {
        this.productData = resp.data;
        this.getVariantDetail();
      }
    });
  }

  checkVariantAvailability() {
    let available: boolean = true;
    let variantData = this.variantForm.value;
    let titleArray = [];
    let title = "";
    this.productData.options.forEach((option, index) => {
      titleArray.push(variantData['option' + (index + 1)]);
    });
    title = titleArray.join("/");
    this.productData.variants.forEach(variant => {
      if (variant.id !== variantData.id && variant.title === title) {
        available = false;
      }
    });

    if (available) {
      this.optionsError = "";
      this.variantAvailable = true;
      this.variantForm.patchValue({
        title
      });
    } else {
      this.optionsError = "A variant with these options already exist.";
      this.variantAvailable = false;
    }
  }

  onPhysicalProductChange(event) {
    if (event.checked) {
      (this.variantForm.controls['weight'] as FormControl).setValidators([Validators.required, Validators.min(0.1)]);
      this.variantForm.get('weight').setValue(0.1);
    } else {
      (this.variantForm.controls['weight'] as FormControl).setValidators([]);
    }
  }

  onSubmit() {
    this.loading = true;
    this.productsService.updateVariant(this.variantForm.value).then(resp => {
      this.loading = false;
      if (resp.isAxiosError) {
        if (resp.response.status === 422) {
          alert("A variant with this SKU already exists.");
        }
      } else {
        if (resp) {
          this.snackbarService.open("Variant updated successfully.", "", { duration: 3000 });
          this.router.navigate(['/', URLS.products, URLS.edit, this.productID]);
        }
      }
    })
  }

  ngOnInit(): void {
    this.getProductDetail();
  }

}
