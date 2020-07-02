import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ShareModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-modal',
  templateUrl: 'share-modal.html',
})
export class ShareModalPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }


  dismiss(confirm = false) {
    this.viewCtrl.dismiss(confirm)
  }
}
