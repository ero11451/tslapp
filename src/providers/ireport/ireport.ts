import { Injectable } from '@angular/core';
import { BaseProvider } from '../base/base';

/*
  Generated class for the LiveProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IreportProvider {
  actionUrl = "/ireport";

  constructor(private api: BaseProvider) {
  }

  getIreports() {
    this.api.setActionUrl(this.actionUrl)
    return this.api.get<any>();
  }
}
