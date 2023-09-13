import { Component } from '@angular/core';
import {BluetoothLeWeb} from "@capacitor-community/bluetooth-le/dist/esm/web";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
      private BluetoothLeWeb: BluetoothLeWeb
  ) {}

    //Todo remove and update as needed
    private initBluetooth() {
      this.BluetoothLeWeb.initialize();
    }
}
