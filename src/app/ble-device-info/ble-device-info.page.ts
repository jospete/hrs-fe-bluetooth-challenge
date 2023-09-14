import { Component } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { AlertController } from '@ionic/angular';

import { BluetoothDevice } from '../models/bluetooth/bluetooth-device';
import { BluetoothDeviceService } from '../services/bluetooth/bluetooth-device.service';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.page.html',
  styleUrls: ['./ble-device-info.page.scss'],
})
export class BleDeviceInfoPage {

  private readonly logger = new Logger(`BleDeviceInfoPage`);

  private mReconnecting: boolean = false;

  constructor(
    private readonly alertController: AlertController,
    private readonly bluetoothDeviceService: BluetoothDeviceService
  ) {
  }

  public get reconnecting(): boolean {
    return this.mReconnecting;
  }

  public get device(): BluetoothDevice {
    return this.bluetoothDeviceService.connectedDevice!;
  }

  public async tryReconnectDevice(): Promise<void> {

    this.logger.debug(`tryReconnectDevice()`);

    if (this.device.connected) {
      this.logger.warn(`device is already connected, this should not have been called`);
      return;
    }

    if (this.reconnecting) {
      this.logger.warn(`ignoring duplicate call`);
      return;
    }

    try {
      await this.device.connect();
      this.mReconnecting = false;

    } catch (e) {
      this.logger.error(`reconnect failed! -> ${e}`);
      this.mReconnecting = false;
      await this.showReconnectFailureDialog(e);
    }
  }

  private async showReconnectFailureDialog(error: any): Promise<void> {

    const dialog = await this.alertController.create({
      header: `Error`,
      message: `Failed to reconnect device: ${error}`,
      buttons: [
        `OK`
      ]
    });

    await dialog.present();
  }

  private async discoverDeviceEndpoints(): Promise<void> {

    this.logger.debug(`discoverDeviceEndpoints()`);
  }
}
