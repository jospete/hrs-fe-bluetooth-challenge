import { BleClientInterface } from "@capacitor-community/bluetooth-le";
import { BluetoothDevice } from "./bluetooth-device";

class MockDriver implements Partial<BleClientInterface> {
}

describe(`BluetoothDevice`, () => {

    it(`can be instantiated`, () => {
        expect(new BluetoothDevice(new MockDriver() as any, '0')).toBeTruthy();
    });
});