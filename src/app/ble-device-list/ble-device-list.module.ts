import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BleDeviceListPageRoutingModule } from './ble-device-list-routing.module';

import { BleDeviceListPage } from './ble-device-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BleDeviceListPageRoutingModule
  ],
  declarations: [BleDeviceListPage]
})
export class BleDeviceListPageModule {}
