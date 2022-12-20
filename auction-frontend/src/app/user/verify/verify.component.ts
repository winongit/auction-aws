import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  verifyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.verifyForm = this.fb.group({
      username: [this.route.snapshot.paramMap.get('id'), [Validators.required]],
      code: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.verifyForm.valid) return;
    const verifyData = {
      username: this.verifyForm.value.username,
      code: this.verifyForm.value.code,
    };

    this.userService.verifyEmail(verifyData).subscribe(
      (res) => {
        console.log(res);
        this._snackBar.open('Email verified', 'Close', {
          duration: 2000,
        });
        this.router.navigate(['/user/signin']);
      },
      (err) => {
        console.log(err);
        this._snackBar.open('Error verifying email', 'Close', {
          duration: 2000,
        });
      }
    );
  }
}
