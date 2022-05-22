/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class IonicService {


  constructor() { }

  async takePicture() {
    const capturedPhoto = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      webUseInput: true,
    });//capturo la Foto
    return capturedPhoto.dataUrl;//obtengo el dataUrl
  }

}
