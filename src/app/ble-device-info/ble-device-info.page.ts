import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { AlertController } from '@ionic/angular';
import { delay, tap } from 'rxjs';

import { BluetoothDevice } from '../models/bluetooth/bluetooth-device';
import { BluetoothDeviceService } from '../services/bluetooth/bluetooth-device.service';
import { BluetoothDeviceEndpoint } from '../models/bluetooth/bluetooth-device-endpoint';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.page.html',
  styleUrls: ['./ble-device-info.page.scss'],
})
export class BleDeviceInfoPage {

  private readonly logger = new Logger(`BleDeviceInfoPage`);

  private mReconnecting: boolean = false;
  private mLoadingEndpoints: boolean = false;

  public endpoints: BluetoothDeviceEndpoint[] = [];

  // Awful hack to get view to respond to notify callbacks from BLE plugin.
  // Better route here is probably push detection strategy (or better yet, signals).
  public readonly deviceNotifications$ = this.device.notifications$.pipe(
    delay(100),
    tap(() => this.cdr.detectChanges())
  );

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly alertController: AlertController,
    private readonly bluetoothDeviceService: BluetoothDeviceService
  ) {
  }

  public get reconnecting(): boolean {
    return this.mReconnecting;
  }

  public get loadingEndpoints(): boolean {
    return this.mLoadingEndpoints;
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

    this.mReconnecting = true;

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

  public async loadEndpoints(): Promise<void> {

    this.logger.debug(`loadEndpoints()`);

    if (this.mLoadingEndpoints) {
      this.logger.warn(`ignoring duplicate UI call`);
      return;
    }

    this.mLoadingEndpoints = true;

    try {
      this.endpoints = await this.device.enumerateEndpoints();
      this.mLoadingEndpoints = false;

    } catch (e) {
      this.logger.error(`failed to load endpoints! -> `, e);
      this.mLoadingEndpoints = false;
      await this.showEndpointLoadError(e);
    }
  }

  private async showEndpointLoadError(error: any): Promise<void> {

    const dialog = await this.alertController.create({
      header: `Error`,
      message: `Failed to load device endpoints: ${error}`,
      buttons: [
        `OK`
      ]
    });

    await dialog.present();
  }
}
