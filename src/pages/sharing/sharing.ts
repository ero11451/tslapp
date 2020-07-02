import { BaseProvider } from './../../providers/base/base';
import { LocalStorageKey } from './../../app/config/app.constants';
import { Helpers } from './../../app/app.helpers';
import { SHARE_MODAL_PAGE } from './../pages.constants';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer"
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { API_URL } from '../../app/config/app.constants';


/**
 * Generated class for the SharingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sharing',
  templateUrl: 'sharing.html',
  providers: [Camera, FileTransfer]
})
export class SharingPage {
  @ViewChild('content') content: Content;
  showBorder: boolean = false;
  isSelected: boolean;
  video: string;
  baseUrl = API_URL;
  image: string;
  ireportForm: FormGroup;
  constructor(private api: BaseProvider, private fb: FormBuilder, private transfer: FileTransfer, private _helpers: Helpers, private camera: Camera, private modalCtrl: ModalController, private zone: NgZone, public navCtrl: NavController, public navParams: NavParams) {
    this.ireportForm = this.fb.group({
      'title': [null, [Validators.required, _helpers.noWhitespaceValidator]],
      'post': [null, [Validators.required, _helpers.noWhitespaceValidator]]
    })
  }


  getScroll(_evt) {
    this.zone.run(() => {
      if (!this.showBorder && this.content.scrollTop > 25) {
        this.showBorder = true;
      } else if (this.showBorder && this.content.scrollTop < 25) {
        this.showBorder = false;
      }
    })
  }

  confirmUpload() {
    const shareModal = this.modalCtrl.create(SHARE_MODAL_PAGE, null, { 'cssClass': 'action-modal' });
    shareModal.present()
    shareModal.onDidDismiss((confirm) => {
      if (confirm) {
        this.save()
      }
    })
  }

  playVideo() {
    this._helpers.playVideo(this.video);
  }



  takePhoto() {
    this.video = null;
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.isSelected = true;
      this.content.resize();
      this.image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.error(err);
      // Handle error
    });
  }

  getMediaFromFile(isVideo = false) {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: isVideo ? this.camera.MediaType.VIDEO : this.camera.MediaType.PICTURE,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.isSelected = true;
      this.content.resize();
      this.video = isVideo ? (imageData) : null;
      this.image = !isVideo ? 'data:image/jpeg;base64,' + imageData : null;
      console.log(this.video)
    }, (err) => {
      console.error(err);
      // Handle error
    });
  }

  checkFileAvilability() {
    return !!(this.image || this.video);
  }

  async save(isRetry: boolean = false) {
    const token = await this._helpers.get(LocalStorageKey.accessToken);
    if (!isRetry) {
      this._helpers.createLoader('Uploading Report, Please Wait..').present();
    }
    const fileTransfer: FileTransferObject = this.transfer.create();
    const file = this.image ? this.image : this.video;
    const fileName = this.image ? "image.jpg" : "video.mp4";
    const formData = this.ireportForm.value;
    let options: FileUploadOptions = {
      fileKey: 'ireport',
      fileName: fileName,
      mimeType: this.image ? 'image/jpeg' : 'video/mp4',
      params: {
        title: formData.title,
        body: formData.post,
        type: this.image ? 'image' : 'video',

      },
      httpMethod: "post",
      chunkedMode: false,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }

    fileTransfer.upload(file, `${API_URL}/ireport`, options)
      .then((data) => {
        this._helpers.loading.dismissAll();
        const modal = this._helpers.openSuccessAlert();
        this.ireportForm.reset();
        this.video = ""
        this.image = ""
        setTimeout(() => {
          modal.dismiss()
        }, 3000);


      }, async (err) => {
        console.error(err)
        if (err.http_status == 401) {
          const refreshToken = await this._helpers.get(LocalStorageKey.refreshToken);
          this.api.setActionUrl("/auth", '/token');
          const res = await this.api.post<any>({ refreshToken }).toPromise()
          this.storeTokensAndRefresh(res.data)
        } else {
          this._helpers.loading.dismiss()
            .then(() => {
              this._helpers.createAlert('Failed to post iReport. \n Please check your network and try again.').present();
            })
        }

      })
  }

  async storeTokensAndRefresh(data) {
    await this._helpers.save(LocalStorageKey.accessToken, data.token);
    this._helpers.save(LocalStorageKey.refreshToken, data.refreshToken);
    this.save(true);
  }
}
