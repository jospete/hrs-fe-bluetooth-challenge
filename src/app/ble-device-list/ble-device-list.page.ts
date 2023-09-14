import { Component } from '@angular/core';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import {BluetoothDevice} from 'src/app/models/bluetooth/bluetooth-device';
import { BluetoothDeviceScanState, BluetoothDeviceService } from '../services/bluetooth/bluetooth-device.service';
import { Logger } from '@obsidize/rx-console';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

enum ScanDisplayState {
  INTRO = 'INTRO',
  DEVICE_LIST = 'DEVICE_LIST',
  SCAN_COMPLETE_NO_DEVICES = 'SCAN_COMPLETE_NO_DEVICES',
  SCAN_ERROR = 'SCAN_ERROR'
}

@Component({
  selector: 'app-ble-device-list',
  templateUrl: './ble-device-list.page.html',
  styleUrls: ['./ble-device-list.page.scss'],
})
export class BleDeviceListPage {

  private readonly logger = new Logger(`BleDeviceListPage`);

  private readonly scanStateSubject = new BehaviorSubject<ScanDisplayState>(ScanDisplayState.INTRO);
  private readonly deviceIdSet = new Set<string>();
  private mDeviceList: BluetoothDevice[] = [];
  private mScanError: any = null;

  public readonly scanStates: typeof ScanDisplayState = ScanDisplayState;
  public readonly scanState$: Observable<ScanDisplayState> = this.scanStateSubject.asObservable();

  public readonly devices$: Observable<BluetoothDevice[]> = this.bluetoothDeviceService.scannedDevices$.pipe(
    map(device => this.mapDeviceToDisplayList(device))
  );

  constructor(
    private readonly navController: NavController,
    private readonly alertController: AlertController,
    private readonly loadingController: LoadingController,
    private readonly bluetoothDeviceService: BluetoothDeviceService,
  ) {
  }

  public get scanState(): ScanDisplayState {
    return this.scanStateSubject.value;
  }

  public get driverScanState(): BluetoothDeviceScanState {
    return this.bluetoothDeviceService.scanState;
  }

  public get scanning(): boolean {
    return this.driverScanState === BluetoothDeviceScanState.SCANNING;
  }

  public get scanError(): any {
    return this.mScanError;
  }

  public ionViewWillEnter(): void {
    this.logger.trace(`ionViewWillEnter()`);
    this.resetDisplayState();
  }

  public ionViewWillLeave(): void {
    this.logger.trace(`ionViewWillLeave()`);
    this.bluetoothDeviceService.stopScan()
      .catch(e => this.logger.warn(`failed to stop scan -> `, e));
  }

  public async scan(): Promise<void> {

    this.logger.trace(`scan()`);

    if (this.scanning) {
      this.logger.warn(`ignoring double fire of scan call from UI`);
      return;
    }
  
    try {

      this.resetDisplayState();
      
      this.scanStateSubject.next(ScanDisplayState.DEVICE_LIST);
      await this.bluetoothDeviceService.startScan();

      const scanCompleteState = this.mDeviceList.length > 0
        ? ScanDisplayState.DEVICE_LIST
        : ScanDisplayState.SCAN_COMPLETE_NO_DEVICES;

      this.mScanError = null;
      this.scanStateSubject.next(scanCompleteState);

    } catch (e) {
      this.logger.warn(`failed to start scan -> `, e);
      this.mScanError = e;
      this.scanStateSubject.next(ScanDisplayState.SCAN_ERROR);
    }
  }

  public async selectDevice(device: BluetoothDevice): Promise<void> {

    const deviceDisplayName = device.name || device.id;
    this.logger.trace(`selectDevice() -> ${deviceDisplayName}`);
    const spinner = await this.loadingController.create({message: `Connecting to ${deviceDisplayName}...`});

    try {
      await spinner.present();
      await this.bluetoothDeviceService.connectDevice(device);
      await spinner.dismiss();
      await this.navController.navigateForward(`/ble-device-info`);

    } catch (e) {
      this.logger.error(`failed to connect device: `, e);
      await spinner.dismiss();
      await this.showDeviceConnectionFailure(e);
    }
  }

  private async showDeviceConnectionFailure(error: any): Promise<void> {

    const dialog = await this.alertController.create({
      header: `Error`,
      subHeader: `Could not connect to target device: ${error}`,
      buttons: [
        `OK`
      ]
    });
    
    await dialog.present();
  }

  private resetDisplayState(): void {
    this.bluetoothDeviceService.resetState()
      .catch(e => this.logger.warn(`failed to reset BLE service state -> `, e));
    this.deviceIdSet.clear();
    this.mDeviceList = [];
    this.scanStateSubject.next(ScanDisplayState.INTRO);
  }

  private mapDeviceToDisplayList(device: BluetoothDevice): BluetoothDevice[] {

    if (device && !this.deviceIdSet.has(device.id)) {
      this.deviceIdSet.add(device.id);
      this.mDeviceList.push(device);
    }

    // start showing devices as soon as we capture one from a scan
    if (this.mDeviceList.length > 0 && this.scanState !== ScanDisplayState.DEVICE_LIST) {
      this.scanStateSubject.next(ScanDisplayState.DEVICE_LIST);
    }

    return this.mDeviceList;
  }
}
