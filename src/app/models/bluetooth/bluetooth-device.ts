import { BleClientInterface, ScanResult } from "@capacitor-community/bluetooth-le";
import { Logger } from "@obsidize/rx-console";
import { GattCharacteristicPath } from "./bluetooth-gatt-profiles";
import { Subject } from "rxjs";

const logger = new Logger(`BluetoothDevice`);

export interface BluetoothDeviceNotification {
    readonly path: GattCharacteristicPath;
    readonly data: DataView;
}

export class BluetoothDevice {

    private readonly notificationSubject = new Subject<BluetoothDeviceNotification>();
    private readonly disconnectProxy = this.onDisconnect.bind(this);

    private mLastReceivedScanResult: ScanResult | null = null;
    private mConnected: boolean = false;

    constructor(
        private readonly driver: BleClientInterface,
        public readonly id: string
    ) {
    }

    public get isTargetDevice(): boolean {
        return true;
    }

    public get name(): string {
        return this.mLastReceivedScanResult?.device?.name ?? '';
    }

    public get rssi(): number {
        return this.mLastReceivedScanResult?.rssi ?? -100;
    }

    public get connected(): boolean {
        return this.mConnected;
    }

    public destroy(): void {
    }

    public onSelfAdvertisementReceived(scanResult: ScanResult): void {
        logger.trace(`onSelfAdvertisementReceived()`, scanResult);
        this.mLastReceivedScanResult = scanResult;
    }

    public async connect(): Promise<void> {
        await this.driver.connect(this.id, this.disconnectProxy);
        this.mConnected = true;
    }

    public async disconnect(): Promise<void> {
        await this.driver.disconnect(this.id);
    }

    public async disconnectIfNeeded(): Promise<void> {
        if (this.connected) {
            await this.disconnect();
        }
    }

    private async read(path: GattCharacteristicPath): Promise<DataView> {
        return this.driver.read(this.id, path.serviceUuid, path.characteristicUuid);
    }

    private async write(path: GattCharacteristicPath, value: DataView): Promise<void> {
        return this.driver.write(this.id, path.serviceUuid, path.characteristicUuid, value);
    }

    private async startNotifications(path: GattCharacteristicPath): Promise<void> {
        return this.driver.startNotifications(this.id, path.serviceUuid, path.characteristicUuid, data => this.onReceiveNotification(path, data));
    }

    private async stopNotifications(path: GattCharacteristicPath): Promise<void> {
        return this.driver.stopNotifications(this.id, path.serviceUuid, path.characteristicUuid);
    }

    private onReceiveNotification(path: GattCharacteristicPath, data: DataView): void {
        this.notificationSubject.next({path, data});
    }

    private onDisconnect(id: string): void {
        if (id === this.id) {
            this.mConnected = false;
        }
    }
}