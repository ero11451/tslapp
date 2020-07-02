import { API_URL } from './../../app/config/app.constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the IreportDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ireport-details',
  templateUrl: 'ireport-details.html',
})
export class IreportDetailsPage {
  post: { title: string, body: string, filePath: string, type: string };
  baseUrl = API_URL;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.post = this.navParams.data;
   }


}
