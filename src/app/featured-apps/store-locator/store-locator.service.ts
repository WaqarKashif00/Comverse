import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StoreLocatorService {

  constructor(private authservice: AuthService, private snackbar: MatSnackBar) { }

  // Get Cites

  getMainCities() {
    return Axios.get( environment.backend_url + '/storelocator/store_city_list', {
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



  getLocatorDetail(id) {
    return Axios.get( environment.backend_url + '/storelocator/store_location/' + id, {
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


  createCities(data) {
    return Axios.post( environment.backend_url + '/storelocator/store_city', data, {
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


  updateCities(data) {
    return Axios.put( environment.backend_url + '/storelocator/store_city', data, {
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


  createLocator(data) {
    return Axios.post( environment.backend_url + '/storelocator/store_location', data, {
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


  updateLocator(data) {
    return Axios.put( environment.backend_url + '/storelocator/store_location', data, {
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


  updateCitiesPosition(type, categoryData) {
    return Axios.put( environment.backend_url + '/storelocator/store_city_position', categoryData, {
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
  updateStorePosition(type, subCategoryData) {
    return Axios.put( environment.backend_url + '/storelocator/store_location_position', subCategoryData, {
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


  getStoreLocation(mainCategoryID) {
    return Axios.get( environment.backend_url + '/storelocator/store_location_list?city_id=' + mainCategoryID, {
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


  deleteItem(id, type) {
    let endpoint = "";
    switch (type) {
      case "main":
        endpoint = "store_city";
        break;
      case "sub":
        endpoint = "store_location";
        break;
      default:
        break;
    }
    return Axios.delete( environment.backend_url + '/storelocator/' + endpoint + "/" + id, {
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


  changeStatus(id, category_type, is_active) {
    return Axios.put( environment.backend_url + '/storelocator/store_location_change_status', {
      id,
      category_type,
      is_active
    }, {
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
