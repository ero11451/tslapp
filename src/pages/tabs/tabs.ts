import { AuthProvider } from './../../providers/auth/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Helpers } from './../../app/app.helpers';
import { PushTopics, LocalStorageKey } from './../../app/config/app.constants';
import { DeviceProvider } from './../../providers/device/device';
import { ASSISTANT_PAGE, LIVE_PAGE, SHARING_PAGE, HOME_PAGE, IREPORT_DETAILS_PAGE, AUTH_PAGE } from './../pages.constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, Events, Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  providers: [Firebase, DeviceProvider, GooglePlus, AuthProvider]
})
export class TabsPage {

  homeRoot = HOME_PAGE
  sharingRoot = SHARING_PAGE
  liveRoot = LIVE_PAGE
  assistantRoot = ASSISTANT_PAGE


  constructor(private _auth: AuthProvider, private platform: Platform, private event: Events, private _helpers: Helpers, private _device: DeviceProvider, private firebase: Firebase, public navCtrl: NavController) {
    this.checkAndUpdateNotificationState();
    this.handlePushNotifications();
    this.event.subscribe('notification:setting', this.checkAndUpdateNotificationState)
    this.event.subscribe('auth:logout', this.logout)
  }

  checkAndUpdateNotificationState = () => {
    this._helpers.get(LocalStorageKey.showNotification)
      .then(res => {
        if (res == null || res) {

          this.subscribeToPushNotifications();
        } else {
          this.unsubscribeToPushNotifications();
        }
      })
  }

  logout = ()=> {
    this._auth.logout()
      .then(res => {
        if (res) {
          this.navCtrl.setRoot(AUTH_PAGE);
        }
      }).catch(res=>{

      })
  }

  async subscribeToPushNotifications() {
    try {
      const token = await this.firebase.getToken();
      const reqData = {
        deviceToken: token,
        topic: PushTopics.general
      }
      this._device.subscribeToPushTopic(reqData)
        .subscribe(res => {
        })
    } catch (error) {
    }
  }

  async unsubscribeToPushNotifications() {
    try {
      const token = await this.firebase.getToken();
      const reqData = {
        deviceToken: token,
        topic: PushTopics.general
      }
      this._device.unsubscribeToPushTopic(reqData)
        .subscribe(res => {
        })
    } catch (error) {
    }
  }

  handlePushNotifications() {
    if (this.platform.is("ios")) {

      this.firebase.hasPermission().then(async res => {
        if (!res.isEnabled) {
          await this.firebase.grantPermission()
        }
      }).catch(err => {
      })
    }
    this.firebase.onNotificationOpen().subscribe((response) => {
      if (response.tap) {
        //Received while app in background (this should be the callback when a system notification is tapped)
        // Handle notification based on notification type
        this.handleNotificationAction(response);
      } else {
        const type = response.type;
        let content: string;
        switch (type) {
          case 'ireport':
            content = JSON.parse(response.post).title;
            break;
          case 'wordpress':
            content = response.title
            break;
        }
        const toast = this._helpers.createNotificationToast(content, response);
        toast.onDidDismiss((_data, role) => {
          if (role == 'close') {
            this.handleNotificationAction(response);
          }
        });
        toast.present();
      }
    });
  }

  handleNotificationAction(response) {
    const type = response.type;
    switch (type) {
      case 'ireport':
        this.navCtrl.push(IREPORT_DETAILS_PAGE, JSON.parse(response.post))
        break;
      case 'wordpress':
        const link = JSON.parse(response.post).post_url;
        this._helpers.openPost(link);
        break;
    }
  }


}
