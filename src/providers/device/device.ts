import { BaseProvider } from './../base/base';
import { Injectable } from '@angular/core';

/*
  Generated class for the DeviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeviceProvider {
  actionUrl = '/device'
  constructor(private _api: BaseProvider) {
  }

  subscribeToPushTopic(data) {
    this._api.setActionUrl(this.actionUrl, '/push/subscribe');
    return this._api.post(data)
  }

  unsubscribeToPushTopic(data) {
    this._api.setActionUrl(this.actionUrl, '/push/unsubscribe');
    return this._api.post(data)
  }

}
