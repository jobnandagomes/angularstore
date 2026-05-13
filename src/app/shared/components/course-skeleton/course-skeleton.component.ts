import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-course-skeleton',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="skeleton-card" appearance="outlined">
      <div class="skeleton-image"></div>
      <mat-card-header>
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </mat-card-header>
      <mat-card-content>
        <div class="skeleton-description"></div>
        <div class="skeleton-details">
          <div class="skeleton-level"></div>
          <div class="skeleton-duration"></div>
        </div>
        <div class="skeleton-price"></div>
      </mat-card-content>
      <mat-card-actions>
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .skeleton-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .skeleton-image {
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-title {
      height: 24px;
      width: 80%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      margin-bottom: 8px;
      border-radius: 4px;
    }

    .skeleton-subtitle {
      height: 16px;
      width: 60%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-description {
      height: 60px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin: 16px 0;
    }

    .skeleton-details {
      display: flex;
      justify-content: space-between;
      margin: 16px 0;
    }

    .skeleton-level, .skeleton-duration {
      height: 20px;
      width: 80px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-price {
      height: 32px;
      width: 120px;
      margin: 16px auto;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-button {
      height: 36px;
      width: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin: 8px 0;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class CourseSkeletonComponent {}