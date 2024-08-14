import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LogisticConfigurationService {

  constructor(private authService: AuthService) { }

  getIntegratedCourierList(page, limit, vendor_id, is_vendor) {
   let url;
   if (is_vendor) {
      url = environment.logistic_hub_backend_url + '/setting/integrated_courier_data_page?page=' + page + '&limit=' + limit + "&vendor_id="+ vendor_id    
   }else {
    if (vendor_id) {
      url = environment.logistic_hub_backend_url + '/setting/integrated_courier_data_page?page=' + page + '&limit=' + limit + vendor_id
     }else {
      url = environment.logistic_hub_backend_url + '/setting/integrated_courier_data_page?page=' + page + '&limit=' + limit
   }
  }
  return Axios.get(url, {
    headers: {
      storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

    }
  })
  .catch(error => {
    if (error.response.data.detail == "Session expired, Reopen the application!") {
      this.authService.signout();
    }
  });
  }
  getCourierList() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/courier_list', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
        
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getFields(id) {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/courier_list/'+id, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
        
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getIntegratedCourierDetails(id){
    return Axios.get(environment.logistic_hub_backend_url + '/setting/integrated_courier_data/'+id, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
        
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  createIntegratedCourier(data) {
    return Axios.post( environment.logistic_hub_backend_url + '/setting/integrated_courier_data', data, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  updateIntegratedCourier(data) {
    return Axios.put( environment.logistic_hub_backend_url + '/setting/integrated_courier_data', data, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }



    getLocation() {
    return Axios.get(environment.backend_url + '/setting/dropdown/location', {
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

  getCities() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/country_cities', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
      });
  }


  getSubLocation(id) {
    return Axios.get(environment.backend_url + '/setting/dropdown/sub_location?location_id=' + id, {
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


  deleteIntegratedCourier(id){
    return Axios.delete(environment.logistic_hub_backend_url + '/setting/integrated_courier_data/'+id, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
        
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  createAutomation(data) {
    return Axios.post(environment.backend_url + '/setting/courier_automation', data, {
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

  getAutomation() {
    return Axios.get( environment.backend_url + '/setting/courier_automation', {
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


  getDefaultPriority(storeID) {
    let storeParameter = storeID ? '?store_id=' + storeID : '';
    return Axios.get(environment.logistic_hub_backend_url + '/setting/courier_priority_local_page' + storeParameter, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getAdvancePriority() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/city_priority', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getAdvanceInternationalPriority() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/country_priority', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getSingleAdvancePriority(id) {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/mapped_couriers/'+ id, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  getSingleInternationalAdvancePriority() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/country_int_courier', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  updateDefaultPriority(data) {
    return Axios.put(environment.logistic_hub_backend_url + '/setting/courier_priority_local', data, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  updateDefaultInternationalPriority(data) {
    return Axios.put(environment.logistic_hub_backend_url + '/setting/courier_priority_int', data, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  getDefaultInternationalPriority(storeID) {
    let storeParameter = storeID ? '?store_id=' + storeID : '';
    return Axios.get(environment.logistic_hub_backend_url + '/setting/courier_priority_int_page' + storeParameter, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  updateCityPriority(data) {
    return Axios.post(environment.logistic_hub_backend_url + '/setting/city_priority', data, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }

  updateCountryPriority(data) {
    return Axios.post(environment.logistic_hub_backend_url + '/setting/country_priority', data, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  getInvoiceSetting() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/invoice_settings', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  deleteCityPriority(id) {
    return Axios.delete(environment.logistic_hub_backend_url + '/setting/city_priority/'+id, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  deleteCountryPriority(id) {
    return Axios.delete(environment.logistic_hub_backend_url + '/setting/country_priority/'+id, {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"

      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


  saveInvoiceSetting(data) {
    return Axios.put(environment.logistic_hub_backend_url + '/setting/invoice_settings', data ,{
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }



  getCountries() {
    return Axios.get(environment.logistic_hub_backend_url + '/setting/country_list', {
      headers: {
        storeToken: "Token 3842b591144783520c58b24ef89684f8ab095bf5"
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
    });
  }


}




