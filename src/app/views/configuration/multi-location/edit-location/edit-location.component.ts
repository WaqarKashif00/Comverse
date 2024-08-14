import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MultiLocationService } from '../multi-location.service';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private multiLocationService: MultiLocationService,
    private route: ActivatedRoute,


  ) {
    this.LocationID = this.route.snapshot.params.id
  }
  loading = false;
  URLS = URLS;
  locationDetail:any;
  LocationID 


  countriList = [];
  currencyList = [];
  defaultCurrencyList = [];
  
  locationForm = this.fb.group({
    id:[null],
    is_active:[false],
    title: [''],
    country: [null],
    default_currency: [''],
    serve_in_multiple_country: [false],
    multi_country_serving:this.fb.array([])
  });

  getLocationDetail() {
    this.loading = true;
    this.multiLocationService.getLocationDetail(this.LocationID).then(resp => {
      this.loading = false;
      if (resp) {
        this.locationDetail = resp.data;
        for (let i = 0; i < this.locationDetail.multi_serving_country.length; i++){
          (this.locationForm.get("multi_country_serving")as FormArray).push(
            this.fb.group({
              country:[null],
              currency:[null],
              conversion_rate:['']
            })
          )
        }
        
        this.locationForm.patchValue(resp.data);
        
        console.log(this.locationForm.value);

        // this.dialogRef.close(true);
      }
    });
  }

  


  addConvertionRate() {
    (this.locationForm.get("multi_country_serving")as FormArray).push(
      this.fb.group({
        country:[null],
        currency:[null],
        conversion_rate:['']
      })
    )
  }

  removeLocation(index,id) {
    // this.loading = true;
    // this.multiLocationService.removeLocation(id).then(resp => {
    //   this.loading = false;
    //   if (resp) {
    //     (this.locationForm.get("multi_country_serving") as FormArray).removeAt(index);
    //     // this.snackbarService.open("remove trigger successfully.", "", { duration: 3000 });
    //   }
    // });
    (this.locationForm.get("multi_country_serving") as FormArray).removeAt(index);
    

  }


  onSubmit() {
    this.loading = true;
    this.multiLocationService.updatelocation(this.locationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        console.log(this.locationForm.value)
        this.snackbar.open("Location update successfully.", "", { duration: 3000 });
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
    this.getLocationDetail();
    this.getCountrie();
    this.defaultCurrency();
    this.getCurrency();
  }

}
