import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from './ui.service';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  message?: string;
  type?: NotificationType;
  duration?: number;
  persistent?: boolean;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: NotificationConfig = {
    duration: 5000,
    type: 'info',
    action: 'Fechar'
  };

  constructor(
    private snackBar: MatSnackBar,
    private uiService: UIService
  ) {}

  show(config: NotificationConfig | string): void {
    let finalConfig: NotificationConfig;

    if (typeof config === 'string') {
      finalConfig = {
        message: config,
        ...this.defaultConfig
      };
    } else {
      finalConfig = {
        ...this.defaultConfig,
        ...config
      };
    }

    const panelClass = this.getPanelClass(finalConfig.type!);

    this.snackBar.open(finalConfig.message!, finalConfig.action!, {
      duration: finalConfig.duration,
      panelClass: [panelClass, this.uiService.isDarkTheme() ? 'dark-theme' : ''],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  success(message: string, duration = 5000): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration = 8000): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration = 6000): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration = 5000): void {
    this.show({ message, type: 'info', duration });
  }

  private getPanelClass(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'warning':
        return 'notification-warning';
      default:
        return 'notification-info';
    }
  }
}