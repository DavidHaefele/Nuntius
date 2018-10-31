import { Component, ViewChild  } from '@angular/core';
import { Platform, App, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Welcome } from '../pages/welcome/welcome';
import { SplitPane } from '../providers/split-pane';
import { SettingsService } from '../providers/settings-service';

@Component({
  templateUrl: 'app.html',
  providers: [SettingsService]
})
export class MyApp {
  rootPage: any = Welcome;
  chosenTheme : String;
  @ViewChild(Nav) nav: Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, settings: SettingsService, public splitPane: SplitPane, public app: App, public menu: MenuController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    settings.setTheme(localStorage.getItem("design"));
    settings.getTheme().subscribe(val => this.chosenTheme = val);
  }

  //revert the user back to the welcome screen
  backToWelcome() {
    const root = this.app.getRootNav();
    this.menu.enable(false);
    this.splitPane.splitPaneState = false;
    this.nav.setRoot(this.rootPage);
  }

  //remove the current user data
  logout() {
    //Api Token Logout
    localStorage.clear();
    this.menu.enable(false);
    setTimeout(() => this.backToWelcome(), 1000);

  }

}
