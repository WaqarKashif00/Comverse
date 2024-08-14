import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { WishListsService } from './../wish-lists.service';


@Component({
  selector: 'app-wish-lists-product',
  templateUrl: './wish-lists-product.component.html',
  styleUrls: ['./wish-lists-product.component.scss']
})
export class WishListsProductComponent implements OnInit {

  constructor(
    private wishListService: WishListsService,
    private router: Router,
    private route: ActivatedRoute
  ) { this.wishListsID = this.route.snapshot.paramMap.get("id") }

  loading: boolean = false;
  URLS = URLS;
  productData: any;
  wishListsID;
  productImage: any;
  productTitle: any;
  productSKU: any;


  columns: Column[] = [
      {
        title: "Name",
        selector: "first_name",
        clickable: true
      },
      {
        title: "Email",
        selector: "email"
      }
  ];

  rowActions: string[] = ["Delete"];
  wishListsProduct = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  onPage(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getWishListProductDetail();
  }

  onCellClick(data) {
    this.router.navigate(['/', URLS.wishList]);
  }

  getWishListProductDetail() {
    this.loading = true;
    this.wishListService.getWishListProductDetail(this.wishListsID).then(resp => {
      this.loading = false;
      if (resp) {
        this.wishListsProduct = resp.data.customers;
        this.productImage = resp.data.media;
        this.productSKU = resp.data.variant_sku;
        this.productTitle = resp.data.product_title;
      }
    });
  }

  ngOnInit(): void {
    this.getWishListProductDetail();
  }

}
