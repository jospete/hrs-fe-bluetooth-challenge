import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ble-device-info',
  templateUrl: './ble-device-info.page.html',
  styleUrls: ['./ble-device-info.page.scss'],
})
export class BleDeviceInfoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public async disconnect(): Promise<void> {
  }
}
