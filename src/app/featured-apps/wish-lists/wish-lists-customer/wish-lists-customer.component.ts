import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { WishListsService } from './../wish-lists.service';

@Component({
  selector: 'app-wish-lists-customer',
  templateUrl: './wish-lists-customer.component.html',
  styleUrls: ['./wish-lists-customer.component.scss']
})
export class WishListsCustomerComponent implements OnInit {

  constructor(
    private wishListService: WishListsService,
    private router: Router,
    private route: ActivatedRoute
  ) { this.wishListsCustomerID = this.route.snapshot.paramMap.get("id") }

  loading: boolean = false;
  wishListsCustomerID
  URLS = URLS;
  customerData: any;
  name: any;
  email: any
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
    }
  ];

  rowActions: string[] = ["Delete"];
  wishListsProduct = [];
  pageSize: number = 20;
  page: number = 1;
  pageLimit: number = 10;
  totalCount: number = 0;


  mapObject(data) {
    data.product_data.id = data.id;
    return data.product_data;
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageLimit = event.pageSize;
    this.getWishListCustomer();
  }

  onCellClick(data) {
    this.router.navigate(['/', URLS.wishList, URLS.wishListProduct, data.row.id]);
  }

  getWishListCustomer() {
    this.loading = true;
    this.wishListService.getWishListCustomer(this.wishListsCustomerID,this.page , this.pageLimit).then(resp => {
      this.loading = false;
      if (resp) {
        this.customerData = resp.data.products;
        this.productData = this.customerData.map(this.mapObject);
        this.name = resp.data.name;
        this.email = resp.data.email;
      }
    });
  }

  ngOnInit(): void {
    this.getWishListCustomer();
  }
}
