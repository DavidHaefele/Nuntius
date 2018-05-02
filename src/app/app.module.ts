import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AuthService } from '../providers/auth-service';

import { HttpModule } from "@angular/http";
import { Welcome } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { Details } from '../pages/details/details';
import { Signup } from '../pages/signup/signup';
import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';


@NgModule({
  declarations: [
    MyApp,
    Welcome,
    AboutPage,
    ContactPage,
    HomePage,
    Details,
    Signup,
    Login,
    TabsPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Welcome,
    AboutPage,
    ContactPage,
    HomePage,
    Details,
    Signup,
    Login,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen, AuthService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider
  ]
})
export class AppModule {}
