import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { Validators } from '@angular/forms';
import { MultiLocationService } from '../multi-location.service';


@Component({
  selector: 'app-multi-location',
  templateUrl: './multi-location.component.html',
  styleUrls: ['./multi-location.component.scss']
})
export class MultiLocationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private multiLocationService: MultiLocationService,
    private snackbar: MatSnackBar,
  ) {}


  URLS = URLS;
  loading = false;
  locationList = [];

  goBack(){
    this.router.navigate([URLS.configuration]);
  }

  configrationForm = this.fb.group({
    location_wise_inventory: [false],
    is_geo_location: [false],
    auto_detection: [false],
    multi_currency: [false],
    currency: [[],''],

  });

  getSettingDetail() {
    this.loading = true;
    this.multiLocationService.getSettingDetail().then(resp => {
      this.loading = false;
      if (resp) {
        this.configrationForm.patchValue(resp.data);
      }
    });
  }



  onSubmit() {
    this.loading = true;
    this.multiLocationService.createSetting(this.configrationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        // this.dialogRef.close(true);
      }
    });
  }

  getCurrency() {
    this.loading = true;
    this.multiLocationService.getCurrency().then(resp => {
      this.loading = false;
      if (resp) {
        this.locationList = resp.data;

        // this.dialogRef.close(true);
      }
    });
  }

  ngOnInit(): void {
    this.getSettingDetail();
    this.getCurrency();
  }

}
