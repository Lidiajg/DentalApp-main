/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { IonicService } from 'src/app/services/ionic.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  types: any = ['Admin', 'Paciente', 'Dentista'];
  private isEmail = /\S+@\S+\.\S+/;
  formSubmitted = false;
  isImageSaved = false;
  // eslint-disable-next-line max-len
  cardImageBase64 =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwQEBAQFBQUFBQcHBgYHBwsICQgJCAsRCwwLCwwLEQ8SDw4PEg8bFRMTFRsfGhkaHyYiIiYwLTA+PlQBAwMDAwMDBAQEBAUFBQUFBwcGBgcHCwgJCAkICxELDAsLDAsRDxIPDg8SDxsVExMVGx8aGRofJiIiJjAtMD4+VP/CABEIAGAAYAMBIgACEQEDEQH/xAAbAAEBAQADAQEAAAAAAAAAAAAACAcEBQYJA//aAAgBAQAAAAD6QAADwOO8XevYAYbJIuDSARTloq7egSXhYp6igRLmI1a0gTDOopSlAfj87eveqv4BFOWtcswHV4jLIpzdO4eHwfE+GDlbRvkIgA//xAAXAQEBAQEAAAAAAAAAAAAAAAAAAwIB/9oACAECEAAAAKtMm6o5bqlh26HHboctoZ//xAAXAQADAQAAAAAAAAAAAAAAAAAAAQMC/9oACAEDEAAAAMCGGYl2ZiW0KDsxRLOWAN//xAA2EAABAwIDBQQIBgMAAAAAAAABAgMEBREGByEAEiAxURATQYEIFCIjMGFxkSQmMkBCgmJyof/aAAgBAQABPwD9hiTMvCWGVrakzO/kp0MaOnvFg9DyCdqj6QNQUtQptHYQnwVIWpwnyTu22gekBXEOj16lQnW/EMlbSvuor2wljihYyiKdgu7rqdHYztg4g/S+o+Y+BnJjuTh+KzR6c6pqXMbK3XUmym2b29noVEc9iSo3PPtBKSCDYjkRtlXiGRiPB8Z6SvvJEVa4zqzqVluxST87KF+POZxxeYFRC+TbUdKPp3aTw5AH8t1QdKhf7tp48+aYiPiWFOQpP4uFZQ8d5o2v9lcPo+SUKgVuNdO8l9le742UCL/8484XZa8f1Jt51SktJZSyDyQgtpVYeZ4cl5MhjHsNtsqCH2JCHR1SEFYv5p487MGVV+rorsGI4/HVEAlFA3y2Wr+0oD+NuAAqNhz2yYwJWabVnK1VIbkVAjFEdDuiypwi6t3mLAcciO1KjvMOp3m3UKQtPVKxY7VenuUmqToDmq4kl1lR6ltRTftwJDM/GNCZ3N4GoMqUn/FtQUr4Ob1Tw/UsVvKpbLiXmVFma5oEPONm28mx8ie3KLEeHMPVtZqTDpky1NMR5ACShgKNlFVyLX6jjqtbpFDj+s1KYxFa8FOrAv8AIDmT9NsV550hMCTGoLT7slbZS3JWju0IvpvAE3JHhe2xJUVEquTqSeDB+eFMap0SHXmpIfZbCDKQkOJWBoFKF7362vtR6/RsQR+/pk1iU347itR/snmnz7cQ5iYSwyVtzJ6VSE847PvXL9CBon+xG2JM9azO32aLGRBaOgeXZx4/Qck7T6jUKpIVJnSXZDyubjqys/c8cKfNp0hEmJJdjPJ/S40soUPMbYbzzr9O3GawwiosjTvRZt0Dy0VthzMbCWKChqJOS1IVyjP+7cv0F9Ff1J2JKjc6k8z8MEpNxoRyO3//xAAdEQEAAwACAwEAAAAAAAAAAAABAAIQICESMTJB/9oACAECAQE/AMK2fyNbB64UBdt1Z2n1t/rRTGKugsOiMRMKV4+BP//EABsRAQACAwEBAAAAAAAAAAAAAAEAEAISISAx/9oACAEDAQE/AK2IZD4zULx+Xn8vB5aDR1gBexHrDjDIa3fO7P/Z';
  public registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, [Validators.requiredTrue]],
    },
    {
      validators: this.samePassword('password', 'confirmPassword'),
    }
  );

  constructor(
    private authSrv: AuthService,
    private fb: FormBuilder,
    private ionicSrv: IonicService,
    public loadingController: LoadingController,
    private router: Router
  ) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Create account...',
    });
    loading.present();
    this.authSrv.userRegister.subscribe({
      next: async (resp: boolean) => {
        if (resp) {
          this.registerForm.reset();
          this.router.navigateByUrl('/home');
        }
        loading.dismiss();
      },
    });
  }

  ngOnInit(): void {
    // eslint-disable-next-line max-len
    (<HTMLImageElement>document.getElementById('imageDefault')).src =
      this.cardImageBase64;
  }

  changeCity(e: any) {
    this.registerForm.get('type')?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get selectType() {
    return this.registerForm.get('type');
  }

  createUser() {
    this.formSubmitted = true;
    if (this.registerForm.valid && this.isImageSaved) {
      this.presentLoading();
      this.authSrv.signIn({
        name: this.registerForm.value.name,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        type: this.registerForm.value.type,
        image: this.cardImageBase64,
      });
    }
  }

  isSelectedType(): boolean {
    return this.selectType.value === '';
  }

  btnRegister() {
    let flag;
    if (this.isSelectedType() || this.registerForm.invalid) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }

  formNotValid(camp: string): boolean {
    return this.registerForm.get(camp).invalid && this.formSubmitted;
  }
  aceptTerms() {
    return !this.registerForm.get('terms').value && this.formSubmitted;
  }

  passwordsNotValid() {
    const pass = this.registerForm.get('password').value;
    const confirmPass = this.registerForm.get('confirmPassword').value;
    return pass !== confirmPass && this.formSubmitted;
  }

  samePassword(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notSame: true });
      }
    };
  }

  addPhotoToGallery() {
    this.ionicSrv.takePicture().then((image: any) => {
      this.cardImageBase64 = image;
      this.isImageSaved = true;
      (<HTMLImageElement>document.getElementById('imageDefault')).src =
        this.cardImageBase64;
    });
  }
}
