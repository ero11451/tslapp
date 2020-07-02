import { Storage } from '@ionic/storage';
import { AUTH_PAGE } from './../pages.constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageKey } from '../../app/config/app.constants';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(private storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
  }


  goToAuth() {
    this.storage.set(LocalStorageKey.firstLaunchDone, true);
    this.navCtrl.setRoot(AUTH_PAGE, null, { animate: true, direction: 'forward', animation: 'push' })
  }



}
