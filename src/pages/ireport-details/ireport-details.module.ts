import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IreportDetailsPage } from './ireport-details';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    IreportDetailsPage,
  ],
  imports: [
    IonicImageViewerModule,
    IonicPageModule.forChild(IreportDetailsPage),
  ],
})
export class IreportDetailsPageModule { }
