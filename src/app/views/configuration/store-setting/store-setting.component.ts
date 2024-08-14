import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';
import { StoreSettingService } from './store-settings.service';


@Component({
  selector: 'app-store-setting',
  templateUrl: './store-setting.component.html',
  styleUrls: ['./store-setting.component.scss']
})
export class StoreSettingComponent implements OnInit {

  constructor( 
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private storeSettingService: StoreSettingService,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    ) { }



  URLS = URLS;
  loading: boolean = false;
  domains: string[] = [];

  storeSettingForm = this.fb.group({
    unique_identifier: [""],
    commission_type: [''],
    development: [false],
    search_by_image: [false],
    vendor_wise_fulfillment: [false],
    multi_location: [false],
    vendor_wise_erp: [false]

  })



  onSave() {
    this.loading = true;
    let mainObj;
    mainObj = this.storeSettingForm.value;
    mainObj.domains = this.domains.length ? this.domains.join(",") : "";
    this.storeSettingService.createStoreSetting(mainObj).then((resp)=> {
    this.loading = false;
    if(resp) {
      this.snackbar.open("Store setting saved.", "", { duration: 3000 });
      this.router.navigate([URLS.configuration])
    }
    })

  }



  getDetails() {
    this.loading = true;
    this.storeSettingService.getStoreSetting().then((resp)=> {
      this.loading = false;
      if (resp) {
        this.domains = resp.data.domains ? resp.data.domains.split(",").filter(tag => tag) : [];
        this.storeSettingForm.patchValue(resp.data);
      }
    })
  }




  ngOnInit(): void {
    this.getDetails();
  }

}
