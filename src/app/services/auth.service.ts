import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../models/user";
import {LoginRequest} from "../models/login-request";

import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth' ;  // Your API base URL

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginRequest);
  }
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/refreshtoken`, { refreshToken });
  }
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }
  logout(): Observable<any> {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
