import { TestBed } from '@angular/core/testing';

import { BluetoothDeviceService } from './bluetooth-device.service';

describe('BluetoothDeviceService', () => {
  let service: BluetoothDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BluetoothDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
