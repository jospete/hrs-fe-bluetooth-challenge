import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ble-device-list',
    pathMatch: 'full'
  },
  {
    path: 'ble-device-list',
    loadChildren: () => import('./ble-device-list/ble-device-list.module').then( m => m.BleDeviceListPageModule)
  },
  {
    path: 'ble-device-info',
    loadChildren: () => import('./ble-device-info/ble-device-info.module').then( m => m.BleDeviceInfoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
