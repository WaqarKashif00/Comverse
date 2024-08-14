import { EditSizeChartComponent } from './../size-charts/edit-size-chart/edit-size-chart.component';
import { SizeChartsComponent } from './size-charts/size-charts.component';
import { CreateSizeChartComponent } from './create-size-chart/create-size-chart.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';


const routes: Routes = [
  {path: '', component:SizeChartsComponent },
  {path: URLS.createSizeChart, component:CreateSizeChartComponent },
  {path: URLS.edit + '/:id', component:EditSizeChartComponent },


];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SizeChartsRoutingModule { }
