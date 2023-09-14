import { Injectable, NgZone } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { BehaviorSubject, Observable, Subject, filter, map } from 'rxjs';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { BluetoothDevice } from './../../models/bluetooth/bluetooth-device';
import { sleep } from 'src/app/utility/sleep';
import { runInsideZone } from 'src/app/utility/run-inside-zone';

export enum BluetoothDeviceScanState {
  NONE = 'NONE',
  SCANNING = 'SCANNING',
  SCAN_STOPPED = 'SCAN_STOPPED',
  SCAN_COMPLETE_DEVICES_FOUND = 'SCAN_COMPLETE_DEVICES_FOUND',
  SCAN_COMPLETE_NO_DEVICES_FOUND = 'SCAN_COMPLETE_NO_DEVICES_FOUND',
  SCAN_ERROR = 'SCAN_ERROR'
}

const SCAN_TIME_MS = 30 * 1000;

@Injectable({
  providedIn: 'root'
})
export class BluetoothDeviceService {

  private readonly logger = new Logger(`BluetoothDeviceService`);
  private readonly deviceMap = new Map<string, BluetoothDevice>();
  private readonly scanResultSubject = new Subject<ScanResult>();
  private readonly scanStateSubject = new BehaviorSubject<BluetoothDeviceScanState>(BluetoothDeviceScanState.NONE);
  private readonly scanResultProxy = this.scanResultSubject.next.bind(this.scanResultSubject);

  public readonly scanState$: Observable<BluetoothDeviceScanState> = this.scanStateSubject.asObservable();

  public readonly scannedDevices$: Observable<BluetoothDevice> = this.scanResultSubject.asObservable().pipe(
    map(scanResult => this.consumeScanResult(scanResult)!),
    filter(device => device?.isTargetDevice),
    runInsideZone(this.zone)
  );

  private mConnectedDevice: BluetoothDevice | null = null;

  constructor(
    private readonly zone: NgZone
  ) {
  }

  public get connectedDevice(): BluetoothDevice | null {
    return this.mConnectedDevice;
  }

  public get scanState(): BluetoothDeviceScanState {
    return this.scanStateSubject.value;
  }

  public get scanning(): boolean {
    return this.scanState === BluetoothDeviceScanState.SCANNING;
  }

  private async clearCache(): Promise<void> {
    
    for (const device of this.deviceMap.values()) {
      await device.disconnectIfNeeded()
        .catch(e => this.logger.warn(`failed to disconnect device with id ${device.id} -> `, e));
      device.destroy();
    }

    this.deviceMap.clear();
  }

  public async resetState(): Promise<void> {

    this.logger.debug(`resetState()`);
    
    try {
      await this.stopScan();
      await this.disconnectCurrentDevice();
      await this.clearCache();

    } catch (e) {
      this.logger.warn(`failed some reset state actions -> `, e);
    }

    this.scanStateSubject.next(BluetoothDeviceScanState.NONE);
  }

  public async initialize(): Promise<void> {
    this.logger.debug(`initialize()`);
    await this.requireBluetoothPermissions();
    await this.resetState();
  }

  public async connectDevice(device: BluetoothDevice): Promise<void> {
    this.logger.debug(`connectDevice() `, device.name);
    await this.stopScan();
    await device.connect();
    this.mConnectedDevice = device;
  }

  public async disconnectCurrentDevice(): Promise<void> {
    this.logger.debug(`disconnectCurrentDevice()`);
    if (this.mConnectedDevice) {
      await this.mConnectedDevice.disconnectIfNeeded();
      this.mConnectedDevice = null;
    }
  }

  public async startScan(): Promise<void> {

    this.logger.debug(`startScan()`);

    if (this.scanning) {
      this.logger.debug(`already scanning`);
      return;
    }

    this.logger.debug(`triggering plugin request...`);

    try {
      await this.requireBluetoothPermissions();
      await BleClient.requestLEScan({allowDuplicates: true}, this.scanResultProxy);
      this.scanStateSubject.next(BluetoothDeviceScanState.SCANNING);

      await sleep(SCAN_TIME_MS);
      await this.stopScan();
      this.emitFinalScanState();

    } catch (e) {
      this.logger.warn(`scan caught error! -> `, e);
      this.scanStateSubject.next(BluetoothDeviceScanState.SCAN_ERROR);
      return Promise.reject(e);
    }
  }

  public async stopScan(): Promise<void> {
    this.logger.debug(`stopScan()`);

    if (!this.scanning) {
      this.logger.debug(`not scanning`);
      return;
    }

    this.logger.debug(`triggering plugin request...`);
    
    await BleClient.stopLEScan().catch(e => {
      this.logger.warn(`plugin failed to stop scan -> `, e);
    });

    this.scanStateSubject.next(BluetoothDeviceScanState.SCAN_STOPPED);
  }

  private async requireBluetoothPermissions(): Promise<void> {
    this.logger.debug(`requireBluetoothPermissions()`);
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  private emitFinalScanState(): void {
    
    const deviceCount = this.deviceMap.size;
    const resultState = deviceCount > 0 
      ? BluetoothDeviceScanState.SCAN_COMPLETE_DEVICES_FOUND
      : BluetoothDeviceScanState.SCAN_COMPLETE_NO_DEVICES_FOUND;

    this.logger.debug(`emitFinalScanState() deviceCount = ${deviceCount}, resultState = ${resultState}`);
    this.scanStateSubject.next(resultState);
  }

  private consumeScanResult(scanResult: ScanResult): BluetoothDevice | null {

    const id = scanResult?.device?.deviceId;

    if (!id) {
      this.logger.warn(`received invalid scan result (missing device ID) -> `, scanResult);
      return null;
    }

    let device = this.deviceMap.get(id);

    if (!device) {
      device = new BluetoothDevice(BleClient, id)
      this.deviceMap.set(id, device);
    }

    device.onSelfAdvertisementReceived(scanResult);
    return device;
  }
}
