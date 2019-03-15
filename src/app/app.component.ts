import { Component, ViewChild  } from '@angular/core';
import { Platform, App, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Welcome } from '../pages/welcome/welcome';
import { SplitPane } from '../providers/split-pane';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = Welcome;

  @ViewChild(Nav) nav: Nav; 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public splitPane: SplitPane, public app: App, public menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    this.menu.enable(false);
    this.splitPane.splitPaneState = false;
    this.nav.setRoot(this.rootPage);
  }

  logout() {
    //Api Token Logout 
    localStorage.clear();
    this.menu.enable(false);
    setTimeout(() => this.backToWelcome(), 1000);

  }

}
