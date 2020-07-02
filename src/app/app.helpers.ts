import { Storage } from '@ionic/storage';
import { LocalStorageKey } from './config/app.constants';
import { SUCCESS_ALERT_PAGE } from './../pages/pages.constants';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Injectable } from "@angular/core";
import { Loading, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { FormControl } from '@angular/forms';

@Injectable()
export class Helpers {

  categories: any;
  loading: Loading;


  constructor(private storage: Storage, private modalCtrl: ModalController, private toast: Toast, public browserTab: BrowserTab, public iab: InAppBrowser, private streamingMedia: StreamingMedia, private toastCtrl: ToastController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }


  createAlert(message = '', title = '', subTitle = '', buttonText = 'OK') {
    return this.alertCtrl.create({
      'title': title,
      subTitle: subTitle,
      'message': message,
      buttons: [
        {
          text: buttonText,
        },
      ]
    });
  }

   /**
   *
   *  Creates a native toast
   * @param {string} message
   * @param {string} [position='bottom']
   * @param {number} [duration=3000]
   * @returns {Observable}
   * @memberof CommonMethods
   */
  async createNativeToast(message: string, position: string = 'bottom', duration: number = 3000) {
    return await this.toast.showWithOptions({
      'message': message,
      'position': position,
      'duration': duration
    }).toPromise();
  }

  createLoader(content = '', cssClass = '') {
    // this.registerBackButton = this.handleBackButton();
    this.loading = this.loadingCtrl.create({
      'content': content,
      'cssClass': cssClass
    });

    // this.loading.didLeave.subscribe(() => this.registerBackButton());
    return this.loading;
  }


  save(key: LocalStorageKey, value) {
    return this.storage.set(key, value);
  }

  get(key: LocalStorageKey) {
    return this.storage.get(key);
  }

  dismissLoader() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }


  getUserProfile() {
    return this.storage.get(LocalStorageKey.user);
  }

  createSuccessToast(content = '', cssClass = 'success-toast') {
    return this.toastCtrl.create({
      'message': content,
      'duration': 3000,
      'cssClass': cssClass
    });
  }

  createErrorToast(content = '', showButton = false, buttonText = "",cssClass = "error-toast") {
    return this.toastCtrl.create({
      'message': content,
      'cssClass': cssClass,
      closeButtonText:buttonText,
      showCloseButton:showButton,
    });
  }

  createNotificationToast(content = '', data, cssClass = 'notification-toast') {
    return this.toastCtrl.create({
      'message': content,
      'duration': 5000,
      'cssClass': cssClass,
      'position': 'top',
      'closeButtonText': 'View',
      'showCloseButton': true
    });
  }

  openPost(link: string) {
    this.browserTab.isAvailable()
      .then(isAvailable => {
        if (isAvailable) {
          this.browserTab.openUrl(link);
        } else {
          this.iab.create(link, '_blank', { toolbarcolor: '#0bce86' })
        }
      });
  }

  playVideo(link, options: StreamingVideoOptions = {}) {
    options = options ? options : {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming', e) },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: true
    };

    this.streamingMedia.playVideo(link, options);
  }

  openSuccessAlert() {
    const modal = this.modalCtrl.create(SUCCESS_ALERT_PAGE, null, { 'cssClass': 'success-modal ' });
    modal.present()
    return modal;
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
