import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import URLS from '../shared/urls';

interface UserPermission {
  id: number;
  dashboard: boolean;
  customization: boolean;
  theme: boolean;
  products: boolean;
  orders: boolean;
  customer: boolean;
  discounts: boolean;
  configuration: boolean;
  vendor: boolean;
  product_list : boolean;
  product_groups : boolean;
  collections : boolean;
  categories : boolean;
  brands : boolean;
  homepage : boolean;
  static_pages : boolean;
  header : boolean;
  footer : boolean;
  navigation : boolean;
  filters : boolean;
  main_discounts : boolean;
  coupons : boolean;
  store_setting : boolean;
  user_management : boolean;
  loyalty : boolean;
  shipping_regions : boolean;
  shipping_methods : boolean;
  checkout_setting : boolean;
  approvals : boolean;
  notifications: boolean;
  featured_apps: boolean;
  sizechart: boolean;
  wishlist:boolean;
  storelocator:boolean;
  timeslot:boolean;
  socialfeed:boolean;
  job_posting:boolean;
  order_return:boolean;
  cache_settings:boolean;
  preferences:boolean;
  payment_gateway:boolean;
  sms_configurations:boolean;
  email_configurations:boolean;
  reports:boolean;
  multi_location:boolean;
  erp:boolean;
  courier:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookies: CookieService, private router: Router) {
    if(this.cookies.check('token')) {
      this.signedIn = true
      this.token = this.cookies.get('token')
    }
    if(localStorage.getItem('permissions')) {
      this.user_permissions = JSON.parse(localStorage.getItem('permissions'));
    }
    if(localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    if(window.location.hostname.indexOf("vendor") > -1) {
      this.isVendorPortal = true;
      document.title = environment.client_name + " seller portal";
    }
  }

  signedIn: boolean = false;
  token: string;
  user_permissions: UserPermission;
  isVendorPortal: boolean = false;

  vendor_permission = {
    id:0,
    dashboard: true,
    customization: false,
    theme: false,
    products: true,
    orders: true,
    customer: true,
    discounts: true,
    configuration: true,
    vendor: false,
    product_list : true,
    product_groups : true,
    collections : true,
    categories : true,
    brands : false,
    homepage : false,
    static_pages : false,
    header : false,
    footer : false,
    navigation : false,
    filters : false,
    main_discounts : true,
    coupons : true,
    store_setting : false,
    user_management : false,
    loyalty : false,
    shipping_regions : false,
    shipping_methods : true,
    checkout_setting : false,
    approvals: false,
    notifications: false,
    featured_apps: true,
    sizechart: true,
    wishlist:false,
    storelocator:false,
    timeslot:false,
    socialfeed:false,
    job_posting:false,
    order_return:false,
    cache_settings:false,
    preferences:false,
    payment_gateway:false,
    sms_configurations:false,
    email_configurations:false,
    multi_location:false,
    erp:false,
    reports:false,
    courier:true,
  }

  user = {
    id: null,
    email: "",
    first_name: "",
    last_name: "",
    token: "",
    username: "",
    owner: false,
    is_vendor: false,
    vendor_id:null
  };

  signin(token: string, permissions: UserPermission, user) {
    this.cookies.set('token', token, 1, '/');
    this.token = token;
    delete user.permission;
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    if (user.is_vendor) {
      this.user_permissions = this.vendor_permission;
      localStorage.setItem('permissions', JSON.stringify(this.vendor_permission));
      this.signedIn = true;

    } else {
      this.user_permissions = permissions;
      localStorage.setItem('permissions', JSON.stringify(permissions));
      this.signedIn = true;

    }
  }

  signout() {
    this.cookies.delete('token');
    this.token = undefined;
    this.user_permissions = null;
    this.signedIn = false;
    localStorage.removeItem('permissions');
    localStorage.removeItem('user');
    this.router.navigate([URLS.signin]);
  }
}
