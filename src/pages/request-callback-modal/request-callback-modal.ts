import { Helpers } from './../../app/app.helpers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReqCallBack } from './../../models/assistantModel';
import { AssistantProvider } from './../../providers/assistant/assistant';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the RequestCallbackModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-callback-modal',
  templateUrl: 'request-callback-modal.html',
  providers: [AssistantProvider]
})
export class RequestCallbackModalPage {

  callReqForm: FormGroup;
  user: any;
  providers: [AssistantProvider]
  constructor(private _helpers: Helpers, private fb: FormBuilder, private _assistant: AssistantProvider, private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.callReqForm = this.fb.group({
      'name': [null, [Validators.required]],
      'phoneNumber': [null, [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      'body': [null]
    });

    this.user = this.navParams.data;
  }

  sendCallbackReq() {
    this._helpers.createLoader().present();
    const formData = this.callReqForm.value;
    const reqData: ReqCallBack = {
      body: formData.body,
      phone: formData.phoneNumber,
      fullName: formData.name,
      email: this.user.email
    }
    this._assistant.submitCallbackReq(reqData)
      .subscribe(res => {
        this._helpers.dismissLoader()
        const modal = this._helpers.openSuccessAlert();
        setTimeout(() => {
          this.callReqForm.reset();
          modal.dismiss()
        }, 3000);
      }, error => {
          this._helpers.dismissLoader()
          this._helpers.createAlert('Call back request failed. Please check your internet connection and try again.').present()
      })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
