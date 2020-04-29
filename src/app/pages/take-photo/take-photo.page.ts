import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Post } from 'src/app/models/post.models';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.page.html',
  styleUrls: ['./take-photo.page.scss'],
})
export class TakePhotoPage implements AfterViewInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngAfterViewInit() {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const video = <any>document.getElementById('video');

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: {aspectRatio: 1} })
      .then (function (stream) {
        video.srcObject = stream;
      })
      .catch (function (err) {
        console.log("Could not catch video =(");
      });
    }
  }

  takePicture() {
    const video = <any>document.getElementById('video');
    const canvas = <any>document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, 1000, 1000);
    localStorage.setItem('tavgram.post', JSON.stringify(new Post(canvas.toDataURL(), '', '')));

    video.classList.add("animated");
    video.classList.add("flash");

    setTimeout(() => {
      this.navCtrl.navigateForward('/post');
    }, 1000);
  }

}
