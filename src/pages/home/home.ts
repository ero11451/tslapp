import { AdsModel } from './../../models/adsModel';
import { AdsProvider } from './../../providers/ads/ads';
import { Helpers } from './../../app/app.helpers';
import { Post, Paging } from './../../models/wordpress';
import { WordpressProvider } from './../../providers/wordpress/wordpress';
import { StatusBar } from '@ionic-native/status-bar';
import { SEARCH_PAGE, ACCOUNT_MODAL_PAGE, CATEGORY_DETAILS_PAGE } from './../pages.constants';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll, Content, Slides } from 'ionic-angular';
import { LocalStorageKey } from '../../app/config/app.constants';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [WordpressProvider, AdsProvider]
})
export class HomePage {
  @ViewChild('content') content: Content;
  @ViewChild('adSlider') adSlider: Slides;
  categories: Array<{ title: string, image: string, id: number[] }>
  posts: Post[];
  loading: boolean;
  isChildPage: boolean;
  user: any;
  isOnPage: boolean;
  paging: Paging;
  nextPage: number = 2;
  adSlides: AdsModel[];
  constructor(private _ads: AdsProvider, public _helpers: Helpers, private _wp: WordpressProvider, private statusBar: StatusBar, private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {

    this.getUserDetails();
    this.initializeCategories();
    this.getPostsList();
    this.getAds();
  }






  ionViewWillEnter() {
    this.isChildPage = false;
    this.isOnPage = true;

    setTimeout(() => {

      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#0bce86');
    }, 200);
  }



  ionViewDidLeave() {
    this.isOnPage = false;
    if (!this.isChildPage) {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
    }
  }


  initializeCategories() {
    this.categories = [
      {
        title: 'Edo state news',
        image: `assets/imgs/categories/edo.png`,
        id: [41, 53]
      },
      {
        title: 'business',
        image: `assets/imgs/categories/business.svg`,
        id: [44]
      },
      {
        title: 'science & tech.',
        image: `assets/imgs/categories/science.svg`,
        id: [55]
      },
      {
        title: 'sport',
        image: `assets/imgs/categories/sport.png`,
        id: [47]
      },
      {
        title: 'lifestyle',
        image: `assets/imgs/categories/lifestyle.svg`,
        id: [60, 116, 45, 43, 48]
      },
      {
        title: 'events',
        image: `assets/imgs/categories/events.svg`,
        id: [46]
      },
    ]

  }

  getPostsList() {
    this.loading = true;
    this.getOfflinePosts();
    if (this.posts) {
      this.loading = false;
    }
    this.fetchPosts()
  }


  fetchPosts() {
    this._wp.getPosts()
      .subscribe(res => {
        this.posts = res.data.posts;
        this.paging = res.data._paging;
        this._helpers.save(LocalStorageKey.posts, this.posts);
        this.loading = false;
      }, error => {
        this.loading = false;
        if (this.isOnPage) {
          this._helpers.createNativeToast('Can not retrive recent news at this time.')
        }
      })
  }

  async getOfflinePosts() {
    this.posts = await this._helpers.get(LocalStorageKey.posts)
  }

  openCategoryDetails(id: number[] | string, name: string) {
    this.isChildPage = true;
    this.navCtrl.push(CATEGORY_DETAILS_PAGE, { id, name })
  }

  openPost(link) {
    if (link) {
      this._helpers.openPost(link)
    }
  }

  goToSearch() {
    this.navCtrl.push(SEARCH_PAGE);
  }

  openAccountOptions() {
    this.modalCtrl.create(ACCOUNT_MODAL_PAGE, this.user, {
      'cssClass': 'action-modal home-modal'
    }).present()
  }

  async  getUserDetails() {
    this.user = await this._helpers.getUserProfile()
  }

  loadMore(infiniteScroll: InfiniteScroll) {
    if (this.paging.totalPages && this.nextPage < Number(this.paging.totalPages)) {
      this._wp.getPosts(this.nextPage)
        .subscribe(res => {
          this.posts.push(...res.data.posts);
          this._helpers.save(LocalStorageKey.posts, this.posts);
          this.nextPage++;
          infiniteScroll.complete();
        }, error => {
          if (this.isOnPage) {
            this._helpers.createNativeToast('Can not retrive more posts at this time.')
          }
        })
    } else {
      infiniteScroll.enable(false);
      infiniteScroll.complete();
    }
  }

  //method to scroll to top when tab is tapped
  ionSelected() {
    this.content.scrollToTop();
  }

  getAds() {

    this._ads.getActiveAds()
      .subscribe(res => {
        this.adSlides = res.data;
        if (this.adSlides && this.adSlides.length) {
          setTimeout(() => {
            this.configAdSlides()
          }, 1000);

        }
      }, error => {
      })
  }

  configAdSlides() {
    if (this.adSlider) {
      this.adSlider.autoplayDisableOnInteraction = false;
    }
  }



  doRefresh(refresher) {
    this.getAds();
    this._wp.getPosts()
      .subscribe(res => {
        this.nextPage = 2;
        this.posts = res.data.posts;
        this.paging = res.data._paging;
        this._helpers.save(LocalStorageKey.posts, this.posts);
        refresher.complete();
      }, error => {
        refresher.complete();
        if (this.isOnPage) {
          this._helpers.createNativeToast('Can not retrive recent news at this time.')
        }
      })
  }
}
