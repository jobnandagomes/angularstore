import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { adminGuard } from './admin.guard';
import { User } from '../models/user.model';

describe('adminGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  const currentUserSubject = new BehaviorSubject<User | null>(null);

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: currentUserSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access for admin users', (done) => {
    const adminUser: User = {
      id: 1,
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin',
      enrolledCourses: []
    };

    currentUserSubject.next(adminUser);

    adminGuard({} as any, {} as any).subscribe(result => {
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should deny access for non-admin users', (done) => {
    const regularUser: User = {
      id: 2,
      name: 'User',
      email: 'user@test.com',
      role: 'student',
      enrolledCourses: []
    };

    currentUserSubject.next(regularUser);

    adminGuard({} as any, {} as any).subscribe(result => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('should deny access for unauthenticated users', (done) => {
    currentUserSubject.next(null);

    adminGuard({} as any, {} as any).subscribe(result => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });
}); 