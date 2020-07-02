import { Helpers } from './../../app/app.helpers';
import { AssistantProvider } from './../../providers/assistant/assistant';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedBack } from '../../models/assistantModel';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
  providers: [AssistantProvider]
})
export class FeedbackPage {
  feedback: string;
  user: any;
  constructor(private _helpers: Helpers, private _assistant: AssistantProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.data;
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

}
