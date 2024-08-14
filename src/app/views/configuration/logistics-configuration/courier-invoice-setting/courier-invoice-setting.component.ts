import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';
import { LogisticConfigurationService } from '../logistic-configuration.service';


@Component({
  selector: 'app-courier-invoice-setting',
  templateUrl: './courier-invoice-setting.component.html',
  styleUrls: ['./courier-invoice-setting.component.scss']
})
export class CourierInvoiceSettingComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private logisticConfigurationService: LogisticConfigurationService,
    private authservice: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,

  ) { }


  showReturnForm = false;
  loading = false;
  URLS = URLS;

  invoiceForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    phone: ["", Validators.required],
    shop_address: [null],
    inventory_location: [null],
    invoice_title: ["", Validators.required],
    invoice_footer: [null],
    footer_barcode: [null],
    logo_url: [null],
    facebook_page_name: [null],
    facebook_page_url: [null],
    instagram_account_name: [null],
    instagram_account_url: [null],
    show_compare_price: [false, null],
    show_product_type: [false, null],
    show_sku: [false, null],
    print_sku_as_barcode: [false, null],
    tax_implementation: [false, null],
    bin_number: [false, null],
    show_order_number_per_row: [false, null],
    show_barcode: [false, null],
    print_barcode: [false, null],
    show_return_form: [false, null],
    return_form_text: ["", null],
    invoice_print_setting: this.fb.array([])
  })





  getInvoiceSetting(){
    this.loading = true
    this.logisticConfigurationService.getInvoiceSetting()
    .then((response) => {
      this.loading = false;
      if (response) {
        for (let i = 0; i < response.data.invoice_fields.invoice_print_setting.length; i++) {
          (this.invoiceForm.get("invoice_print_setting") as FormArray).push(
            this.fb.group({
              id: [null],
              courier_name: [null],
              store_invoice_count: [null],
              courier_invoice_count: [null],
            })
          )
        }
        this.invoiceForm.patchValue(response.data.invoice_fields);
        console.log(this.invoiceForm.value)
      }   
    });


  }

  saveInvoiceSettings(){
    this.loading = true
    let formData = this.invoiceForm.value;
    this.logisticConfigurationService.saveInvoiceSetting(formData)
    .then((response) => {
      this.loading = false
      this.snackbar.open("Setting Saved Successfully", "Okay", {
        duration: 5000,
      });
      this.router.navigate([URLS.logisticConfiguration])
    })
  }

  ngOnInit(): void {
    this.getInvoiceSetting();
  }

}
