import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishListsService {

  constructor(private authService: AuthService) { }

  getWishList(page: number, pageLimit: number,) {
    return Axios.get(environment.backend_url + '/wishlist/product_list?page=' + page + '&limit=' + pageLimit, {
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
  getWishListCustomers(pageCustomer: number, pageLimitCustomer: number,) {
    return Axios.get(environment.backend_url + '/wishlist/customer_list?page=' + pageCustomer + '&limit=' + pageLimitCustomer, {
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

  getWishListProductDetail(id) {
    return Axios.get(environment.backend_url + '/wishlist/product_detail/' + id, {
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


  getWishListCustomer(id,page: number, pageLimit: number,) {
    return Axios.get(environment.backend_url + '/wishlist/customer_product/' + id +'?page='+ page + '&limit=' + pageLimit, {
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

  // APi For Dlete The Item From The Table 

  deleteWishList(id) {
    return Axios.delete(environment.backend_url + '/wishlist/delete_item/' + id, {
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
