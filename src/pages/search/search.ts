import { Helpers } from './../../app/app.helpers';
import { Post } from './../../models/wordpress';
import { WordpressProvider } from './../../providers/wordpress/wordpress';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [WordpressProvider]
})
export class SearchPage {
  @ViewChild('searchBar') searchBar: Searchbar;
  keyword: string;
  searching: Subscription;
  posts: Post[];
  loading: boolean;
  constructor(public _helpers: Helpers, private _wp: WordpressProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchBar.setFocus()
    }, 600);
  }

  search() {
    this.loading = true;
    if (this.searching) {
      this.searching.unsubscribe()
    }
    if (this.keyword.trim().length > 2) {
      this.searching = this._wp.searchPosts(this.keyword)
        .subscribe(res => {
          if (res.status) {
            this.posts = res.data.posts;
            this.loading = false;
          }
        }, error => {
          this.loading = false;
        })
    } else {
      this.loading = false;
    }
  }
}
