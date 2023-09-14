import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BleDeviceInfoPageRoutingModule } from './ble-device-info-routing.module';

import { BleDeviceInfoPage } from './ble-device-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BleDeviceInfoPageRoutingModule
  ],
  declarations: [BleDeviceInfoPage]
})
export class BleDeviceInfoPageModule {}
