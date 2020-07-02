import { LocalStorageKey } from './../../app/config/app.constants';
import { Storage } from '@ionic/storage';
import { BaseProvider } from './../base/base';
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  actionUrl: string = "/auth"
  constructor(private googlePlus: GooglePlus, public api: BaseProvider, private storage: Storage) {

  }

  getUserDetails() {
    // If method return error 12500, regenrate your sha1 key and update firebase console
    return this.googlePlus.login({
      'webClientId': '248545437866-k37373upfgt036bu0423ekaft7gkc7nh.apps.googleusercontent.com',
      'offline': true
    })
  }

  async logout() {
    try {
      await this.googlePlus.logout();
      await this.storage.clear()
      await this.storage.set(LocalStorageKey.firstLaunchDone, true)
      return true;
    } catch (error) {
      await this.storage.clear()
      await this.storage.set(LocalStorageKey.firstLaunchDone, true)
      return true;
    }
  }

  login(email) {
    this.api.setActionUrl(this.actionUrl, '/signin');
    return this.api.post<any>({ email })
  }


  signup(data) {
    this.api.setActionUrl(this.actionUrl, '/signup');
    return this.api.post<any>(data)
  }
}
