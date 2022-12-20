import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  signIn(user: User): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/users/auth/signin`, user)
      .pipe(catchError(this.handleError));
  }

  signup(user: User): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/users/auth/signup`, user)
      .pipe(catchError(this.handleError));
  }

  checkEmail(email: any): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/users/checkEmail`);
  }

  verifyEmail(token: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/users/verifyEmail`, token);
  }

  signInWithSSOCode(code: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/users/auth/signInWithSSO`, code);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('picture', file);
    const req = new HttpRequest(
      'POST',
      `${this.apiURL}/users/upload`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  handleError(error: any) {
    let errorMessage = '';
    console.log(error);
    errorMessage = `${error?.error?.message}`;
    return throwError(() => {
      return errorMessage;
    });
  }
}
