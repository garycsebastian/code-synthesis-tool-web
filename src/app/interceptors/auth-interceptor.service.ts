import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import {catchError, filter, take, switchMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service'; // Your AuthService
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private cookieService: CookieService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("intercept enter");
    const accessToken = this.cookieService.get('accessToken'); // Get access token from cookie
    if (accessToken && !this.isRefreshing) {
      console.log("access token is not null");
      request = this.addToken(request, accessToken);
    }
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshToken = this.cookieService.get('refreshToken'); // Get refresh token
      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.accessToken); // Update subject with new access token
            this.cookieService.set('accessToken', token.accessToken, { }); // Update cookie
            return next.handle(this.addToken(request, token.accessToken)); // Retry original request
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.authService.logout(); // Logout if refresh fails
            return throwError(err);
          })
        );
      } else {
        this.isRefreshing = false;
        this.authService.logout(); // Logout if no refresh token
        return throwError('Refresh token is missing');
      }
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
