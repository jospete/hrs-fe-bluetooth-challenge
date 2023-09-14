import { BleCharacteristic, BleDescriptor, BleService, dataViewToHexString, dataViewToText } from "@capacitor-community/bluetooth-le";
import { BluetoothDevice } from "./bluetooth-device";
import { BehaviorSubject, filter, map, merge, tap } from "rxjs";
import { hexToDataView, isValidHexString } from "src/app/utility/convert";

export class BluetoothDeviceEndpoint {

    private readonly valueSubject = new BehaviorSubject<DataView | null>(null);
    private mSubscribed: boolean = false;

    public readonly notifyValue$ = this.device.notifications$.pipe(
        filter(v => v.service === this.service.uuid && v.characteristic === this.characteristic.uuid),
        map(v => v.data),
        tap(v => this.updateValue(v))
    );

    public readonly value$ = merge(
        this.valueSubject.asObservable(),
        this.notifyValue$
    );

    public readonly hexValue$ = this.value$.pipe(
        map(() => this.hexValue)
    );

    public hexInput: string = '';

    constructor(
        public readonly device: BluetoothDevice,
        public readonly service: BleService,
        public readonly characteristic: BleCharacteristic,
        public readonly descriptor?: BleDescriptor
    ) {
    }

    public get value(): DataView | null {
        return this.valueSubject.value;
    }

    public get readable(): boolean {
        return this.characteristic.properties.read;
    }

    public get writable(): boolean {
        return this.characteristic.properties.write;
    }

    public get subscribable(): boolean {
        return this.characteristic.properties.notify
            || this.characteristic.properties.indicate;
    }

    public get subscribed(): boolean {
        return this.mSubscribed;
    }

    public get hexValue(): string {
        return this.value ? dataViewToHexString(this.value) : '';
    }

    public get textValue(): string {
        return this.value ? dataViewToText(this.value) : '';
    }

    public get hasValidHexInput(): boolean {
        return isValidHexString(this.hexInput);
    }

    public path(): string {
        let v = `${this.service.uuid}/${this.characteristic.uuid}`;
        if (this.descriptor) v += `/${this.descriptor.uuid}`;
        return v;
    }

    public async watch(): Promise<void> {
        await this.device.startNotifications(this.service.uuid, this.characteristic.uuid);
        this.mSubscribed = true;
    }

    public async unwatch(): Promise<void> {
        await this.device.stopNotifications(this.service.uuid, this.characteristic.uuid);
        this.mSubscribed = false;
    }

    public async read(): Promise<DataView> {
        this.updateValue(await this.device.read(this.service.uuid, this.characteristic.uuid));
        return this.value!;
    }

    public async write(value: DataView): Promise<void> {
        await this.device.write(this.service.uuid, this.characteristic.uuid, value);
        this.updateValue(value);
    }

    public async readHex(): Promise<string> {
        const value = await this.read();
        return this.hexValue;
    }

    public async readText(): Promise<string> {
        const value = await this.read();
        return this.textValue;
    }

    public async writeHexInput(): Promise<void> {
        const bufferValue = hexToDataView(this.hexInput);
        await this.write(bufferValue);
    }

    private updateValue(value: DataView | null): void {
        this.valueSubject.next(value);
    }
}