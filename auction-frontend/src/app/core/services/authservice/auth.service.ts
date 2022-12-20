import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn() {
    const token = localStorage.getItem('token'); // get token from local storage

    if (token && token !== 'undefined') {
      const parsedPayload = jwt_decode(token) as any;

      return parsedPayload.exp > Date.now() / 1000; // check if token is expired
    } else {
      localStorage.removeItem('token');
      return false;
    }
  }

  getLogInUser() {
    const token = localStorage.getItem('token'); // get token from local storage
    if (token) {
      // const payload = atob(token.split('.')[1]); // decode payload of token
      // const parsedPayload = JSON.parse(payload); // convert payload into an Object

      // if (parsedPayload.exp > Date.now() / 1000)
      //   // check if token is expired
      //   return parsedPayload;
      let parsedPayload = jwt_decode(token) as any;
      if (parsedPayload.exp > Date.now() / 1000)
        // check if token is expired
        parsedPayload._id = parsedPayload.sub;
        parsedPayload.imgUrl = parsedPayload.picture;
        return parsedPayload;
    }
    return null;
  }
}
