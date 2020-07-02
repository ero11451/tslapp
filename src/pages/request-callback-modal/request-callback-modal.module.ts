import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestCallbackModalPage } from './request-callback-modal';

@NgModule({
  declarations: [
    RequestCallbackModalPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestCallbackModalPage),
  ],
})
export class RequestCallbackModalPageModule {}
