import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountModalPage } from './account-modal';

@NgModule({
  declarations: [
    AccountModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountModalPage),
  ],
})
export class AccountModalPageModule {}
