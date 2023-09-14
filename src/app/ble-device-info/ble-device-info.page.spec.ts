import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BleDeviceInfoPage } from './ble-device-info.page';

describe('BleDeviceInfoPage', () => {
  let component: BleDeviceInfoPage;
  let fixture: ComponentFixture<BleDeviceInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BleDeviceInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
