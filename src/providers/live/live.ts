import { Live, LiveSettings } from './../../models/liveModel';
import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';

/*
  Generated class for the LiveProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LiveProvider {
  actionUrl = "/live";

  constructor(private api: BaseProvider) {
  }

  getLiveEvents() {
    this.api.setActionUrl(this.actionUrl)
    return this.api.get<Live[]>();
  }
  getLiveSettings() {
    this.api.setActionUrl(this.actionUrl, "/settings")
    return this.api.get<LiveSettings>();
  }
}
