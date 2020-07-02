import { WordpressPost, WordpressCategory } from './../../models/wordpress';
import { BaseProvider } from './../base/base';
import { Injectable } from '@angular/core';

/*
  Generated class for the WordpressProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WordpressProvider {

  actionUrl = '/wp'
  constructor(private api: BaseProvider) {
  }

  getPosts(page = 1) {
    this.api.setActionUrl(this.actionUrl, `/posts?page=${page}`)
    return this.api.get<WordpressPost>();
  }

  searchPosts(keyword: string) {
    this.api.setActionUrl(this.actionUrl, `/search/${keyword}`)
    return this.api.get<WordpressPost>();

  }

  getCategories() {
    this.api.setActionUrl(this.actionUrl, "/category");
    return this.api.get<WordpressCategory[]>();

  }

  getCategoryPosts(id: number) {
    this.api.setActionUrl(this.actionUrl, `/category/${id}`)
    return this.api.get<WordpressPost>();

  }

}
