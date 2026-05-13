import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private tokenExpirationTimer: any;

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly token$ = this.tokenSubject.asObservable();
  readonly isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    
    if (storedUser && storedToken && storedRefreshToken && tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);
      if (expirationDate > new Date()) {
        this.currentUserSubject.next(JSON.parse(storedUser));
        this.tokenSubject.next(storedToken);
        this.refreshTokenSubject.next(storedRefreshToken);
        this.setupAutoRefresh(expirationDate);
      } else {
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    if (!this.validateCredentials(credentials)) {
      return throwError(() => new Error('Credenciais inválidas'));
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      map(response => response.user),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error);
        this.notificationService.show({ message: errorMessage, type: 'error' });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    const refreshToken = this.refreshTokenSubject.getValue();
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).pipe(
        catchError(() => of(null))
      ).subscribe();
    }

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    this.router.navigate(['/auth/login']);
    this.notificationService.show({ message: 'Você foi desconectado com sucesso', type: 'info' });
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.currentUserSubject.next(response.user);
    this.tokenSubject.next(response.token);
    this.refreshTokenSubject.next(response.refreshToken);
    
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 horas
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    
    this.setupAutoRefresh(expirationDate);
  }

  private setupAutoRefresh(expirationDate: Date): void {
    const expirationTime = expirationDate.getTime() - new Date().getTime();
    const refreshTime = expirationTime - (60 * 1000); // 1 minuto antes de expirar
    
    this.tokenExpirationTimer = setTimeout(() => {
      const refreshToken = this.refreshTokenSubject.getValue();
      if (refreshToken) {
        this.refreshToken(refreshToken).subscribe();
      }
    }, refreshTime);
  }

  private validateCredentials(credentials: LoginCredentials): boolean {
    if (!credentials.email || !credentials.password) {
      this.notificationService.show({ message: 'Email e senha são obrigatórios', type: 'error' });
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(credentials.email)) {
      this.notificationService.show({ message: 'Email inválido', type: 'error' });
      return false;
    }

    if (credentials.password.length < 8) {
      this.notificationService.show({ message: 'A senha deve ter pelo menos 8 caracteres', type: 'error' });
      return false;
    }

    return true;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Email ou senha inválidos';
    }
    if (error.status === 403) {
      return 'Acesso negado';
    }
    if (error.status === 404) {
      return 'Usuário não encontrado';
    }
    return error.error?.message || 'Ocorreu um erro inesperado';
  }
}