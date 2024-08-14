import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MultiLocationService {

  constructor(private authService: AuthService) { }


  locationSubmit(data) {
    return Axios.post(environment.backend_url + '/multi_locations/location', data, {
      headers: {
        Authorization: this.authService.token
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
      return error;
    });
  }
  updatelocation(data) {
    return Axios.put(environment.backend_url + '/multi_locations/location', data, {
      headers: {
        Authorization: this.authService.token
      }
    }).catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authService.signout();
      }
      return error;
    });
  }

  getLocationDetail(id) {
    return Axios.get( environment.backend_url + '/multi_locations/location/'+id, {
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
  removeLocation(id) {
    return Axios.get( environment.backend_url + '/multi_locations/multi_serving_country/'+id, {
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

  getCountrie() {
    return Axios.get( environment.backend_url + '/setting/dropdown/country', {
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
  defaultCurrency() {
    return Axios.get( environment.backend_url + '/setting/dropdown/currency?multi_serving_country='+ true, {
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

  // Get Currency

  getCurrency() {
    return Axios.get( environment.backend_url + '/setting/dropdown/currency', {
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
    return Axios.post( environment.backend_url + '/multi_locations/settings', data, {
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
    return Axios.get( environment.backend_url + '/multi_locations/settings', {
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

  // getTimeSlotList(page, limit) {
  //   return Axios.get( environment.backend_url + '/timeslot/timeslot_list?page=' + page + '&limit=' + limit, {
  //     headers: {
  //       Authorization: this.authService.token
  //     }
  //   })
  //   .catch(error => {
  //     if (error.response.data.detail == "Session expired, Reopen the application!") {
  //       this.authService.signout();
  //     }
  //   });
  // }

  getLocationList() {
    return Axios.get( environment.backend_url + '/multi_locations/location', {
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
  getSubLocationGroupList(id) {
    return Axios.get( environment.backend_url + '/setting/dropdown/sub_location_group?location_id='+id, {
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
  getSubLocationGroup(id) {
    return Axios.get( environment.backend_url + '/setting/dropdown/sub_location_group?location_id='+id, {
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
  getCityList(id) {
    return Axios.get( environment.backend_url + '/setting/dropdown/city?location_id='+id, {
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

  createSubLocationGroup(data) {
    return Axios.post( environment.backend_url + '/multi_locations/sub_location_group', data, {
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
  createSublocation(data) {
    return Axios.post( environment.backend_url + '/multi_locations/sub_location', data, {
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
  updateSubLocationGroup(data) {
    return Axios.put( environment.backend_url + '/multi_locations/sub_location', data, {
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
  createSubLocation(data) {
    return Axios.post( environment.backend_url + '/multi_locations/sub_location_group', data, {
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
  editSubLocationGroup(data) {
    return Axios.put( environment.backend_url + '/multi_locations/sub_location_group', data, {
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

  getSingleSubLocationGroup(id) {
    return Axios.get( environment.backend_url + '/multi_locations/sub_location_group/'+ id, {
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

  getSubLocationList(id) {
    return Axios.get( environment.backend_url + '/setting/dropdown/sub_location?location_id='+id, {
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
  getSubLocationDetail(id) {
    return Axios.get( environment.backend_url + '/multi_locations/sub_location/'+id, {
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

  deleteLocation(id) {
    return Axios.delete(environment.backend_url + '/multi_locations/location/' + id, {
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
  deleteSubLocationGroup(id) {
    return Axios.delete(environment.backend_url + '/multi_locations/sub_location_group/' + id, {
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
  deleteSubLocation(id) {
    return Axios.delete(environment.backend_url + '/multi_locations/sub_location/' + id, {
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

  createTimeSlot(data) {
    return Axios.post( environment.backend_url + '/timeslot/timeslot', data, {
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

  createTimeSlotSetting(data) {
    return Axios.post( environment.backend_url + '/timeslot/setting', data, {
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


  getTimeSlotSettings() {
    return Axios.get( environment.backend_url + '/timeslot/setting', {
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

  updateTimeSlot(data) {
    return Axios.put( environment.backend_url + '/timeslot/timeslot', data, {
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

  getSingleTimeSlot(id) {
    return Axios.get(environment.backend_url + '/timeslot/timeslot/' + id, {
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

  deleteTimeSlotDetail(id) {
    return Axios.delete( environment.backend_url + '/timeslot/timeslotdetail/' + id, {
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

  deleteTimeSlot(id) {
    return Axios.delete( environment.backend_url + '/timeslot/timeslot/' + id, {
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


  createProductSettingSocialFeed(data) {
    return Axios.post( environment.backend_url + '/socialfeed/settings', data, {
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



  getSingleSettingProductSocialFeed() {
    return Axios.get(environment.backend_url + '/socialfeed/settings', {
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

  updateProductSocialFeed(data) {
    return Axios.put( environment.backend_url + '/socialfeed/feed', data, {
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

  deleteFeed(id) {
    return Axios.delete( environment.backend_url + '/socialfeed/feed/' + id, {
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

  // Location Details

  // getLocation() {
  //   return Axios.get( environment.backend_url + '/timeslot/city_list', {
  //     headers: {
  //       Authorization: this.authService.token
  //     }
  //   })
  //   .catch(error => {
  //     if (error.response.data.detail == "Session expired, Reopen the application!") {
  //       this.authService.signout();
  //     }
  //   });
  // }
}
