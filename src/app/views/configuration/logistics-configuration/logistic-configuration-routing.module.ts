import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogisticsConfigurationComponent } from './logistics-configuration/logistics-configuration.component';
import { CourierIntegrationsComponent } from './courier-integrations/courier-integrations.component';
import { AddCourierIntegrationsComponent } from './add-courier-integrations/add-courier-integrations.component';
import { CourierAutomationComponent } from './courier-automation/courier-automation.component';
import { CourierPriorityComponent } from './courier-priority/courier-priority.component';
import URLS from 'src/app/shared/urls';
import { InternationalCourierPriorityComponent } from './international-courier-priority/international-courier-priority.component';
import { CourierInvoiceSettingComponent } from './courier-invoice-setting/courier-invoice-setting.component';

const routes: Routes = [
  {path: '', component: LogisticsConfigurationComponent },
  {path: URLS.courierIntegration, component:CourierIntegrationsComponent },
  {path: URLS.addCourierConfiguration, component:AddCourierIntegrationsComponent },
  {path: URLS.courierAutomation, component:CourierAutomationComponent },
  {path: URLS.courierPriority, component:CourierPriorityComponent },
  {path: URLS.internationalCourierPriority, component:InternationalCourierPriorityComponent },
  {path: URLS.courierInvoiceSetting, component:CourierInvoiceSettingComponent },


];

@NgModule({
  imports: [
RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LogisticConfigurationRoutingModule { }
