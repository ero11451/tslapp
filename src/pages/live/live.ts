import { LiveSettings } from './../../models/liveModel';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { YoutubeItem } from './../../models/youtubeChannel.model';
import { YoutubeProvider } from './../../providers/youtube/youtube';
import { Helpers } from './../../app/app.helpers';
import { LiveProvider } from './../../providers/live/live';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageKey } from '../../app/config/app.constants';
import { Live } from '../../models/liveModel';

/**
 * Generated class for the LivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-live',
  templateUrl: 'live.html',
  providers: [LiveProvider, YoutubeVideoPlayer, YoutubeProvider]
})
export class LivePage {
  events: Live[];
  event: LiveSettings;
  link: any;
  loading: boolean;
  messages: YoutubeItem[];
  showVideo: boolean;
  isLive: boolean;
  showBanner: boolean;
  constructor(private platform:Platform,private _yt: YoutubeProvider, private _helpers: Helpers, private sanitizer: DomSanitizer, private _live: LiveProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getVideosFromYoutube();
    this.getLiveEvents();
    this.getLiveEventSettings();
  }

  async getLiveEvents() {
    this.loading = true;
    this.events = await this.getOfflineEvents();
    this._live.getLiveEvents()
      .subscribe(res => {
        this.loading = false;
        this.events = res.data;
        if (this.events.length) {
          this.events = this.events.map(res => {
            res.expand = false
            return res;
          });
        }
        this._helpers.save(LocalStorageKey.liveEvents, this.events);
      }, error => {
        this.loading = false;
        this._helpers.createNativeToast('Can not retrive live event activities at this time.');
      })
  }

  async getOfflineEvents() {
    return this._helpers.get(LocalStorageKey.liveEvents);
  }

  getLiveEventSettings() {
    this._live.getLiveSettings()
      .subscribe(res => {
        this.event = res.data;
        this.processLiveSettings(res.data)
      }, error => {
        console.error(error);
      });
  }

  openVideo(id) {
    if(!this.platform.is("ios")){
      this._yt.openVideo(id);
    }else{
      console.log(id);
      this._helpers.openPost(`https://www.youtube.com/embed/${id}?start=68`)
    }
   // return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?rel=0`);;
  }

  processLiveSettings(data: LiveSettings) {
    if (data) {
      this.event.link = this.extractVideoId(this.event.link);
      this.link = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.event.link}?rel=0`);
      if (this.event.isActive && this.event.status) {
        this.showVideo = true;
        this.isLive = true;
        this.showBanner = false;
      } else if (this.event.isActive && !this.event.status) {
        this.showBanner = false;
        this.showVideo = true;
        this.isLive = false
      }
      else {
        this.isLive = false;
        this.showVideo = false;
        this.showBanner = this.event.nextEventBanner ? true : false;
      }
    }
  }
  getVideosFromYoutube() {
    this._yt.getListVideos('PLOLUXRM4GoT4upBQcGvE32tWmTR-BgUa6')
      .subscribe((data) => {
        this.messages = data.items;
        console.log(data.items);
      }, err => {
        // this.error = { type: 'videos' };
        console.error(err)
      });
  }

  extractVideoId(url: string) {
    const match = url.match(/v=([0-9a-z_-]{1,20})/i);
    return (match ? match['1'] : false);
  }

  switchView(index) {

    this.events = this.events.map((res, i) => {
      if (i != index) {
        res.expand = false;
      } else {
        res.expand = !res.expand
      }
      return res;
    })
  }
  doRefresh(refresher: Refresher) {
    this.getLiveEvents();
    this.loading = false;
    this._live.getLiveSettings()
      .subscribe(res => {
        this.event = res.data;
        this.processLiveSettings(res.data);
        refresher.complete();
      }, error => {
        refresher.complete();
        this._helpers.createNativeToast('Can not retrive live event activities at this time.');
      });
  }
}
