import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WishListsDeleteDialog } from 'src/app/featured-apps/wish-lists/wish-lists/wish-lists.component';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ProductsService } from './../products.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent implements OnInit {

  constructor(
    private productReviewService: ProductsService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  loading: boolean = false;
  URLS = URLS;
  productWiseData: any;

  columns: Column[] = [
    {
      title: "Product Name",
      selector: "title",
      clickable: true
    },
    {
      title: "Average Rating",
      selector: "average_rating"
    },
    {
      title: "Total Comments",
      selector: "total_comments"
    }, {
      title: "Total Reviews",
      selector: "total_reviews"
    }
  ];

  rowActions: string[] = ["View Comment", "Delete"];
  latestReviewData = [];
  totalLatestReviewCount: number = 0;
  pageSizeCustomer: number = 1;
  pageLimitLatestReviews: number = 10;
  pageCustomer: number = 1;


  id: any = 0;
  pageSize: number = 20;
  page: number = 1;
  pageLimit: number = 10;
  totalCount: number = 0;
  filterString = "";
  searchString = "";
  searchStringLatestReview = "";



  mapObject(data) {

    let object = {
      id:null,
      title:"",
      average_rating:"",
      total_comments:"",
      total_reviews:"",
    };
    object.id =data.id;
    object.title = data.title;
    object.average_rating = data.review_detail.average_rating;
    object.total_comments = data.review_detail.total_comments;
    object.total_reviews = data.review_detail.total_reviews;
    
    return object;

  }

  getProductWiseReviewList() {
    this.loading = true;
    this.productReviewService.getProductsWiseReview(this.page, this.pageLimit, this.searchString).then(resp => {
      this.loading = false;
      if (resp) {
        this.productWiseData = resp.data.results.map(this.mapObject)
        this.totalCount = resp.data.count;
      }
    });
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageLimit = event.pageSize;
    this.getProductWiseReviewList();
  }

  onCellClick(data) {
    this.router.navigate(['/', URLS.products, URLS.productReviewDetail, data.row.id, data.row.title]);
  }

  onRowAction(data) {
    if(data.action == "Delete") {
      let dialogRef = this.dialog.open(ProductReviewDeleteDialog, {
        width: "600px",
        data: data.row
        
      });
  
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getlatestReviewList();
        }
      });
    } else {
      let dialogRef = this.dialog.open(ProductReviewCommentDialog, {
        width: "600px",
        data: data.row
        
      });
    }
  }


  onSearch(data) {
    this.page = 1;
    let tempSearchString = "";
    if (data.query) {
      tempSearchString += "&search=" + data.query;
    }
    this.searchString = tempSearchString;
    this.getProductWiseReviewList();
  }

  onSearchLatestReview(data) {
    this.pageCustomer = 1;
    let tempSearchString = "";
    if (data.query) {
      tempSearchString += "&search=" + data.query ;
    }
    this.searchStringLatestReview = tempSearchString;
    this.getlatestReviewList();
  }

  columnsLatestReview: Column[] = [
    {
      title: "Customer Name",
      selector: "customer_name",
    },
    {
      title: "Product Name",
      selector: "product_name",
    },
    {
      title: "Rating",
      selector: "rating",
    },
    {
      title: "Comment",
      selector: "comment",
    },
    {
      title: "Posted at",
      selector: "updated_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
  ];



filters = [
    {
      title: "Start Date",
      key: 'start_date',
      type:'date'
    },
    {
      title: "End Date",
      key: 'end_date',
      type:'date'
    }
  ];



  onFilter(filters) {
    this.page = 1;
    let tempFilterString: string = "";
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].value) {
        tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
      }
    }
    this.filterString = tempFilterString;
    this.getlatestReviewList();
  }


  getlatestReviewList() {
    this.loading = true;
    this.productReviewService.getLatestReview(this.pageCustomer, this.pageLimitLatestReviews, this.filterString, this.searchStringLatestReview).then(resp => {
      this.loading = false;
      if (resp) {
        this.latestReviewData = resp.data.results;
        this.totalLatestReviewCount = resp.data.count;
      }
    });
  }

  onPageCustomers(event: PageEvent) {
    this.pageCustomer = event.pageIndex + 1;
    this.pageLimitLatestReviews = event.pageSize;
    this.getlatestReviewList();
  }



  ngOnInit(): void {
    this.getProductWiseReviewList();
    this.getlatestReviewList()
  }

}


@Component({
  selector: 'products-review-delete-dialog',
  templateUrl: '../dialogs/product-review-delete-dialog.html',
})
export class ProductReviewDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductReviewDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
  }

  loading: boolean = false;
  ids: string = "";

  onDelete() {
    this.loading = true;
    this.productsService.deleteProductReview(this.data.id).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackBar.open("Product review deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    })
  }
}



@Component({
  selector: 'products-review-delete-dialog',
  templateUrl: '../dialogs/product-review-comment-detail-dialog.html',
})
export class ProductReviewCommentDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductReviewCommentDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
  }

  
}
