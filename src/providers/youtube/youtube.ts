import { YoutubeChannel } from './../../models/youtubeChannel.model';
import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

/*
  Generated class for the YoutubeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class YoutubeProvider {

  apiKey = 'AIzaSyDZhzsXekYMrpg64cu4Mmm8WMS4DO_anII';

  constructor(public http: HttpClient, private youtube: YoutubeVideoPlayer, private plt: Platform) { }

  getPlaylistsForChannel(channel) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?key=' + this.apiKey + '&channelId=' + channel + '&part=snippet,id&maxResults=20');

  }

  getListVideos(listId) {
    return this.http.get<YoutubeChannel>(`https://www.googleapis.com/youtube/v3/playlistItems?key=${this.apiKey}&playlistId=${listId}&part=snippet,id&maxResults=20`);
  }

  openVideo(videoId) {
    console.log(videoId);
    if (this.plt.is('cordova')) {
      this.youtube.openVideo(videoId);
    } else {
      window.open(`https://www.youtube.com/watch?v=${videoId}`);
    }
  }
}
