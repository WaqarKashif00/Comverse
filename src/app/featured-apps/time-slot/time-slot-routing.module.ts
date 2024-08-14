import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeSlotComponent } from './time-slot/time-slot.component';
import { CreateTimeSlotComponent } from './create-time-slot/create-time-slot.component';
import { EditTimeSlotComponent } from './edit-time-slot/edit-time-slot.component';
import URLS from 'src/app/shared/urls';



const routes: Routes = [
  {path: '', component:TimeSlotComponent },
  {path: URLS.createTimeSlot, component:CreateTimeSlotComponent},
  {path: URLS.editTimeSlot + '/:id', component:EditTimeSlotComponent},

];

@NgModule({
  imports: [
RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TimeSlotRoutingModule { }
