import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BleDeviceListPage } from './ble-device-list.page';

describe('BleDeviceListPage', () => {
  let component: BleDeviceListPage;
  let fixture: ComponentFixture<BleDeviceListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BleDeviceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
