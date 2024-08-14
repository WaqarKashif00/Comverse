import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';
import { LogisticConfigurationService } from './../logistic-configuration.service';
import { VendorsService } from 'src/app/views/vendors/vendors.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-courier-automation',
  templateUrl: './courier-automation.component.html',
  styleUrls: ['./courier-automation.component.scss']
})
export class CourierAutomationComponent implements OnInit {

  constructor(
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private logisticConfigurationService: LogisticConfigurationService,
    private vendorService: VendorsService,
    private router: Router,


  ) { }

  loading: boolean = false;
  URLS = URLS;
  vendors: any;
  locations = [];
  sub_locations = [];
  tags: string[] = [];


  courierAutomationForm = this.fb.group({
    is_active: [false],
    is_tag: [false],
    tags: [''],
    is_paid: [false],
    location: [[]],
    order_status: [''],
    sub_location: [[]],
    vendor: [[]],
  })

  // addExcludeLocations() {
  //   (this.courierAutomationForm.get("excluded_locations") as FormArray).push(
  //     this.fb.group({
  //       locations: [[]],
  //       sub_locations: [[]]
  //     })
  //   )
  // }

  // removeExcludedLocation(index) {
  //   (this.courierAutomationForm.get("excluded_locations") as FormArray).removeAt(index);
  // }

  getVendors() {
    this.loading = true;
    this.vendorService.getVendorsList(1, 250).then((resp) => {
      this.loading = false;
      if (resp) {
        this.vendors = resp.data.results
      }
    })
  }


  getLocations() {
    this.loading = true;
    this.logisticConfigurationService.getLocation().then((resp)=> {
      this.loading = false;
      if(resp) {
        this.locations = resp.data;
      }
    })
  }


  onLocationSelect(event) {
    this.getSubLocation(event.value);
  }


  getSubLocation(id) {
    this.loading = true;
    this.logisticConfigurationService.getSubLocation(id).then((resp) => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.sub_locations = resp.data;
      }
    })
  }



  selectVendor(event) {
    // this.courierAutomationForm.patchValue({
    //   exluded_vendors: event.value.id
    // })
  }

  compareData(ob1, ob2) {
    return ob1.id == ob2.id
  }


  onSave() {
    this.loading = true;
    let mainObj;
    mainObj = this.courierAutomationForm.value;
    mainObj.tags = this.tags.length ? this.tags.join(",") : "";
    this.logisticConfigurationService.createAutomation(mainObj).then((resp)=> {
    this.loading = false;
    if(resp) {
      this.snackbar.open("Courier automation saved.", "", { duration: 3000 });
      this.router.navigate([URLS.logisticConfiguration])
    }
    })

  }



  getAutomationDetails() {
    this.loading = true;
    this.logisticConfigurationService.getAutomation().then((resp)=> {
      this.loading = false;
      if(resp) {
        this.getSubLocation(resp.data.location)
        this.tags = resp.data.tags ? resp.data.tags.split(",").filter(tag => tag) : [];
        this.courierAutomationForm.patchValue(resp.data);
      }
    })
  }

  ngOnInit(): void {
    this.getLocations();
    this.getVendors();
    this.getAutomationDetails();
  }

}
