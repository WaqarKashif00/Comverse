import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private authService: AuthService, private readonly http: HttpClient) { }

  is_vendor = this.authService.user.is_vendor;

  getCustomersList(search: string = ""): Observable<any> {
    return this.http.get(environment.backend_url + '/order/orders_customer_list?search=' + search, {
      headers: {
        Authorization: this.authService.token
      }
    });
  }

  getPaymentMethods() {
    return Axios.get(environment.backend_url + '/setting/payment_method', {
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

  getOrderPostingTable() {
    return Axios.get(environment.backend_url + '/erp/order_posting_logs', {
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
  getOrderPostingQueueTable() {
    return Axios.get(environment.backend_url + '/erp/order_posting_queue', {
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

  createOrder(data) {
    return Axios.post(environment.backend_url + '/order/draft_order', data, {
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

  getOrders(page: number, limit: number, search: string, filterScring: string) {
    return Axios.get(environment.backend_url + '/order/parent_order_list?page=' + page + '&limit=' + limit + '&search=' + search + filterScring, {
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

  getVendorOrder(page: number, limit: number, search: string, filterString: string) {
    return Axios.get(environment.backend_url + '/vendors/vendor_order_list?page=' + page + '&limit=' + limit + '&search=' + search + filterString, {
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

  getMainOrder(id) {
    return Axios.get(environment.backend_url + '/order/parent_order/' + id, {
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

  getChildOrder(id) {
    return Axios.get(environment.backend_url + '/order/childorder/' + id, {
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

  getDraftOrder(id) {
    return Axios.get(environment.backend_url + '/order/draft_order/' + id, {
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

  updateMainOrder(data) {
    return Axios.put(environment.backend_url + '/order/parent_order', data, {
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

  updateChildOrder(data) {
    return Axios.put(environment.backend_url + '/order/childorder', data, {
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

  updateDraftOrder(data) {
    return Axios.put(environment.backend_url + '/order/draft_order', data, {
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

  getDraftOrders(page: number, limit: number, search: string) {
    return Axios.get(environment.backend_url + '/order/draft_order_list?page=' + page + '&limit=' + limit + '&search=' + search, {
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

  changeOrderStatus(data, endpoint) {
    return Axios.put(environment.backend_url + '/order/' + endpoint, data, {
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


  changeChildOrderStatus(data) {
    return Axios.put(environment.backend_url + '/order/childorder_status_change', data, {
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

  exportOrders(IDs) {
    return Axios.get(environment.backend_url + '/order/orders_export?ids=' + IDs, {
      headers: {
        Authorization: this.authService.token
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }

  downloadOrderInvoice(id) {
    return Axios.get(environment.backend_url + '/order/orders_invoice?order_id=' + id, {
      headers: {
        Accept: 'application/pdf',
        Authorization: this.authService.token
      },
      responseType: "blob"
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }

  deleteLineItem(id) {
    return Axios.delete(environment.backend_url + '/order/childorder_lineitem/' + id, {
      headers: {
        Authorization: this.authService.token
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }

  createChildOrder(data) {
    return Axios.post(environment.backend_url + '/order/childorder', data, {
      headers: {
        Authorization: this.authService.token
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }

  postComment(data) {
    return Axios.post(environment.backend_url + '/order/order_history', data, {
      headers: {
        Authorization: this.authService.token
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }

  getOrderHistory(orderID, childOrderID) {
    let endpoint = "/order/order_history";
    if (orderID) {
      endpoint += "?order_id=" + orderID;
    }
    if (childOrderID) {
      endpoint += "?childorder_id=" + childOrderID;
    }
    return Axios.get(environment.backend_url + endpoint, {
      headers: {
        Authorization: this.authService.token
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }

  refundChildOrder(id) {
    return Axios.get(environment.backend_url + '/order/refund_child_order/' + id, {
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


  refundOrder(id) {
    return Axios.get(environment.backend_url + '/order/refund_parent_order/' + id, {
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


  salesReport(start_date, end_date) {
    let endPoint;
    if (!start_date && !end_date) {
      endPoint = "/dashboard/orders_report";
    } else if (start_date && !end_date) {
      endPoint = "/dashboard/orders_report?start_date=" + start_date;
    } else if (!start_date && end_date) {
      endPoint = "/dashboard/orders_report?end_date=" + end_date;
    } else {
      endPoint = "/dashboard/orders_report?start_date=" + start_date + "&end_date=" + end_date;
    }
    return Axios.get(environment.backend_url + endPoint, {
      headers: {
        Authorization: this.authService.token
      }
    })
      .catch(error => {
        if (error.response.data.detail == "Session expired, Reopen the application!") {
          this.authService.signout();
        }
        return error;
      });
  }


}
