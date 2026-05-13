import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Criar Conta</mat-card-title>
        </mat-card-header>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Nome</mat-label>
              <input 
                matInput 
                formControlName="name"
                data-cy="name-input"
                [attr.aria-label]="'Nome completo'"
              >
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')" data-cy="name-error">
                Nome é obrigatório
              </mat-error>
              <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')" data-cy="name-error">
                Nome deve ter pelo menos 3 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input 
                matInput 
                type="email" 
                formControlName="email"
                data-cy="email-input"
                [attr.aria-label]="'Endereço de email'"
              >
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')" data-cy="email-error">
                Email é obrigatório
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')" data-cy="email-error">
                Email inválido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Senha</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                data-cy="password-input"
                [attr.aria-label]="'Senha'"
              >
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hidePassword = !hidePassword" 
                [attr.aria-label]="'Mostrar senha'"
                [attr.aria-pressed]="!hidePassword"
              >
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')" data-cy="password-error">
                Senha é obrigatória
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')" data-cy="password-error">
                Senha deve ter pelo menos 6 caracteres
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')" data-cy="password-error">
                Senha deve conter letras e números
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirmar Senha</mat-label>
              <input 
                matInput 
                [type]="hideConfirmPassword ? 'password' : 'text'"
                formControlName="confirmPassword"
                data-cy="confirm-password-input"
                [attr.aria-label]="'Confirmar senha'"
              >
              <button 
                mat-icon-button 
                matSuffix 
                type="button"
                (click)="hideConfirmPassword = !hideConfirmPassword" 
                [attr.aria-label]="'Mostrar confirmação de senha'"
                [attr.aria-pressed]="!hideConfirmPassword"
              >
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')" data-cy="password-error">
                Confirmação de senha é obrigatória
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')" data-cy="password-match-error">
                As senhas não conferem
              </mat-error>
            </mat-form-field>

            <div class="error-message" data-cy="error-message" *ngIf="errorMessage" role="alert">
              {{ errorMessage }}
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="registerForm.invalid || loading"
              data-cy="register-button"
            >
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Criar Conta</span>
            </button>
            <button 
              mat-button 
              type="button" 
              routerLink="/auth/login"
              [disabled]="loading"
            >
              Já tenho uma conta
            </button>
          </mat-card-actions>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 16px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      margin: 16px;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-card-title {
      font-size: 24px;
      margin: 16px 0;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    mat-card-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;

      button {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }

    .error-message {
      color: #f44336;
      margin: 1rem 0;
      text-align: center;
      padding: 8px;
      border-radius: 4px;
      background-color: rgba(244, 67, 54, 0.1);
    }

    mat-spinner {
      margin: 0 8px;
    }

    @media (max-width: 599px) {
      .auth-container {
        padding: 0;
      }

      .auth-card {
        margin: 0;
        max-width: 100%;
        min-height: calc(100vh - 56px);
        border-radius: 0;
      }
    }
  `]
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });

    this.authService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/courses']);
          this.snackBar.open('Conta criada com sucesso!', 'OK', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.snackBar.open(error.message, 'OK', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 