import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      // route wi id parameter
      { path: 'verify/:id', component: VerifyComponent },
    ],
  },
];
@NgModule({
  declarations: [SigninComponent, SignupComponent, VerifyComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [SigninComponent],
})
export class UserModule {}
