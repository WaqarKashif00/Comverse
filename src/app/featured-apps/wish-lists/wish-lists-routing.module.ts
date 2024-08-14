import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { WishListsCustomerComponent } from './wish-lists-customer/wish-lists-customer.component';
import { WishListsProductComponent } from './wish-lists-product/wish-lists-product.component';
import { WishListsComponent } from './wish-lists/wish-lists.component';


const routes: Routes = [
  { path: '', component: WishListsComponent },
  { path: URLS.wishListProduct + '/:id', component: WishListsProductComponent },
  { path: URLS.wishListCustomer + '/:id', component: WishListsCustomerComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WishListsRoutingModule { }
