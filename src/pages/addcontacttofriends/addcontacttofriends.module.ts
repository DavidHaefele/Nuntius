import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactToFriends } from './addcontacttofriends';

@NgModule({
  declarations: [
    AddContactToFriends,
  ],
  imports: [
    IonicPageModule.forChild(AddContactToFriends),
  ],
  exports: [
    AddContactToFriends
  ]
})
export class HomeModule {}
