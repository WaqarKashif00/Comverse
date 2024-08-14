import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService {

  constructor(private authservice: AuthService, private snackbar: MatSnackBar) { }

  getActivePaymentGatewaysList() {
    return Axios.get(environment.backend_url + '/paymentgateway/gateway_credentials', {
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


  getGatewaysList() {
    return Axios.get(environment.backend_url + '/paymentgateway/gateways', {
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

  getEditGatewaysList() {
    return Axios.get(environment.backend_url + '/paymentgateway/gateways_type_list', {
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


  getFields(data) {
    return Axios.get(environment.backend_url + '/paymentgateway/gateway_fields?type=' + data, {
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


  getPaymentGatewayDetail(id) {
    return Axios.get(environment.backend_url + '/paymentgateway/gateway_credentials/'+ id, {
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


  createPaymentGateway(data) {
    return Axios.post( environment.backend_url + '/paymentgateway/gateway_credentials', data, {
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

  updatePaymentGateway(data) {
    return Axios.put( environment.backend_url + '/paymentgateway/gateway_credentials', data, {
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

  deletePaymentGateway(id) {
    return Axios.delete(environment.backend_url + '/paymentgateway/gateway_credentials/' + id, {
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

  updateGatewayStatus(data) {
    return Axios.put( environment.backend_url + '/paymentgateway/gateway_status_change', data, {
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
