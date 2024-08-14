import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { LoyalityComponent } from './loyality.component';



const routes: Routes = [
  {path: '', component:LoyalityComponent },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoyaltyRoutingModule { }
