import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
//import { Content } from 'ionic-angular';
//import { empty } from 'rxjs/Observer';
import { LocalNotifications } from '@ionic-native/local-notifications';


//TODO Handle group chats diffrently from normal chats
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class Details {
  @ViewChild('content') content: any;
  @ViewChild('scroll') scroll: any;
  item;
  messages = [];
  dimensions: any;
  currentScrollPosition = 0;
  id: any = 1;
  reload: Boolean = false;
  ContentHeight: any;
  displayedMessages = 0;
  isGroup: Boolean = false;
  msgOut: any = { "conv": "", "message": "", "author": "", "groupMessage": false };


  scrollToBottom() {
    this.content.scrollToBottom();
  }

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  scrollTo(x: number,
    y: number,
    duration: number): void {
    this.content.scrollTo(x, y, duration);
  }

  contentHeight() {
    this.dimensions = this.content.getContentDimensions();
    this.ContentHeight = this.dimensions.scrollHeight - 591;
    this.currentScrollPosition = this.dimensions.scrollHeight - this.dimensions.scrollTop - 591;
    //console.log("CONTENT HEIGHT: " + this.ContentHeight + " YOUR SCROLL HIGHT : " + this.currentScrollPosition);
  }

  contentTop() {
    this.dimensions = this.content.getContentDimensions();
  }

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider, public localNotifications: LocalNotifications) {
    this.item = params.data.item;
    this.isGroup = this.item.isGroup;
    this.displayMessages();
    this.id = setInterval(() => {
      this.contentHeight();
      this.deltaMsg();
      if (this.reload == true) {
        console.log("New message!");
        this.displayMessages();
        this.reload = false;
      }
    }, 500);
  }


  //scroll to the bottom at loading
  ionViewDidEnter() {
    if (this.item.isGroup) {
      console.log("isGroup");
    } else {
      console.log("isNOTGroup");
    }
    this.contentTop();
    this.scrollToBottom();
    this.sleep(100).then(() => {
      this.scrollTo(0, this.ContentHeight, 1);
      this.sleep(100).then(() => {
        this.scrollTo(0, 100, 1);
        this.sleep(100).then(() => {
          this.scrollTo(0, 0, 1);
        });
      });
    });
    this.contentTop();
    //var scrollPos0 = this.dimensions.scrollHeight - this.dimensions.scrollTop + 1000;

    /*var id2 = setInterval(() => {
      this.contentTop();
      //var scrollPos = this.dimensions.scrollHeight - this.dimensions.scrollTop;
      this.contentHeight();
    }, 500);*/
  }

  ionViewWillLeave() {
    clearInterval(this.id);
  }
  
  //display all messages between the current user and his contact or group
  displayMessages() {
    this.displayedMessages = 0;
    var userData = { "conv": "" };
    this.messages = [];
    userData.conv = this.storageH.getConv(this.item);
    console.log("checking for messages between " + userData.conv);
    if (userData.conv) {
      //Api connections
      this.authService.postData(userData, "displayMessages").then((result) => {
        var response: any = result;
        if (result) {
          for (let message in response.messagelist) {
            if (response.messagelist[message]["authorID"] == this.storageH.getID().toString()) {
              this.displayedMessages++;
              this.messages.push({ "message": response.messagelist[message]["message"], "author": response.messagelist[message]["author"], "showown": true });
            }
            else{
              this.displayedMessages++;
              this.messages.push({ "message": response.messagelist[message]["message"], "author": response.messagelist[message]["author"], "showown": false });
            }
          }
        }

        else {
          console.log("Not found!");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Could not connect to the server");
       // this.presentToast("Connection failed. Error: " + err);
      });
    }
    else {
      this.presentToast("Could not load messages. Try again!");
    }
  }

  //send a message to the other account or group
  msgSend() {
    this.msgOut = { "conv": "", "message": "", "author": "", "groupMessage": false };
    this.msgOut.conv = "";
    this.msgOut.author = "";
    this.msgOut.conv = this.storageH.getConv(this.item);
    console.log("Conv is" + this.msgOut.conv);
    this.msgOut.groupMessage = this.item.isGroup;
    this.msgOut.author = this.storageH.getID().toString();
    console.log("Message Out: conv=" + this.msgOut.conv + " message=" + this.msgOut.message + " author=" + this.msgOut.author + " groupMessage=" + this.msgOut.groupMessage.toString());
    if (this.msgOut) {
      //Api connections
      this.authService.postData(this.msgOut, "sendMessage").then((result) => {
        var respose: any = result;
        if (respose.total) {
          console.log("Message Nr." + respose.total + " \"" + this.msgOut.message + "\" send from " + this.msgOut.author);
          this.displayMessages();
          if (this.currentScrollPosition > 209) {
            console.log("scrolling to bottom");
            this.scrollTo(0, this.ContentHeight, 1);
          }
        }
        else {
          console.log("Not found!");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: "+err);
        });
    }
    else {
      this.presentToast("Messgage not send. Try again!");
    }
  }
  
  //check for new messages on reloading
  deltaMsg() {
    var userData = {"conv": "","oldId": "" };
    userData.conv = this.storageH.getConv(this.item);
    userData.oldId = this.displayedMessages.toString();
    if (userData) {
      //Checks weather the current amount of messages is the same as the amount on the server
      this.authService.postData(userData, "deltaMsg").then((result) => {
        var response: any = result;
        if (response) {
          if (response == 1) {
            this.notify();
            //this.contentHeight();
            console.log("NEW MESSAGE BY FRIEND");
            this.reload = true;
          } else {
            this.reload = false;
          }
        }
      }, (err) => {
          //Connection failed message
          this.presentToast("Connection failed. Error: " + err);
        });
      }
    else {
      this.presentToast("Messgage not send. Try again!");
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  notify() {
    this.localNotifications.schedule({
      title: 'Nuntius',
      text: 'Du hast neue Nachrichten!',
      led: '0000FF',
    });
   }
}
