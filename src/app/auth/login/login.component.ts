/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formSubmitted = false;
  private isEmail = /\S+@\S+\.\S+/;
  public loginForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    }
  );
  constructor(private route: Router, private authSrv: AuthService, private fb: FormBuilder) {
   }

  ngOnInit(): void {
  }

  formNotValid(camp: string): boolean {
    return this.loginForm.get(camp).invalid && this.formSubmitted;
  }
  login(){
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.authSrv.logIn(this.loginForm.value.email, this.loginForm.value.password);
    }
  }

}
