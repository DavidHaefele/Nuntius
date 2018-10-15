import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateGroup } from './creategroup';

@NgModule({
  declarations: [
    CreateGroup,
  ],
  imports: [
    IonicPageModule.forChild(CreateGroup),
  ],
  exports: [
    CreateGroup
  ]
})
export class HomeModule {}
