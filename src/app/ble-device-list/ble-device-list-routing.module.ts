import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BleDeviceListPage } from './ble-device-list.page';

const routes: Routes = [
  {
    path: '',
    component: BleDeviceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BleDeviceListPageRoutingModule {}
