import { HeaderInterceptor } from './../interceptors/header-interceptor';
import { HeaderColor } from '@ionic-native/header-color';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Helpers } from './app.helpers';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { BaseProvider } from '../providers/base/base';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Toast } from '@ionic-native/toast';
import { IonicStorageModule } from '@ionic/storage';
import { RequestInterceptor } from '../interceptors/request-interceptor';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot({
      'name': '__tsltv',
      'storeName': '_user',
      'driverOrder': ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    BrowserTab,
    InAppBrowser,
    Toast,
    StreamingMedia,
    Helpers,
    StatusBar,
    SplashScreen,
    HeaderColor,
    BaseProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },

  ]
})
export class AppModule { }
