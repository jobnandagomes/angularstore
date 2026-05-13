import { Component, ViewChild, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { Store } from '@ngrx/store';
import { Observable, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as CartSelectors from './features/cart/cart.selectors';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/user.model';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UIService } from './core/services/ui.service';
import { LoadingComponent } from './core/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SharedModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    LoadingComponent
  ],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav #sidenav mode="side" opened class="app-sidenav">
        <div class="sidenav-header">
          <div class="logo-container" (click)="router.navigate(['/'])" (keyup.enter)="sidenav.close()" tabindex="0" role="button"
               aria-label="Ir para página inicial">
            <svg class="logo-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
              <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.4c-3.5 0-6.4-2.9-6.4-6.4S8.5 5.6 12 5.6s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z"/>
              <path d="M12 7.2c-2.6 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8-2.2-4.8-4.8-4.8zm0 8c-1.8 0-3.2-1.4-3.2-3.2s1.4-3.2 3.2-3.2 3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2z"/>
              <path d="M12 9.6c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
              <path d="M15.6 12c0 2-1.6 3.6-3.6 3.6S8.4 14 8.4 12 10 8.4 12 8.4s3.6 1.6 3.6 3.6z"/>
              <path d="M14.4 12c0 1.3-1.1 2.4-2.4 2.4S9.6 13.3 9.6 12s1.1-2.4 2.4-2.4 2.4 1.1 2.4 2.4z"/>
              <rect x="11.2" y="2" width="1.6" height="4"/>
              <rect x="11.2" y="18" width="1.6" height="4"/>
              <rect x="18" y="11.2" width="4" height="1.6"/>
              <rect x="2" y="11.2" width="4" height="1.6"/>
            </svg>
            <span class="logo-text">Tech Store</span>
          </div>
          <button mat-icon-button (click)="uiService.toggleTheme()" matTooltip="Alternar tema claro/escuro"
                  aria-label="Alternar entre tema claro e escuro">
            <mat-icon>{{ uiService.isDarkTheme() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <div class="nav-item">
            <a mat-list-item routerLink="/courses" (click)="sidenav.close()" routerLinkActive="active-link">
              <mat-icon>school</mat-icon>
              <span class="nav-label">Catálogo de Cursos</span>
            </a>
          </div>

          <ng-container *ngIf="currentUser$ | async as user">
            <div class="nav-item">
              <a mat-list-item routerLink="/student/my-courses" (click)="sidenav.close()" routerLinkActive="active-link">
                <mat-icon>local_library</mat-icon>
                <span class="nav-label">Meus Cursos</span>
              </a>
            </div>

            <div class="nav-item" *ngIf="user.role === 'admin'">
              <a mat-list-item routerLink="/admin/dashboard" (click)="sidenav.close()" routerLinkActive="active-link">
                <mat-icon>admin_panel_settings</mat-icon>
                <span class="nav-label">Administração</span>
              </a>
            </div>
          </ng-container>

          <div class="nav-item">
            <a mat-list-item routerLink="/cart" (click)="sidenav.close()" routerLinkActive="active-link">
              <mat-icon>shopping_cart</mat-icon>
              <span class="nav-label">Meu Carrinho</span>
            </a>
          </div>

          <mat-divider></mat-divider>

          <ng-container *ngIf="currentUser$ | async as user; else authButtons">
            <div class="nav-item">
              <a mat-list-item (click)="logout(); sidenav.close()">
                <mat-icon>exit_to_app</mat-icon>
                <span class="nav-label">Sair</span>
              </a>
            </div>
          </ng-container>

          <ng-template #authButtons>
            <div class="nav-item">
              <a mat-list-item routerLink="/auth/login" (click)="sidenav.close()">
                <mat-icon>login</mat-icon>
                <span class="nav-label">Entrar</span>
              </a>
            </div>
            <div class="nav-item">
              <a mat-list-item routerLink="/auth/register" (click)="sidenav.close()">
                <mat-icon>person_add</mat-icon>
                <span class="nav-label">Criar Conta</span>
              </a>
            </div>
          </ng-template>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" role="banner">
          <button mat-icon-button (click)="sidenav.toggle()" 
                  aria-label="Abrir menu" matTooltip="Menu">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="toolbar-title">Tech Store</span>

          <span class="spacer"></span>

          <button mat-icon-button routerLink="/cart" 
                  [matBadge]="cartItemsCount$ | async" 
                  matBadgeColor="accent" 
                  [matBadgeHidden]="!(cartItemsCount$ | async)"
                  [matBadgeSize]="'small'"
                  matTooltip="Carrinho de compras"
                  aria-label="Ver carrinho de compras">
            <mat-icon>shopping_cart</mat-icon>
          </button>

          <ng-container *ngIf="currentUser$ | async as user">
            <button mat-icon-button [matMenuTriggerFor]="userMenu" 
                    data-cy="user-menu"
                    [matTooltip]="'Menu do usuário - ' + user.name"
                    aria-label="Abrir menu do usuário">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Meu Perfil</span>
              </a>
              <a mat-menu-item routerLink="/student/my-courses">
                <mat-icon>school</mat-icon>
                <span>Meus Cursos</span>
              </a>
              <a mat-menu-item routerLink="/admin/dashboard" *ngIf="user.role === 'admin'">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Administração</span>
              </a>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Sair</span>
              </button>
            </mat-menu>
          </ng-container>
        </mat-toolbar>

        <div class="content" role="main">
          <router-outlet></router-outlet>
        </div>

        <button mat-fab color="primary" class="scroll-to-top" 
                *ngIf="uiService.showScrollTop()"
                (click)="scrollToTop()"
                matTooltip="Voltar ao topo"
                aria-label="Voltar ao topo da página">
          <mat-icon>arrow_upward</mat-icon>
        </button>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    mat-sidenav-container {
      height: 100%;
      overflow: hidden;
      transition: background-color 0.3s ease;

      &.dark-theme {
        background-color: #303030;
        color: #ffffff;

        .sidenav-header {
          background: rgba(255, 255, 255, 0.05);
        }

        .logo-text {
          color: #64b5f6;
        }

        .logo-icon {
          fill: #64b5f6;
        }

        mat-nav-list .nav-item a {
          color: rgba(255, 255, 255, 0.87);

          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }

    mat-sidenav {
      width: 280px;
      border-right: none;
      transition: width 0.3s ease;

      &.wide {
        width: 320px;
      }
    }

    .sidenav-header {
      padding: 16px;
      background: rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      cursor: pointer;
      user-select: none;
      transition: opacity 0.2s;
      outline: none;

      &:hover, &:focus-visible {
        opacity: 0.8;
      }

      &:focus-visible {
        outline: 2px solid #1976d2;
        outline-offset: 2px;
        border-radius: 4px;
      }
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      fill: #1976d2;
      transition: transform 0.3s ease;

      @media (prefers-reduced-motion: no-preference) {
        &:hover {
          transform: rotate(180deg);
        }
      }
    }

    .logo-text {
      font-size: 24px;
      font-weight: 500;
      color: #1976d2;
      letter-spacing: -0.5px;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 0 16px;
      transition: background-color 0.3s ease;
    }

    .toolbar-title {
      margin-left: 16px;
      font-size: 20px;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px;
      min-height: calc(100vh - 64px);
      position: relative;
    }

    mat-nav-list {
      padding: 8px;

      .nav-item {
        margin: 4px 0;

        a {
          height: 48px;
          border-radius: 8px;
          color: rgba(0, 0, 0, 0.87);
          transition: all 0.2s ease;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          outline: none;

          &:hover, &:focus-visible {
            background: rgba(0, 0, 0, 0.04);
          }

          &:focus-visible {
            outline: 2px solid #1976d2;
            outline-offset: -2px;
          }

          &.active-link {
            background: rgba(25, 118, 210, 0.12);
            color: #1976d2;

            mat-icon {
              color: #1976d2;
            }
          }

          mat-icon {
            margin-right: 16px;
            color: rgba(0, 0, 0, 0.54);
            transition: color 0.2s ease;
          }
        }
      }
    }

    .scroll-to-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      opacity: 0;
      transform: translateY(100px);
      transition: all 0.3s ease;

      &.visible {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 599px) {
      mat-toolbar {
        padding: 0 8px;
      }

      .toolbar-title {
        font-size: 18px;
        margin-left: 8px;
      }

      .content {
        padding: 8px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  cartItemsCount$: Observable<number>;
  currentUser$: Observable<User | null>;
  private destroy$ = new Subject<void>();
  
  private readonly platformId = inject(PLATFORM_ID);
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  constructor(protected readonly uiService: UIService) {
    this.cartItemsCount$ = this.store.select(CartSelectors.selectCartItemsCount);
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Handle scroll events
      fromEvent(window, 'scroll')
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.uiService.updateScrollPosition(window.scrollY);
        });

      // Handle navigation events for loading bar
      this.router.events
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(event => {
          if (event.constructor.name === 'NavigationStart') {
            this.uiService.setLoading(true);
          } else if (
            event.constructor.name === 'NavigationEnd' ||
            event.constructor.name === 'NavigationError' ||
            event.constructor.name === 'NavigationCancel'
          ) {
            this.uiService.setLoading(false);
          }
        });

      // Handle window resize
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.uiService.updateScreenSize(window.innerWidth >= 960);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
