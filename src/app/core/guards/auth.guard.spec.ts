import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import 'jasmine-core';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = { url: '/protected-route' } as RouterStateSnapshot;
  });

  it('should allow access for authenticated users', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when accessing protected route and store return URL', () => {
    authService.isAuthenticated.and.returnValue(false);
    const expectedNavigationParams = {
      queryParams: { returnUrl: '/protected-route' }
    };

    const result = authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], expectedNavigationParams);
  });

  it('should redirect to courses page when accessing login page while authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    mockRouterStateSnapshot = { url: '/auth/login' } as RouterStateSnapshot;

    const result = authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/courses']);
  });

  it('should logout successfully', () => {
    authService.isAuthenticated.and.returnValue(false);
    authService.logout.and.returnValue(undefined);

    const result = authGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], jasmine.any(Object));
  });
}); 