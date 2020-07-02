import { Storage } from '@ionic/storage';
import { TABS_PAGE, WELCOME_PAGE, AUTH_PAGE } from './../pages/pages.constants';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageKey } from './config/app.constants';
import { HeaderColor } from '@ionic-native/header-color';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;

  constructor(private headerColor: HeaderColor, private storage: Storage, public platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initializeApp()
      window.console.log = (...parmas)=>{}
      window.console.error = (...parmas)=>{}
    });
  }

  async initializeApp() {
    this.headerColor.tint('#0bce86');
    const user = await this.storage.get(LocalStorageKey.user);
    const firstLaunchDone = await this.storage.get(LocalStorageKey.firstLaunchDone);
    if (this.platform.is("ios")) {
      this.statusBar.overlaysWebView(false);
    }
    if (user) {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#0bce86');
      this.rootPage = TABS_PAGE;
    } else if (firstLaunchDone) {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.rootPage = AUTH_PAGE;
    } else {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.rootPage = WELCOME_PAGE;
    }
    this.splashScreen.hide()
  }

}

