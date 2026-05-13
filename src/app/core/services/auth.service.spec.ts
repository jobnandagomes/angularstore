import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginCredentials } from './auth.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'student',
    enrolledCourses: []
  };

  const mockCredentials: LoginCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token', () => {
      const mockResponse = {
        user: mockUser,
        token: 'mock-token'
      };

      service.login(mockCredentials).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('should handle login error', () => {
      service.login(mockCredentials).subscribe({
        error: (error) => {
          expect(error.message).toBe('Falha ao fazer login');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('logout', () => {
    it('should clear stored auth data', () => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      service['currentUserSubject'].next(mockUser);
      service['tokenSubject'].next('mock-token');

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getAuthToken', () => {
    it('should return stored token', () => {
      service['tokenSubject'].next('mock-token');
      expect(service.getAuthToken()).toBe('mock-token');
    });

    it('should return null when no token exists', () => {
      expect(service.getAuthToken()).toBeNull();
    });
  });
}); 