import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AuthService } from '../providers/auth-service';
import { SplitPane } from '../providers/split-pane';

import { HttpModule } from "@angular/http";
import { Welcome } from '../pages/welcome/welcome';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { Details } from '../pages/details/details';
import { Signup } from '../pages/signup/signup';
import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AddContact } from '../pages/addcontact/addcontact';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { StorageHandlerProvider } from '../providers/storage-handler/storage-handler';
import { LocalNotifications } from '@ionic-native/local-notifications';


@NgModule({
  declarations: [
    MyApp,
    Welcome,
    AboutPage,
    ContactPage,
    Details,
    Signup,
    Login,
    AddContact,
    TabsPage,
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      tabsHighlight: 'true',
      tabsHideOnSubPages: 'true'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Welcome,
    AboutPage,
    ContactPage,
    Details,
    Signup,
    Login,
    AddContact,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen, AuthService, SplitPane, LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    StorageHandlerProvider
  ]
})
export class AppModule {}
