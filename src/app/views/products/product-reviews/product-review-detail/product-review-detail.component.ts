import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListsDeleteDialog } from 'src/app/featured-apps/wish-lists/wish-lists/wish-lists.component';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductsService } from '../../products.service';
import { ProductReviewDeleteDialog, ProductReviewCommentDialog } from '../product-reviews.component';

@Component({
  selector: 'app-product-review-detail',
  templateUrl: './product-review-detail.component.html',
  styleUrls: ['./product-review-detail.component.scss']
})
export class ProductReviewDetailComponent implements OnInit {

  constructor(
    private productReviewService: ProductsService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,

  ) {
    this.productID = this.route.snapshot.paramMap.get('id');
    this.productName = this.route.snapshot.paramMap.get('name');

   }

  loading: boolean = false;
  URLS = URLS;
  productID:any;
  productName:any;
  productData: any;

  columns: Column[] = [
    {
      title: "Customer Name",
      selector: "customer_name",
    },
    {
      title: "Rating",
      selector: "rating"
    },
    {
      title: "Comment",
      selector: "comment"
    }
  ];

  rowActions: string[] = ["View Comment", "Delete"];



  id: any = 0;
  pageSize: number = 20;
  page: number = 1;
  pageLimit: number = 10;
  totalCount: number = 0;
  



  getProductDetailReviewList() {
    this.loading = true;
    this.productReviewService.getProductDetailReview(this.productID, this.page, this.pageLimit).then(resp => {
      this.loading = false;
      if (resp) {
        this.productData = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageLimit = event.pageSize;
    this.getProductDetailReviewList();
  }



  onRowAction(data) {
    if(data.action == "Delete") {
      let dialogRef = this.dialog.open(ProductReviewDeleteDialog, {
        width: "600px",
        data: data.row
        
      });
  
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getProductDetailReviewList();
        }
      });
    } else {
      let dialogRef = this.dialog.open(ProductReviewCommentDialog, {
        width: "600px",
        data: data.row
        
      });
    }
  }

 


  ngOnInit(): void {
    this.getProductDetailReviewList();
  }


}
