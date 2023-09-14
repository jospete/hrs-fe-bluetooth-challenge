import { BleClientInterface, BleDevice, BleService, ConnectionPriority, DisplayStrings, InitializeOptions, RequestBleDeviceOptions, ScanResult, TimeoutOptions } from "@capacitor-community/bluetooth-le";
import { BluetoothDevice } from "./bluetooth-device";

class MockDriver implements BleClientInterface {
    async initialize(options?: InitializeOptions | undefined): Promise<void> {
        console.log(options);
    }
    async isEnabled(): Promise<boolean> {
        return true;
    }
    async enable(): Promise<void> {
    }
    async disable(): Promise<void> {
    }
    async startEnabledNotifications(callback: (value: boolean) => void): Promise<void> {
        callback(true);
    }
    async stopEnabledNotifications(): Promise<void> {
    }
    async isLocationEnabled(): Promise<boolean> {
        return true;
    }
    async openLocationSettings(): Promise<void> {
    }
    async openBluetoothSettings(): Promise<void> {
    }
    async openAppSettings(): Promise<void> {
    }
    async setDisplayStrings(displayStrings: DisplayStrings): Promise<void> {
        console.log(displayStrings);
    }
    async requestDevice(options?: RequestBleDeviceOptions | undefined): Promise<BleDevice> {
        console.log(options);
        return null as any;
    }
    async requestLEScan(options: RequestBleDeviceOptions, callback: (result: ScanResult) => void): Promise<void> {
        console.log(options);
        callback({
            device: {
                deviceId: '123412341234',
                name: 'Mock Device',
                uuids: ['aaa', 'bbb', 'ccc'],
            },
            localName: 'Mock Device Local',
            manufacturerData: {'FF': new DataView(new ArrayBuffer(0))},
            rssi: -50
        });
    }
    async stopLEScan(): Promise<void> {
    }
    async getDevices(deviceIds: string[]): Promise<BleDevice[]> {
        console.log(deviceIds);
        return [];
    }
    async getConnectedDevices(services: string[]): Promise<BleDevice[]> {
        console.log(services);
        return [];
    }
    async connect(deviceId: string, onDisconnect?: ((deviceId: string) => void) | undefined, options?: TimeoutOptions | undefined): Promise<void> {
        console.log(deviceId);
        console.log(options);
        onDisconnect;
    }
    async createBond(deviceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async isBonded(deviceId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async disconnect(deviceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getServices(deviceId: string): Promise<BleService[]> {
        throw new Error("Method not implemented.");
    }
    async discoverServices(deviceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getMtu(deviceId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async requestConnectionPriority(deviceId: string, connectionPriority: ConnectionPriority): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async readRssi(deviceId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async read(deviceId: string, service: string, characteristic: string, options?: TimeoutOptions | undefined): Promise<DataView> {
        throw new Error("Method not implemented.");
    }
    async write(deviceId: string, service: string, characteristic: string, value: DataView, options?: TimeoutOptions | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async writeWithoutResponse(deviceId: string, service: string, characteristic: string, value: DataView, options?: TimeoutOptions | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async readDescriptor(deviceId: string, service: string, characteristic: string, descriptor: string, options?: TimeoutOptions | undefined): Promise<DataView> {
        throw new Error("Method not implemented.");
    }
    async writeDescriptor(deviceId: string, service: string, characteristic: string, descriptor: string, value: DataView, options?: TimeoutOptions | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async startNotifications(deviceId: string, service: string, characteristic: string, callback: (value: DataView) => void): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async stopNotifications(deviceId: string, service: string, characteristic: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

describe(`BluetoothDevice`, () => {

    it(`can be instantiated`, () => {
        expect(new BluetoothDevice(new MockDriver(), '0')).toBeTruthy();
    });
});