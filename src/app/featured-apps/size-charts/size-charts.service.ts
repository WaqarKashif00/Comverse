import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SizeChartsService {

  constructor(private authService: AuthService) { }

  getSizeChartList() {
    return Axios.get( environment.backend_url + '/sizechart/sizechart_list', {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  createSetting(data) {
    return Axios.post( environment.backend_url + '/sizechart/setting', data, {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getSettingDetail() {
    return Axios.get( environment.backend_url + '/sizechart/setting', {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getSingleSizeChart(id) {
    return Axios.get(environment.backend_url + '/sizechart/sizechart/' + id, {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  createSizeChart(data) {
    return Axios.post( environment.backend_url + '/sizechart/sizechart', data, {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  updateSizeChart(data) {
    return Axios.put( environment.backend_url + '/sizechart/sizechart', data, {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  deleteSizeChart(id) {
    return Axios.delete( environment.backend_url + '/sizechart/sizechart/' + id, {
      headers: {
        Authorization: this.authService.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }
}
