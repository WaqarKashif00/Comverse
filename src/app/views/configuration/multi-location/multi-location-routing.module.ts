import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { CreateLocationComponent } from './create-location/create-location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { LocationsComponent } from './locations/locations.component';
import { MultiLocationComponent } from './multi-location/multi-location.component';



const routes: Routes = [
  {path: '', component:MultiLocationComponent },
  {path: URLS.locations, component:LocationsComponent},
  {path: URLS.createLocation, component:CreateLocationComponent},
  {path: URLS.locationDetail + '/:id', component:LocationDetailComponent },
  {path: URLS.editLocation + '/:id', component:EditLocationComponent },



];

@NgModule({
  imports: [
RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MultiLocationtRoutingModule { }
