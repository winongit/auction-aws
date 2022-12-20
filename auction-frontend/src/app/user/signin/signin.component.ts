import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [UserService],
})
export class SigninComponent implements OnInit {
  signInForm!: FormGroup;
  titleAlert: string = 'This field is required';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('SigninComponent.ngOnInit()');

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      console.log(params['code']);
      if (params['code']) {
        const ssoCode = { code: params['code'] };
        this.userService.signInWithSSOCode(ssoCode).subscribe(
          (res) => {
            console.log('SSO Sign In Success', res);
            console.log(res);
            localStorage.setItem('token', res.token);
            this.router.navigate(['/auction']);
          },
          (err) => {
            console.log(err);
            this._snackBar.open('Sing In Failed', err.error.message.error, {
              duration: 1000,
            });
          }
        );
      }
    });

    this.createForm();
  }

  createForm() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  checkPassword(control: any) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }

  getErrorEmail() {
    return this.signInForm?.get('email')?.hasError('required')
      ? this.titleAlert
      : '';
  }

  getErrorPassword() {
    return this.signInForm?.get('password')?.hasError('required')
      ? this.titleAlert
      : '';
  }

  onSubmit(user: User) {
    if (!this.signInForm.valid) return;
    this.userService.signIn(user).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/auction']);
      },
      (err) => {
        console.log(err);
        this._snackBar.open('Invalid Credentials!', '', {
          duration: 1000,
        });
      }
    );
  }
}
