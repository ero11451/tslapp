import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharingPage } from './sharing';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    SharingPage,
  ],
  imports: [
    IonicImageViewerModule,
    IonicPageModule.forChild(SharingPage),
  ],
})
export class SharingPageModule {}
