import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivePage } from './live';

@NgModule({
  declarations: [
    LivePage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(LivePage),
  ],
})
export class LivePageModule {}
