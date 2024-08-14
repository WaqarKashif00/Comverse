import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import URLS from 'src/app/shared/urls';
import { UsersService } from '../users.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersService: UsersService,
    public dialog: MatDialog,
  ) {
    this.userId = parseInt(this.route.snapshot.paramMap.get('id'));
    if (this.userId !== this.loggedInUserID) {
      this.isPermissionsEditable = true;
    }
  }

  sideDrawer: string = "";
  clientName: string = environment.client_name;
  userId = null;
  loggedInUserID = this.authService.user.id;
  superUser = this.authService.user.owner;
  blocked = false;
  displayedColumns: string[] = ['date', 'ip_address', 'location'];
  dataSource = [];
  firstNameField = new FormControl("", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]);
  lastNameField = new FormControl("", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]);
  userDetail = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    newsletter: false,
    username: "",
    permissions: {
      id: null,
      dashboard: false,
      customization: false,
      theme: false,
      products: false,
      orders: false,
      customer: false,
      discounts: false,
      configuration: false,
      vendor: false,
      product_list: false,
      product_groups: false,
      collections: false,
      categories: false,
      brands: false,
      homepage: false,
      static_pages: false,
      header: false,
      footer: false,
      navigation: false,
      filters: false,
      main_discounts: false,
      coupons: false,
      store_setting: false,
      user_management: false,
      loyalty: false,
      shipping_regions: false,
      shipping_methods: false,
      checkout_setting: false,
      approvals: false,
      notifications: false,
      featured_apps: false,
      sizechart: false,
      wishlist: false,
      job_posting: false,
      socialfeed: false,
      storelocator: false,
      timeslot: false,
      order_return: false,
      cache_settings:false,
      preferences:false,
      payment_gateway:false,
      sms_configurations:false,
      email_configurations:false,
      multi_location:false,
      erp:false,
      reports:false,
      courier:false,
    }
  };
  nameInitials: string = "";
  isPermissionsEditable: boolean = false;
  loading: boolean = true;

  ngOnInit(): void {
    this.getUserDetail();
  }
  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;

  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  goBack() {
    this.router.navigate([URLS.userManagement, URLS.all]);
  }

  getUserDetail() {
    this.usersService.getUser(this.userId).then(resp => {
      if (resp) {
        this.userDetail = resp.data;
        this.dataSource = resp.data.last_login_list;
        this.blocked = resp.data.is_blocked;
        this.firstNameField.setValue(resp.data.first_name);
        this.lastNameField.setValue(resp.data.last_name);
        if (!resp.data.is_superuser && this.userId !== this.loggedInUserID) {
          this.isPermissionsEditable = true;
        }
        this.loading = false;
      }
    });
  }

  customizationPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.customization = true;
    } else if (!this.userDetail.permissions.header && !this.userDetail.permissions.footer && !this.userDetail.permissions.homepage &&
      !this.userDetail.permissions.static_pages && !this.userDetail.permissions.navigation && !this.userDetail.permissions.filters)
      this.userDetail.permissions.customization = false;

  }
  customaizationCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.header = true;
      this.userDetail.permissions.footer = true;
      this.userDetail.permissions.homepage = true;
      this.userDetail.permissions.static_pages = true;
      this.userDetail.permissions.navigation = true;
      this.userDetail.permissions.filters = true;
    } else {
      this.userDetail.permissions.header = false;
      this.userDetail.permissions.footer = false;
      this.userDetail.permissions.homepage = false;
      this.userDetail.permissions.static_pages = false;
      this.userDetail.permissions.navigation = false;
      this.userDetail.permissions.filters = false;
    }
  }

  configurationPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.configuration = true;
    } else if (!this.userDetail.permissions.store_setting  && !this.userDetail.permissions.shipping_methods
       && !this.userDetail.permissions.shipping_regions && !this.userDetail.permissions.checkout_setting && !this.userDetail.permissions.user_management && !this.userDetail.permissions.cache_settings  && !this.userDetail.permissions.preferences && !this.userDetail.permissions.payment_gateway && !this.userDetail.permissions.sms_configurations && !this.userDetail.permissions.email_configurations) {
      this.userDetail.permissions.configuration = false && !this.userDetail.permissions.multi_location && !this.userDetail.permissions.erp && !this.userDetail.permissions.courier;
    }
  }

  featuredAppPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.featured_apps = true;
    } else if (!this.userDetail.permissions.storelocator && !this.userDetail.permissions.loyalty && !this.userDetail.permissions.wishlist
      && !this.userDetail.permissions.timeslot && !this.userDetail.permissions.wishlist && !this.userDetail.permissions.socialfeed && !this.userDetail.permissions.notifications && !this.userDetail.permissions.order_return) {
      this.userDetail.permissions.featured_apps = false ;
    }
  }


  configurationCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.store_setting = true;
      this.userDetail.permissions.shipping_methods = true;
      this.userDetail.permissions.shipping_regions = true;
      this.userDetail.permissions.checkout_setting = true;
      this.userDetail.permissions.user_management = true;
      this.userDetail.permissions.cache_settings = true;
      this.userDetail.permissions.preferences = true;
      this.userDetail.permissions.payment_gateway = true;
      this.userDetail.permissions.sms_configurations = true;
      this.userDetail.permissions.email_configurations = true;
      this.userDetail.permissions.multi_location = true;
      this.userDetail.permissions.erp = true;
      this.userDetail.permissions.courier = true;


    } else {
      this.userDetail.permissions.store_setting = false;
      this.userDetail.permissions.shipping_methods = false;
      this.userDetail.permissions.shipping_regions = false;
      this.userDetail.permissions.checkout_setting = false;
      this.userDetail.permissions.user_management = false;
      this.userDetail.permissions.cache_settings = false;
      this.userDetail.permissions.preferences = false;
      this.userDetail.permissions.payment_gateway = false;
      this.userDetail.permissions.sms_configurations = false;
      this.userDetail.permissions.email_configurations = false;
      this.userDetail.permissions.multi_location = false;
      this.userDetail.permissions.erp = false;
      this.userDetail.permissions.courier = false;

    }
  }

  productsPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.products = true;
    } else if (!this.userDetail.permissions.product_list && !this.userDetail.permissions.product_groups && !this.userDetail.permissions.collections &&
      !this.userDetail.permissions.categories && !this.userDetail.permissions.brands) {
      this.userDetail.permissions.products = false;

    }
  }

  productsCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.product_list = true;
      this.userDetail.permissions.product_groups = true;
      this.userDetail.permissions.collections = true;
      this.userDetail.permissions.brands = true;
      this.userDetail.permissions.categories = true;
    } else {
      this.userDetail.permissions.product_groups = false;
      this.userDetail.permissions.product_list = false;
      this.userDetail.permissions.collections = false;
      this.userDetail.permissions.brands = false;
      this.userDetail.permissions.categories = false;
    }
  }


  discountPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.discounts = true;
    } else if (!this.userDetail.permissions.main_discounts && !this.userDetail.permissions.coupons) {
      this.userDetail.permissions.discounts = false;
    }
  }

  discountCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.main_discounts = true;
      this.userDetail.permissions.coupons = true;
    } else {
      this.userDetail.permissions.main_discounts = false;
      this.userDetail.permissions.coupons = false;
    }
  }


  featuredAppsCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userDetail.permissions.notifications = true;
      this.userDetail.permissions.loyalty = true;
      this.userDetail.permissions.wishlist = true;
      this.userDetail.permissions.sizechart = true;
      this.userDetail.permissions.timeslot = true;
      this.userDetail.permissions.socialfeed = true;
      this.userDetail.permissions.job_posting = true;
      this.userDetail.permissions.storelocator = true;
      this.userDetail.permissions.order_return = true;



    } else {
      this.userDetail.permissions.notifications = false;
      this.userDetail.permissions.loyalty = false;
      this.userDetail.permissions.wishlist = false;
      this.userDetail.permissions.sizechart = false;
      this.userDetail.permissions.timeslot = false;
      this.userDetail.permissions.socialfeed = false;
      this.userDetail.permissions.job_posting = false;
      this.userDetail.permissions.storelocator = false;
      this.userDetail.permissions.order_return = false;

    }
  }

  saveInfo() {
    this.firstNameField.markAsTouched();
    this.lastNameField.markAsTouched();
    if (!this.firstNameField.valid || !this.lastNameField.valid) {
      return false;
    }
    this.loading = true;
    let data = {
      id: this.userDetail.id,
      first_name: this.firstNameField.value,
      last_name: this.lastNameField.value,
      username: this.userDetail.username,
      email: this.userDetail.email,
      newsletter: this.userDetail.newsletter,
      permissions: this.userDetail.permissions
    }

    delete data.permissions.id;

    this.usersService.updateUser(data).then(resp => {
      if (resp) {
        this.loading = false;
        this.router.navigate([URLS.userManagement, URLS.all]);
      }
    });
  }


  unblockUser(){
    this.loading = true;
    this.usersService.unblockUser({"user_id": this.userDetail.id}).then(resp => {
      this.loading = false;
      if (resp) {
        this.router.navigate([URLS.userManagement, URLS.all]);
      }
    });
  }

  openRemoveUserDialog() {

    this.dialog.open(RemoveUserDialog, {
      width: "400px",
      data: {
        userId: this.userId
      }
    });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordDialog, {
      width: '600px'
    });
  }



}





@Component({
  selector: 'change-password-dialog',
  templateUrl: '../dialogs/change-password.html',
})
export class ChangePasswordDialog {
  constructor(public dialogRef: MatDialogRef<ChangePasswordDialog>, private usersService: UsersService) { }

  loading: boolean = false;
  formError: string = "";
  data = {
    password: "",
    confirm_password: ""
  }

  updatePassword() {
    this.formError = "";
    if (this.data.password === "") {
      this.formError = "Please enter new password.";
    } else if (this.data.confirm_password === "") {
      this.formError = "Please confirm your new password.";
    } else if (this.data.password !== this.data.confirm_password) {
      this.formError = "Both passwords do not match.";
    } else {
      this.loading = true;
      this.usersService.changePassword(this.data).then(resp => {
        if (resp.status === 400) {
          if (resp.data.non_field_errors) {
            this.formError = resp.data.non_field_errors[0];
          }
        } else {
          this.dialogRef.close();
        }
        this.loading = false;
      });
    }
  }
}


@Component({
  selector: 'remove-user-dialog',
  templateUrl: '../dialogs/remove-user.html',
})
export class RemoveUserDialog {
  constructor(public dialogRef: MatDialogRef<RemoveUserDialog>,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  loading: boolean = false;

  deleteUser(id: any) {
    if (this.data.userId) {
      this.loading = true;
      this.usersService.deleteUser(id).then(resp => {
        this.loading = false;
        this.dialogRef.close();
        this.snackbar.open("User deleted.", "", { duration: 2000 });
        this.router.navigate([URLS.userManagement, URLS.all]);
      })
    } else {
      this.loading = false;
      this.dialogRef.close();

    }
  }
}