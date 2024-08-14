import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { OrderReturnComponent } from './order-return/order-return.component';


const routes: Routes = [
  { path: '', component: OrderReturnComponent },
  // { path: URLS.wishListProduct + '/:id', component: WishListsProductComponent },
  // { path: URLS.wishListCustomer + '/:id', component: WishListsCustomerComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OrderReturnRoutingModule { }
