import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-header" *ngIf="user$ | async as user">
        <div class="profile-cover"></div>
        <div class="profile-avatar">
          <div class="avatar-container">
            <img [src]="user.photoURL || 'assets/images/avatar-placeholder.png'" 
                 [alt]="user.name" 
                 class="avatar-image">
            <button mat-mini-fab color="primary" class="edit-avatar-button"
                    aria-label="Alterar foto de perfil">
              <mat-icon>edit</mat-icon>
            </button>
          </div>
        </div>
        <mat-card-content class="profile-info">
          <h1 class="profile-name">{{ user.name }}</h1>
          <p class="profile-email">{{ user.email }}</p>
          <p class="profile-role">{{ user.role === 'admin' ? 'Administrador' : 'Estudante' }}</p>
        </mat-card-content>
      </mat-card>

      <mat-tab-group class="profile-tabs" animationDuration="200ms">
        <mat-tab label="Informações Pessoais">
          <div class="tab-content">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
              <mat-form-field appearance="outline">
                <mat-label>Nome completo</mat-label>
                <input matInput formControlName="name" placeholder="Seu nome">
                <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                  Nome é obrigatório
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>E-mail</mat-label>
                <input matInput formControlName="email" placeholder="seu@email.com" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Telefone</mat-label>
                <input matInput formControlName="phone" placeholder="(00) 00000-0000">
              </mat-form-field>

              <div class="form-actions">
                <button mat-flat-button color="primary" type="submit"
                        [disabled]="profileForm.invalid || profileForm.pristine">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </mat-tab>

        <mat-tab label="Meus Cursos">
          <div class="tab-content">
            <mat-list class="courses-list">
              <div class="list-header">
                <h2>Cursos em andamento</h2>
                <a mat-button color="primary" routerLink="/courses">
                  Ver catálogo completo
                </a>
              </div>

              <mat-list-item *ngFor="let course of userCourses">
                <img matListItemAvatar [src]="course.imageUrl" [alt]="course.name">
                <div matListItemTitle>{{ course.name }}</div>
                <div matListItemLine class="course-progress">
                  <mat-progress-bar mode="determinate" [value]="course.progress">
                  </mat-progress-bar>
                  <span class="progress-text">{{ course.progress }}% concluído</span>
                </div>
                <button mat-button color="primary" [routerLink]="['/courses', course.id]">
                  Continuar
                </button>
              </mat-list-item>

              <mat-divider></mat-divider>

              <div class="list-header">
                <h2>Cursos concluídos</h2>
              </div>

              <mat-list-item *ngFor="let course of completedCourses">
                <img matListItemAvatar [src]="course.imageUrl" [alt]="course.name">
                <div matListItemTitle>{{ course.name }}</div>
                <div matListItemLine>
                  <span class="completion-date">
                    Concluído em {{ course.completionDate | date:'dd/MM/yyyy' }}
                  </span>
                </div>
                <button mat-button color="accent" [routerLink]="['/courses', course.id]">
                  Ver certificado
                </button>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <mat-tab label="Segurança">
          <div class="tab-content">
            <div class="security-section">
              <h2>Alterar senha</h2>
              <form [formGroup]="passwordForm" (ngSubmit)="onPasswordChange()" class="password-form">
                <mat-form-field appearance="outline">
                  <mat-label>Senha atual</mat-label>
                  <input matInput type="password" formControlName="currentPassword">
                  <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                    Senha atual é obrigatória
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Nova senha</mat-label>
                  <input matInput type="password" formControlName="newPassword">
                  <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                    Nova senha é obrigatória
                  </mat-error>
                  <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                    A senha deve ter no mínimo 6 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Confirmar nova senha</mat-label>
                  <input matInput type="password" formControlName="confirmPassword">
                  <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                    Confirmação de senha é obrigatória
                  </mat-error>
                  <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                    As senhas não coincidem
                  </mat-error>
                </mat-form-field>

                <div class="form-actions">
                  <button mat-flat-button color="primary" type="submit"
                          [disabled]="passwordForm.invalid || passwordForm.pristine">
                    Alterar senha
                  </button>
                </div>
              </form>
            </div>

            <mat-divider></mat-divider>

            <div class="security-section">
              <h2>Sessões ativas</h2>
              <mat-list>
                <mat-list-item *ngFor="let session of activeSessions">
                  <mat-icon matListItemIcon>{{ session.deviceType }}</mat-icon>
                  <div matListItemTitle>{{ session.deviceName }}</div>
                  <div matListItemLine>
                    Último acesso: {{ session.lastAccess | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                  <button mat-button color="warn" (click)="terminateSession(session.id)">
                    Encerrar sessão
                  </button>
                </mat-list-item>
              </mat-list>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .profile-header {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
    }

    .profile-cover {
      height: 200px;
      background: linear-gradient(135deg, #1976d2, #64b5f6);
    }

    .profile-avatar {
      position: relative;
      margin-top: -64px;
      padding: 0 24px;
    }

    .avatar-container {
      position: relative;
      display: inline-block;
    }

    .avatar-image {
      width: 128px;
      height: 128px;
      border-radius: 50%;
      border: 4px solid #fff;
      background-color: #e0e0e0;
      object-fit: cover;
    }

    .edit-avatar-button {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translate(25%, 25%);
    }

    .profile-info {
      padding: 16px 24px 24px;
    }

    .profile-name {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .profile-email {
      margin: 4px 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .profile-role {
      margin: 4px 0;
      color: #1976d2;
      font-weight: 500;
    }

    .profile-tabs {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .profile-form, .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .courses-list {
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        margin-bottom: 16px;

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }
      }
    }

    .course-progress {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;

      mat-progress-bar {
        flex: 1;
      }

      .progress-text {
        min-width: 80px;
        text-align: right;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .completion-date {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .security-section {
      margin-bottom: 32px;

      h2 {
        margin: 0 0 16px;
        font-size: 20px;
        font-weight: 500;
      }
    }

    @media (max-width: 599px) {
      :host {
        padding: 16px;
      }

      .profile-cover {
        height: 150px;
      }

      .avatar-image {
        width: 96px;
        height: 96px;
      }

      .profile-info {
        padding: 16px;
      }

      .profile-name {
        font-size: 20px;
      }

      .tab-content {
        padding: 16px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  user$ = this.authService.currentUser$;

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  // Mock data - substituir por dados reais da API
  userCourses = [
    {
      id: 1,
      name: 'Angular Avançado',
      imageUrl: 'assets/images/course1.jpg',
      progress: 65
    },
    {
      id: 2,
      name: 'TypeScript Profissional',
      imageUrl: 'assets/images/course2.jpg',
      progress: 30
    }
  ];

  completedCourses = [
    {
      id: 3,
      name: 'JavaScript Fundamentos',
      imageUrl: 'assets/images/course3.jpg',
      completionDate: new Date('2024-01-15')
    }
  ];

  activeSessions = [
    {
      id: 1,
      deviceType: 'computer',
      deviceName: 'Windows 10 - Chrome',
      lastAccess: new Date()
    },
    {
      id: 2,
      deviceType: 'phone_android',
      deviceName: 'Android - Chrome Mobile',
      lastAccess: new Date('2024-02-10')
    }
  ];

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Implementar atualização do perfil
      this.notification.success('Perfil atualizado com sucesso!');
    }
  }

  onPasswordChange() {
    if (this.passwordForm.valid) {
      // Implementar alteração de senha
      this.notification.success('Senha alterada com sucesso!');
      this.passwordForm.reset();
    }
  }

  terminateSession(sessionId: number) {
    // Implementar término de sessão
    this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
    this.notification.success('Sessão encerrada com sucesso!');
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
} 