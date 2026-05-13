import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'about-me',
    loadChildren: () => import('./features/about-me/about-me.routes')
  },
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  }
];
