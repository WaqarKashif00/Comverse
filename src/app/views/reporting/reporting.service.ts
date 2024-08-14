import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {

  constructor(private authService: AuthService) { }


  createSchedulerSetting(data) {
    return Axios.post( environment.backend_url + '/reports/report_scheduler_setting', data, {
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

  editSchedulerSetting(data) {
    return Axios.put( environment.backend_url + '/reports/report_scheduler_setting', data, {
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

  getFieldsList(page, limit, date_filter, fields) {
    let endpoint;
    if(date_filter) {
      endpoint = '/reports/orders_report?page=' + page + '&limit=' + limit + date_filter + "&query=" +fields
    } else {
      endpoint = '/reports/orders_report?page=' + page + '&limit='+ limit + '&query='+ fields
    }
    return Axios.get( environment.backend_url + endpoint, {
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

  exportFieldsList(date_filter, fields) {
    let endpoint;
    let dateFormatChange;
    if(date_filter) {
      dateFormatChange = date_filter.replace("&","")
      endpoint = '/reports/orders_export?'+ dateFormatChange + "&query=" +fields
    } else {
      endpoint = '/reports/orders_export?query=' +  fields;
    }
    return Axios.get( environment.backend_url + endpoint, {
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




  getReportSchedulerSettingsList() {
    return Axios.get( environment.backend_url + '/reports/report_scheduler_setting_list', {
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

  getSingleReportSchedulerSetting(id) {
    return Axios.get( environment.backend_url + '/reports/report_scheduler_setting/'+id, {
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


  createReportSetting(data) {
    return Axios.post( environment.backend_url + '/reports/report_setting', data, {
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


  getSalesReport() {
    return Axios.get( environment.backend_url + '/reports/report_setting/sales_report', {
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

  deleteSchedulerSetting(id) {
    return Axios.delete( environment.backend_url + '/reports/report_scheduler_setting/' + id, {
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
