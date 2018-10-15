import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { FriendsPage } from '../friends/friends';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FriendsPage;
  tab2Root = SettingsPage;

  badges;

  constructor() {
      this.badges = 3;
  }
}
