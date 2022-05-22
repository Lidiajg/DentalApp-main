/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { IonicService } from 'src/app/services/ionic.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any;
  types: any = ['Admin', 'Patient', 'Medic'];
  isChanges = false;
  public registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    type: ['', [Validators.required]],
    image: [''],
  });
  image: any;
  cardImageBase64: any;
  isImageSaved: boolean;
  constructor(
    private fb: FormBuilder,
    private ionicSrv: IonicService,
    private fireSrv: FirebaseService,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user = user;
      this.registerForm.get('name').setValue(this.user.name);
      this.registerForm.get('lastName').setValue(this.user.lastname);
      this.registerForm.get('type').setValue(this.user.type);
    }
  }

  async updateDataUserLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    loading.present();
    this.fireSrv.updateData.subscribe({
      next: (res: boolean) => {
        res ? loading.dismiss() : '';
      },
    });
  }
  async updateImageUserLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
    });
    loading.present();
    this.fireSrv.updateImage.subscribe({
      next: (res: boolean) => {
        this.isImageSaved = false;
        res ? loading.dismiss() : '';
      },
    });
  }

  changeCity(e: any) {
    this.registerForm.get('type')?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  updateUser() {
    let message = 'Actualizando Imagen...';
    if (
      this.registerForm.valid &&
      this.registerForm.touched &&
      this.validateChanges() &&
      this.isImageSaved
    ) {
      message = 'Actualizando Usuario...';
    }
    if (
      this.registerForm.valid &&
      this.registerForm.touched &&
      this.validateChanges()
    ) {
      this.isChanges = false;
      this.fireSrv.updateUser({
        uid: this.user.uid,
        name: this.registerForm.get('name').value,
        lastname: this.registerForm.get('lastName').value,
        type: this.registerForm.get('type').value,
      });
      this.updateDataUserLoading('Actualizando User...');
    }
    if (this.isImageSaved) {
      this.fireSrv.updateUserImage(this.user.uid, this.cardImageBase64);
      this.updateImageUserLoading(message);
    }
  }
  addPhotoToGallery() {
    this.ionicSrv.takePicture().then((image: any) => {
      this.cardImageBase64 = image;
      this.isImageSaved = true;
      this.isChanges = false;
      (<HTMLImageElement>document.getElementById('userImage')).src =
        this.cardImageBase64;
    });
  }
  validateChanges(): boolean {
    if (
      (this.registerForm.get('name').value as string).toLowerCase() !==
        (this.user.name as string).toLowerCase() ||
      (this.registerForm.get('lastName').value as string).toLowerCase() !==
        (this.user.lastname as string).toLowerCase() ||
      (this.registerForm.get('type').value as string).toLowerCase() !==
        (this.user.type as string).toLowerCase()
    ) {
      return true;
    }
    return false;
  }
}
