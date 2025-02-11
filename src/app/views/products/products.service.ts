import { Injectable } from '@angular/core';
import Axios  from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private authService: AuthService) { }

  getProductsList(page: number, limit: number, filterString: string, searchString: string) {
    return Axios.get( environment.backend_url + '/products/product_list?page=' + page + '&limit=' + limit + filterString + searchString, {
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

  getProducts(page: number, limit: number, searchQuery: string) {
    return Axios.get( environment.backend_url + '/order/orders_product_list?page=' + page + "&limit=" + limit + "&search=" + searchQuery, {
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

  getProductTypes() {
    return Axios.get( environment.backend_url + '/products/product_type', {
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

  getProductGroups(page: number, limit: number, filterString: string, searchString: string) {
    return Axios.get( environment.backend_url + '/products/product_group_list?page=' + page + '&limit=' + limit + filterString + searchString, {
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

  createProductGroup(data) {
    return Axios.post( environment.backend_url + '/products/product_group', data, {
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

  getProductGroupDetail(id) {
    return Axios.get( environment.backend_url + '/products/product_group/' + id, {
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

  updateProductGroup(data) {
    return Axios.put( environment.backend_url + '/products/product_group' , data, {
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

  deleteProductGroup(id, newGroupID) {
    return Axios.delete( environment.backend_url + '/products/product_group/' + id + '?product_group=' + newGroupID, {
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

  createProduct(data) {
    return Axios.post( environment.backend_url + '/products/product', data, {
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

  updateProduct(data) {
    return Axios.put( environment.backend_url + '/products/product', data, {
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

  getProductDetail(id) {
    return Axios.get( environment.backend_url + '/products/product/' + id, {
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

  createVariant(data) {
    return Axios.post( environment.backend_url + '/products/variant', data, {
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

  getVariantDetail(id) {
    return Axios.get( environment.backend_url + '/products/variant/' + id, {
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

  updateVariant(data) {
    return Axios.put( environment.backend_url + '/products/variant', data, {
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

  deleteVariant(id) {
    return Axios.delete( environment.backend_url + '/products/variant/' + id, {
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

  getCommissions(vendor_id) {
    return Axios.get( environment.backend_url + '/vendors/commission_list?vendor_id=' + vendor_id , {
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




  /**
   * 
   * @param {Object} data
   * @param {number[]} data.ids
   * @param {string} data.status - The status to change. Can be 'active' or 'approve'.
   * @param {boolean} data.value
   */
  changeProductStatus(data) {
    return Axios.put( environment.backend_url + '/products/products_status_change', data, {
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

  applyBulkTags(data) {
    return Axios.put( environment.backend_url + '/products/products_bulk_tags', data, {
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

  bulkOrganizeProducts(data) {
    return Axios.put( environment.backend_url + '/products/products_bulk_organize', data, {
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

  deleteProducts(ids: string) {
    return Axios.delete(environment.backend_url + '/products/product?ids=' + ids, {
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

  exportProducts(IDs) {
    return Axios.get(environment.backend_url + '/products/products_export?ids=' + IDs, {
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

  importProducts(data) {
    return Axios.post(environment.backend_url + '/products/products_import', data, {
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

  getInventoryLocations() {
    return Axios.get(environment.backend_url + '/products/variant_locations', {
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

  getProductsWiseReview(page: number, limit: number, searchString: string) {
    return Axios.get( environment.backend_url + '/products/product_wise_review?page=' + page + '&limit=' + limit + searchString, {
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


  getLatestReview(page: number, limit: number, filterString: string, searchString: string) {
    return Axios.get( environment.backend_url + '/products/product_latest_review?page=' + page + '&limit=' + limit + filterString + searchString, {
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


  getProductDetailReview(product_id, page: number, limit: number) {
    return Axios.get( environment.backend_url + '/products/product_review?product_id='+ product_id +'&page=' + page + '&limit=' + limit, {
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


  deleteProductReview(id) {
    return Axios.delete(environment.backend_url + '/products/delete_review/' + id, {
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
