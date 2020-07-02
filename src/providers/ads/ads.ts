import { AdsModel } from './../../models/adsModel';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';

/*
  Generated class for the AdsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdsProvider {
  actionUrl = '/ads'
  constructor(private _api: BaseProvider) {
  }

  getActiveAds() {
    this._api.setActionUrl(this.actionUrl, '/active');
    return this._api.get<AdsModel[]>()
  }

}
