import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, tap, catchError, finalize, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        this.currentUserSubject.next(JSON.parse(storedUser));
        this.tokenSubject.next(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      this.logout();
    }
  }

  register(data: RegisterData): Observable<User> {
    this.loadingSubject.next(true);
    
    return this.http.post<{ user: User; token: string }>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      map(response => response.user),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.loadingSubject.next(true);

    return this.http.post<{ user: User; token: string }>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      // Adicionando um pequeno delay para simular latência de rede e dar tempo para a UI atualizar
      delay(300),
      tap(response => this.handleAuthSuccess(response)),
      map(response => response.user),
      catchError(error => this.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthSuccess(response: { user: User; token: string }): void {
    if (!response.user || !response.token) {
      throw new Error('Invalid response format');
    }

    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    this.currentUserSubject.next(response.user);
    this.tokenSubject.next(response.token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro. Por favor, tente novamente.';

    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciais inválidas';
      this.logout();
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Dados inválidos';
    } else if (error.status === 404) {
      errorMessage = 'Serviço não encontrado';
    } else if (error.status >= 500) {
      errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
    }

    return throwError(() => new Error(errorMessage));
  }

  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    const token = this.tokenSubject.value;
    
    if (!currentUser || !token) {
      return false;
    }

    // Aqui poderíamos adicionar validação do token JWT
    return true;
  }

  getAuthToken(): string | null {
    return this.tokenSubject.value;
  }

  refreshToken(): Observable<string | null> {
    // Implementação futura do refresh token
    return of(null);
  }
} 