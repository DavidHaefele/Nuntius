import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { FriendsPage } from '../friends/friends';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FriendsPage;
  tab2Root = AboutPage;

  badges;

  constructor() {
      this.badges = 3;
  }
}
