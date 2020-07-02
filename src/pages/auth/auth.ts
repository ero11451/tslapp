import { LocalStorageKey } from './../../app/config/app.constants';
import { Helpers } from './../../app/app.helpers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { TABS_PAGE } from './../pages.constants';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';

/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
  providers: [GooglePlus, AuthProvider]
})
export class AuthPage {
  section: string;
  user: any;
  signupForm: FormGroup;
  googleUser: any;
  @ViewChild('phoneField') phoneField: TextInput;
  constructor(private storage: Storage, private _helpers: Helpers, private fb: FormBuilder, private _auth: AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.section = 'login';
    this.initializeForm();
  }

  switchSection(section) {
    this.section = section;
  }

  initializeForm() {
    this.signupForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required,Validators.email]],
      phoneNumber: [null, [Validators.required, Validators.minLength(11)]]
    });
  }

  goToTabs() {
    this.navCtrl.setRoot(TABS_PAGE, null, { animate: true, animation: 'push', direction: 'forward' })
  }

  async loginWithGoogle() {
    try {
      this._helpers.createLoader().present();
      this.googleUser = await this._auth.getUserDetails()
      const user = await this._auth.login(this.googleUser.email).toPromise();
      this._helpers.dismissLoader();
      this.authSuccess(user.data)
    } catch (error) {
      this._auth.logout();
      this._helpers.dismissLoader();
      if (error.status && error.status === 404) {
        this.switchSection('signup');
        this._helpers.createNativeToast('Please complete the form to continue.')
        this.signupForm.setValue({
          firstName: this.googleUser.givenName,
          lastName: this.googleUser.familyName,
          email: this.googleUser.email,
          phoneNumber: ''
        });
        setTimeout(() => {
          this.phoneField.setFocus();
        }, 500);
      } else {
        this._helpers.createNativeToast('Login request failed.');
      }
    }
  }

  signup() {
    this._helpers.createLoader().present();

    const formData = this.signupForm.value;
    const reqData = {
      displayName: `${formData.firstName} ${formData.lastName}`,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      imageUrl: this.googleUser.imageUrl
    }
    this._auth.signup(reqData).subscribe((res) => {
      this._helpers.createSuccessToast('You have successfully signed up!!').present()
      this._helpers.dismissLoader();
      this.authSuccess(res.data)
    }, error => {
      this._helpers.dismissLoader()
      this._helpers.createNativeToast('Signup request failed.');
    })
  }


  authSuccess(data) {
    const JWT = new JwtHelperService();
    let payload = JWT.decodeToken(data.token);
    this.storage.set(LocalStorageKey.user, payload.user);
    this.storage.set(LocalStorageKey.accessToken, data.token);
    this.storage.set(LocalStorageKey.refreshToken, data.refreshToken);
    this.navCtrl.setRoot(TABS_PAGE);
  }
}
