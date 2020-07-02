import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryDetailsPage } from './category-details';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    CategoryDetailsPage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(CategoryDetailsPage),
  ],
})
export class CategoryDetailsPageModule {}
