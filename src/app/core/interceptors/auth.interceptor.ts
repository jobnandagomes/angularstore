import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.getItem('token');

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.localStorageService.getItem('refreshToken');

    if (!refreshToken) {
      this.handleLogout();
      return throwError(() => new Error('Session expired'));
    }

    return this.authService.refreshToken().pipe(
      switchMap(tokens => {
        this.localStorageService.setItem('token', tokens.token);
        this.localStorageService.setItem('refreshToken', tokens.refreshToken);
        return next.handle(this.addToken(request, tokens.token));
      }),
      catchError(error => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  private handleLogout() {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.router.navigate(['/auth/login']);
  }
}