import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  showWarning(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  showLoading(): void {
    this.loadingSubject.next(true);
  }

  hideLoading(): void {
    this.loadingSubject.next(false);
  }

  confirmAction(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { title, message }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result === true);
      });
    });
  }
}