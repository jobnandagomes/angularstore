import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

export interface NotificationData {
  message: string;
  action: string;
  icon?: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="notification-container" role="alert" [@slideIn]>
      <div class="notification-content">
        <mat-icon *ngIf="data.icon" class="notification-icon" aria-hidden="true">
          {{ data.icon }}
        </mat-icon>
        <span class="notification-message">{{ data.message }}</span>
      </div>
      <button mat-button class="notification-action" 
              (click)="snackBarRef.dismiss()"
              [attr.aria-label]="data.action">
        {{ data.action }}
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .notification-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 48px;
      padding: 8px 16px;
      background: var(--notification-bg, #323232);
      color: var(--notification-color, #fff);
      border-radius: 4px;
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 
                 0 6px 10px 0 rgba(0,0,0,.14), 
                 0 1px 18px 0 rgba(0,0,0,.12);
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .notification-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .notification-message {
      font-size: 14px;
      line-height: 1.4;
      margin-right: 16px;
    }

    .notification-action {
      margin: -8px -16px -8px 0;
      color: inherit;
      font-weight: 500;
      letter-spacing: 0.25px;
      text-transform: uppercase;
      min-width: auto;
      padding: 0 16px;
    }

    :host-context(.notification-success) {
      --notification-bg: #43a047;
    }

    :host-context(.notification-error) {
      --notification-bg: #d32f2f;
    }

    :host-context(.notification-warning) {
      --notification-bg: #fb8c00;
    }

    :host-context(.notification-info) {
      --notification-bg: #1976d2;
    }

    :host-context(.dark-theme) {
      .notification-container {
        background: var(--notification-bg, #424242);
      }
    }

    @media (max-width: 599px) {
      .notification-container {
        padding: 8px;
      }

      .notification-message {
        font-size: 13px;
      }

      .notification-action {
        margin: -8px -8px -8px 0;
        padding: 0 8px;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    public snackBarRef: MatSnackBarRef<NotificationComponent>
  ) {}
} 