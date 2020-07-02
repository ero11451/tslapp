import { StatusBar } from '@ionic-native/status-bar';
import { SETTINGS_PAGE } from './../pages.constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the AccountModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-modal',
  templateUrl: 'account-modal.html',
  providers: [SocialSharing]
})
export class AccountModalPage {
  childPage: boolean;
  user: any;

  constructor(private platform: Platform, private socialSharing: SocialSharing, private statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.data;
  }

  ionViewWillEnter() {
    this.childPage = false;
    setTimeout(() => {

      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#0bce86');
    }, 100);
  }

  async openShareOptions() {
    const url = this.platform.is("android") ? "https://play.google.com/store/apps/details?id=tv.tslnigeria.app" : "https://itunes.apple.com/app/id1450496752";
    const msg = "Download this app to get the latest news";
    const message = this.platform.is("android") ?  msg : `${msg}:  ${url}`;
    try {
      await this.socialSharing.shareWithOptions({
        "chooserTitle": "Share TslTv app via...",
        message,
        url
      })
    } catch (error) {
      console.error(error);
    }
  }

  ionViewDidLeave() {
    if (this.childPage) {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
    }
  }

  goToSettingsPage() {
    this.childPage = true;
    this.navCtrl.push(SETTINGS_PAGE)
  }

}
