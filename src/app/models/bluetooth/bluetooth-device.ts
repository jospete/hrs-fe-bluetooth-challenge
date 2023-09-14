import { BleClientInterface, BleService, ScanResult } from "@capacitor-community/bluetooth-le";
import { Logger } from "@obsidize/rx-console";
import { Subject } from "rxjs";
import { BluetoothDeviceEndpoint } from "./bluetooth-device-endpoint";

const logger = new Logger(`BluetoothDevice`);

export interface BluetoothDeviceNotification {
    readonly data: DataView;
    readonly service: string;
    readonly characteristic: string;
    readonly descriptor?: string;
}

export class BluetoothDevice {

    private readonly notificationSubject = new Subject<BluetoothDeviceNotification>();
    private readonly disconnectProxy = this.onDisconnect.bind(this);

    private mLastReceivedScanResult: ScanResult | null = null;
    private mConnected: boolean = false;
    private mDisplayName: string = '';

    public readonly notifications$ = this.notificationSubject.asObservable();

    public services: BleService[] = [];

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

    public get displayName(): string {
        return this.mDisplayName;
    }

    public destroy(): void {
        this.notificationSubject.complete();
        this.notificationSubject.unsubscribe();
    }

    public onSelfAdvertisementReceived(scanResult: ScanResult): void {
        logger.trace(`onSelfAdvertisementReceived()`, scanResult);
        this.mLastReceivedScanResult = scanResult;
        this.mDisplayName = scanResult?.localName || scanResult?.device?.name || this.id;
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

    public async loadServices(): Promise<void> {
        this.services = await this.driver.getServices(this.id);
    }

    public async enumerateEndpoints(): Promise<BluetoothDeviceEndpoint[]> {
        
        if (!this.services || this.services.length === 0) {
            await this.loadServices();
        }

        const result: BluetoothDeviceEndpoint[] = [];

        for (const service of this.services) {
            for (const characteristic of service.characteristics) {
                result.push(new BluetoothDeviceEndpoint(this, service, characteristic));

                for (const descriptor of characteristic.descriptors) {
                    result.push(new BluetoothDeviceEndpoint(this, service, characteristic, descriptor));
                }
            }
        }

        return result;
    }

    public async read(service: string, characteristic: string): Promise<DataView> {
        return this.driver.read(this.id, service, characteristic);
    }

    public async write(service: string, characteristic: string, value: DataView): Promise<void> {
        return this.driver.write(this.id, service, characteristic, value);
    }

    public async startNotifications(service: string, characteristic: string): Promise<void> {
        return this.driver.startNotifications(this.id, service, characteristic, data => this.onReceiveNotification(data, service, characteristic));
    }

    public async stopNotifications(service: string, characteristic: string): Promise<void> {
        return this.driver.stopNotifications(this.id, service, characteristic);
    }

    private onReceiveNotification(data: DataView, service: string, characteristic: string, descriptor?: string): void {
        this.notificationSubject.next({data, service, characteristic, descriptor});
    }

    private onDisconnect(id: string): void {
        if (id === this.id) {
            this.mConnected = false;
        }
    }
}