import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-overlay" *ngIf="loading$ | async">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  `]
})
export class LoadingComponent {
  constructor(private loadingService: LoadingService) {}

  get loading$() {
    return this.loadingService.loading$;
  }
}
