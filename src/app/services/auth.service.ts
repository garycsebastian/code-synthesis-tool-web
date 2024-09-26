import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {finalize, Observable, of, tap, throwError} from 'rxjs';
import {Router} from '@angular/router'; // Import Router

import {User} from "../models/user";
import {LoginRequest} from "../models/login-request";

import {CookieService} from 'ngx-cookie-service';
import {catchError, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';  // Your API base URL

  constructor(private http: HttpClient, private cookieService: CookieService,
              private router: Router) {
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginRequest);
  }

  refreshToken(refreshToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `RefreshToken ${refreshToken}`
    });
    console.log("make the refresh token");
    return this.http.post(`${this.apiUrl}/refreshtoken`, {}, {headers});
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  logout(): Observable<any> {

    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      // Use 'of' to create an observable from the navigation result
      tap(() => {
        console.log("success logout");
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        // Si hay un error en el logout, redirigir de todos modos
        this.cookieService.delete('accessToken');
        this.cookieService.delete('refreshToken');
        this.router.navigate(['/login']); // Navega a la página de login
      })
    );
  }

  isLoggedIn(): boolean {
    const accessToken = this.cookieService.get('accessToken');
    return !!accessToken;
  }
}
