import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';
import { Validators } from '@angular/forms';
import { CacheSettingService } from './cache-setting.service';



@Component({
  selector: 'app-cache-setting',
  templateUrl: './cache-setting.component.html',
  styleUrls: ['./cache-setting.component.scss']
})
export class CacheSettingComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cacheSettingService: CacheSettingService,
    private snackbar: MatSnackBar,
  ) {}

  loading: boolean = false;
  imageUrl: string = '';
  URLS = URLS;
  sendCacheSettingForm = this.fb.group({
    enable_cache: [false],
    homepage_enable: [false],
    header_enable: [false],
    footer_enable: [false],
    pages_enable: [false],
    auto_reset: [false],
    homepage_reset: [false],
    header_reset: [false],
    footer_reset: [false],
    pages_reset: [false],
  });


  getCacheSettingDetail() {
    this.loading = true;
    this.cacheSettingService.getCacheSettingDetail().then(resp => {
      this.loading = false;
      if (resp) {
        console.log(resp.data)
        this.sendCacheSettingForm.patchValue(resp.data);
      }
    });
  }

  clearCache(sendNow) {
    this.loading = true;
    this.cacheSettingService.clearCacheSetting(sendNow).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Cache cleared successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.configuration]);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.cacheSettingService.getCacheSetting(this.sendCacheSettingForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Cache created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.configuration]);
      }
    });
  }

  ngOnInit(): void {
    this.getCacheSettingDetail();
  }

}
