import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CacheSettingService {

  constructor(private authservice: AuthService, private snackbar: MatSnackBar) { }


  getCacheSetting(data) {
    return Axios.post(environment.backend_url + '/setting/cache_setting', data, {
      headers: {
        Authorization: this.authservice.token
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
      return error;
    });
  }


  getCacheSettingDetail() {
    return Axios.get(environment.backend_url + '/setting/cache_setting', {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  clearCacheSetting(data) {
    return Axios.delete(environment.backend_url + '/setting/delete_cache?key=' + data, {
      headers: {
        Authorization: this.authservice.token
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
      return error;
    });
  }
}
