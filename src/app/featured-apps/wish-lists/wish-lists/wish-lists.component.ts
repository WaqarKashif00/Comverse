import { Component, OnInit, Inject } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { WishListsService } from './../wish-lists.service';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-wish-lists',
  templateUrl: './wish-lists.component.html',
  styleUrls: ['./wish-lists.component.scss']
})
export class WishListsComponent implements OnInit {

  constructor(
    private wishListService: WishListsService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  loading: boolean = false;
  URLS = URLS;
  productData: any;

  columns: Column[] = [
    {
      selector: "media",
      cell: row => `<img src="${row.media ? row.media : '/assets/img/placeholder-image.png'}" class="table-row-thumbnail" />`,
      width: '50px',
    },
    {
      title: "Product Title",
      selector: "product_title",
      clickable: true
    },
    {
      title: "SKU",
      selector: "sku"
    },
    {
      title: "Intersted Customers",
      selector: "interested_customers"
    }
  ];

  rowActions: string[] = ["Delete"];
  wishLists = [];
  wishListsCustomers = [];
  totalCustomerCount: number = 0;
  pageSizeCustomer: number = 1;
  pageLimitCustomer: number = 10;
  pageCustomer: number = 1;


  id: any = 0;
  pageSize: number = 20;
  page: number = 1;
  pageLimit: number = 10;
  totalCount: number = 0;


  mapObject(data) {
    data.product_data.id = data.id
    return data.product_data
  }

  getWishList() {
    this.loading = true;
    this.wishListService.getWishList(this.page, this.pageLimit).then(resp => {
      this.loading = false;
      if (resp) {
        this.wishLists = resp.data.results;
        this.productData = this.wishLists.map(this.mapObject);
        this.totalCount = resp.data.count;
      }
    });
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageLimit = event.pageSize;
    this.getWishList();
  }

  onCellClick(data) {
    this.router.navigate(['/', URLS.wishList, URLS.wishListProduct, data.row.id]);
  }

  onRowAction(data) {
    let dialogRef = this.dialog.open(WishListsDeleteDialog, {
      width: "600px",
      data: {
        wishList: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.getWishList();
      }
    });
  }

  columnsCustomer: Column[] = [
    {
      title: "Name",
      selector: "name",
      clickable: true
    },
    {
      title: "Email",
      selector: "email",
    },
    {
      title: "Interested Products",
      selector: "no_of_products",
    },
  ];


  getWishListCustomers() {
    this.loading = true;
    this.wishListService.getWishListCustomers(this.pageCustomer, this.pageLimitCustomer).then(resp => {
      this.loading = false;
      if (resp) {
        this.wishListsCustomers = resp.data.results;
        this.totalCustomerCount = resp.data.count;
      }
    });
  }

  onPageCustomers(event: PageEvent) {
    this.pageCustomer = event.pageIndex + 1;
    this.pageLimitCustomer = event.pageSize;
    this.getWishListCustomers();
  }

  onCellClickCustomers(data) {
    this.router.navigate(['/', URLS.wishList, URLS.wishListCustomer, data.row.id]);
  }

  ngOnInit(): void {
    this.getWishList();
    this.getWishListCustomers()
  }

}


@Component({
  selector: 'wish-lists-delete-dialog',
  templateUrl: '../dialogs/wish-lists-delete-dialog.html',
})
export class WishListsDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<WishListsDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private wishListService: WishListsService,) {
  }

  loading: boolean = false;

  deleteWishList() {
    this.loading = true;
    this.wishListService.deleteWishList(this.data.wishList.id).then(resp => {
      if (resp) {
        this.snackbar.open("Wish List deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}
