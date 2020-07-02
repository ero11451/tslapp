import { FeedBack, ReqCallBack } from './../../models/assistantModel';
import { BaseProvider } from './../base/base';
import { Injectable } from '@angular/core';

/*
  Generated class for the AssistantProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AssistantProvider {
  actionUrl = "/assistant";

  constructor(private api: BaseProvider) {
   }

  submitFeedback(data: FeedBack) {
    this.api.setActionUrl(this.actionUrl, "/feedback")
    return this.api.post<any>(data);
  }

  submitCallbackReq(data: ReqCallBack) {
    this.api.setActionUrl(this.actionUrl, "/reqcallback")
    return this.api.post<any>(data);
  }
}
