import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ERPService {

  constructor(private authservice: AuthService) { }

  getERPList() {
    return Axios.get( environment.backend_url + '/erp/integration_list' ,{
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

  
  getLocationList() {
    return Axios.get( environment.backend_url + '/setting/dropdown/location' ,{
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


  getTypeList() {
    return Axios.get( environment.backend_url + '/erp/integration_type' ,{
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


  getIntegrationDetail(id) {
    return Axios.get( environment.backend_url + '/erp/integration/' + id,{
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


  getSubLocationList(location_id) {
    return Axios.get( environment.backend_url + '/setting/dropdown/sub_location?location_id='+ location_id,{
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


  getFieldList(type) {
    return Axios.get( environment.backend_url + '/erp/integration_fields?type='+ type,{
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


  getDefaultSettingDetail() {
    return Axios.get( environment.backend_url + '/erp/inventory_sync_setting' ,{
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


  getInventoryList() {
    return Axios.get( environment.backend_url + '/erp/inventory_sync_logs' ,{
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


  saveIntegartion(data) {
    return Axios.post(environment.backend_url + '/erp/integration', data, {
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


  updateIntegartion(data) {
    return Axios.put(environment.backend_url + '/erp/integration', data, {
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


  saveSetting(data) {
    return Axios.post(environment.backend_url + '/erp/inventory_sync_setting', data, {
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


  deleteERPIntegration(id) {
    return Axios.delete(environment.backend_url + '/erp/integration/' + id, {
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


  removeTrigger(id) {
    return Axios.delete(environment.backend_url + '/erp/triggers/' + id, {
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

}
