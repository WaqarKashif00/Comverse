import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { Router } from '@angular/router';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { Validators } from '@angular/forms';
import { MultiLocationService } from '../multi-location.service';


@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private multiLocationService: MultiLocationService,

  ) {}
  loading = false;
  URLS = URLS;
  countriList = [];
  currencyList = [];
  defaultCurrencyList = [];


  
  locationForm = this.fb.group({
    // default: [false],
    // active: [false],
    title: [''],
    country: [null],
    default_currency: [''],
    serve_in_multiple_country: [false],

    multi_country_serving:this.fb.array([])
  });

  addConvertionRate() {
    (this.locationForm.get("multi_country_serving")as FormArray).push(
      this.fb.group({
        country:[null],
        currency:[null],
        conversion_rate:['']
      })
    )
  }

  removeLocation(index) {
    // this.loading = true;
    // this.erpService.removeTrigger(id).then(resp => {
    //   this.loading = false;
    //   if (resp) {
    //      (this.createSettingForm.get("triggers") as FormArray).removeAt(index);
    //     this.snackbarService.open("remove trigger successfully.", "", { duration: 3000 });
    //   }
    // });

    (this.locationForm.get("multi_country_serving") as FormArray).removeAt(index);
    

  }


  onSubmit() {
    this.loading = true;
    this.multiLocationService.locationSubmit(this.locationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Location created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.multiLocation,URLS.locations]);
      }
    });
  }
  getCountrie() {
    this.loading = true;
    this.multiLocationService.getCountrie().then(resp => {
      this.loading = false;
      if (resp) {
        this.countriList = resp.data;
        // this.snackbar.open("Location created successfully.", "", { duration: 3000 });
        // this.router.navigate(['/', URLS.configuration]);
      }
    });
  }


  defaultCurrency() {
    this.loading = true;
    this.multiLocationService.defaultCurrency().then(resp => {
      this.loading = false;
      if (resp) {
        this.defaultCurrencyList = resp.data;
        // this.snackbar.open("Location created successfully.", "", { duration: 3000 });
        // this.router.navigate(['/', URLS.configuration]);
      }
    });
  }


  getCurrency() {
    this.loading = true;
    this.multiLocationService.getCurrency().then(resp => {
      this.loading = false;
      if (resp) {
        this.currencyList = resp.data;

        // this.dialogRef.close(true);
      }
    });
  }

  ngOnInit(): void {
    this.getCountrie();
    this.defaultCurrency();
    this.getCurrency();
  }

}
