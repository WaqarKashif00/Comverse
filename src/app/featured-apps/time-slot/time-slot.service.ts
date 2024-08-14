import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {

  constructor(private authService: AuthService) { }

  getTimeSlotList(page, limit) {
    return Axios.get( environment.backend_url + '/timeslot/timeslot_list?page=' + page + '&limit=' + limit, {
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
    return Axios.get( environment.backend_url + '/timeslot/city_list', {
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
}
