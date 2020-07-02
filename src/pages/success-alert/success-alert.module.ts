import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuccessAlertPage } from './success-alert';

@NgModule({
  declarations: [
    SuccessAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(SuccessAlertPage),
  ],
})
export class SuccessAlertPageModule {}
