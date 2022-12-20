import { User } from './../models/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [UserService],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  selectedFile?: File;
  user!: User;
  preview: string = '';
  imageSelect: boolean = false;
  titleAlert: string = 'This field is required';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.checkPassword]],
      confirmPassword: [
        '',
        [Validators.required, this.checkConfirmPassword.bind(this)],
      ],
    });
  }

  checkInUseEmail(control: any): any {
    try {
      let exist = this.userService
        .checkEmail(control.value)
        .subscribe((res) => res);
      let result = exist ? { alreadyInUse: true } : null;
      return { alreadyInUse: true };
    } catch (err) {}
  }

  checkPassword(control: any) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }

  checkConfirmPassword(control: any) {
    const password = this.signUpForm?.controls['password'].value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  getErrorEmail() {
    return this.signUpForm?.get('email')?.hasError('required')
      ? this.titleAlert
      : this.signUpForm?.get('email')?.hasError('email')
      ? 'Not a valid email address'
      : this.signUpForm?.get('email')?.hasError('alreadyInUse')
      ? 'This emailaddress is already in use'
      : '';
  }

  getErrorPassword() {
    return this.signUpForm?.get('password')?.hasError('required')
      ? this.titleAlert
      : this.signUpForm?.get('password')?.hasError('requirements')
      ? 'Password needs to be at least eight characters, one uppercase letter and one number'
      : '';
  }

  getErrorConfirmPassword() {
    return this.signUpForm?.get('confirmPassword')?.hasError('required')
      ? this.titleAlert
      : this.signUpForm?.get('confirmPassword')?.hasError('passwordNotMatch')
      ? 'Password Not Match'
      : '';
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.preview = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile as Blob);
    this.imageSelect = true;
  }

  onSubmit(user: User) {
    if (!this.signUpForm.valid) return;
    try {
      this.user = { ...this.signUpForm.value };
      this.upload(this.selectedFile);
    } catch (err) {}
  }

  upload(file: File | undefined): void {
    if (file) {
      this.userService.upload(file).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status == HttpStatusCode.Ok) {
            this.user.imgUrl = event.body.filename as string;
            this.userService.signup(this.user).subscribe(
              (res) => {
                // Navigate to verify page with user name

                this.router.navigate(['user/verify', this.user.name]);
              },
              (err) => {
                console.log(err);
                this._snackBar.open(err, '', {
                  duration: 1000,
                });
              }
            );
          }
        }
      });
    }
  }
}
