import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContact } from './addcontact';

@NgModule({
  declarations: [
    AddContact,
  ],
  imports: [
    IonicPageModule.forChild(AddContact),
  ],
  exports: [
    AddContact
  ]
})
export class HomeModule {}
