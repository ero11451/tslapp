import { Helpers } from './../../app/app.helpers';
import { FeedBack } from './../../models/assistantModel';
import { AssistantProvider } from './../../providers/assistant/assistant';
import { StatusBar } from '@ionic-native/status-bar';
import { REQUEST_CALLBACK_MODAL_PAGE, FEEDBACK_PAGE } from './../pages.constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the AssistantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assistant',
  templateUrl: 'assistant.html',
  providers: [AssistantProvider]
})
export class AssistantPage {
  feedback: string;
  childPage: boolean;
  user: any;
  constructor(private _helpers: Helpers, private _assistant: AssistantProvider, private statusBar: StatusBar, private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.getUserDetails();
  }

  ionViewWillEnter() {
    this.childPage = false;
    setTimeout(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#09a068');
    }, 100);
  }

  ionViewDidLeave() {
    if (!this.childPage) {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
    }
  }
  openRequestCallBack() {
    this.modalCtrl.create(REQUEST_CALLBACK_MODAL_PAGE, this.user).present()
  }
  goToFeedback() {
    this.childPage = true;
    this.navCtrl.push(FEEDBACK_PAGE, this.user)
  }

  sendFeedback() {
    if (this.feedback && this.feedback.trim().length > 3) {
      this._helpers.createLoader().present()
      const reqData: FeedBack =
      {
        body: this.feedback,
        email: this.user.email
      };
      this._assistant.submitFeedback(reqData)
        .subscribe(res => {
          this._helpers.dismissLoader()
          if (res.status) {
            this.feedback = "";
            const modal = this._helpers.openSuccessAlert();
            setTimeout(() => {
              modal.dismiss()
            }, 3000);
          }
        }, error => {
          this._helpers.dismissLoader()
          this._helpers.createAlert('Feedback request failed. Please check your internet connection and try again.').present()
        })
    }
  }


  async getUserDetails() {
    this.user = await this._helpers.getUserProfile()
  }
}
