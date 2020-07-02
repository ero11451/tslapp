import { API_URL } from './../../app/config/app.constants';
import { Helpers } from './../../app/app.helpers';
import { Post } from './../../models/wordpress';
import { WordpressProvider } from './../../providers/wordpress/wordpress';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IreportProvider } from '../../providers/ireport/ireport';
import { IREPORT_DETAILS_PAGE } from '../pages.constants';

/**
 * Generated class for the CategoryDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-details',
  templateUrl: 'category-details.html',
  providers: [WordpressProvider, IreportProvider]
})
export class CategoryDetailsPage {
  categories: number[] & string;
  posts: Post[] = [];
  categoryName: string;
  loading: boolean;
  ireports: any;
  baseUrl = API_URL;
  toast: any;
  onPage: boolean;
  type: string;
  constructor(private _ireport: IreportProvider, public _helpers: Helpers, private _wp: WordpressProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.categories = this.navParams.get('id');
    this.categoryName = this.navParams.get('name');
  }

  ionViewDidLoad() {
    this.onPage = true;
    this.getCategoryPosts()
  }

  ionViewWillLeave() {
    this.onPage = false;
    if (this.toast) {
      this.toast.dismiss()
    }
  }

  getCategoryPosts() {
    this.loading = true;
    if (this.categories === 'ireport') {
      this.type = 'ireport'
      this._ireport.getIreports()
        .subscribe(res => {
          this.ireports = res.data;
          this.loading = false;
        }, error => {
          this.loading = false;
          this.showErrorMessage('iReports')

        })
    } else {
      this.type = 'wordpress'
      this.categories.forEach(async cat => {
        try {
          const posts = await this._wp.getCategoryPosts(cat).toPromise();
          if (posts.data.posts.length) {
            this.loading = false;
          }
          this.posts.push(...posts.data.posts);
        } catch (error) {
          if (this.loading == true) {
            this.showErrorMessage('posts');
          }
          this.loading = false;

        }
      })
    }
  }

  openPost(link) {
    this._helpers.openPost(link)
  }

  openIreport(post) {
    this.navCtrl.push(IREPORT_DETAILS_PAGE, post)
  }
  private showErrorMessage(type: string) {
    if (this.onPage && !this.posts.length) {
      this.toast = this._helpers.createErrorToast(`Failed to retrive ${type}.`, true, "Tap To Retry");
      this.toast.onDidDismiss((_data, role) => {
        if (role == 'close') {
          this.getCategoryPosts()
        }
      })
      this.toast.present()
    }
  }
}
