import { Helpers } from './../../app/app.helpers';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { LocalStorageKey } from '../../app/config/app.constants';
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [AppVersion]
})
export class SettingsPage {
  notification: boolean;
  version: string;
  constructor(private appVersion: AppVersion, private event: Events, private _helpers: Helpers, public navCtrl: NavController, public navParams: NavParams) {
    this.getSettings();
    this.getAppVersion()
  }


  async getAppVersion() {
    this.version = await this.appVersion.getVersionNumber()
  }
  getSettings() {
    this._helpers.get(LocalStorageKey.showNotification)
      .then(res => {
        if (res != null) {
          this.notification = res;
        } else {
          this.notification = true;
        }
      })

  }
  switchNotification(newState) {
    this._helpers.save(LocalStorageKey.showNotification, newState).then(() => {
      this.event.publish('notification:setting', newState)
    });
  }
}
