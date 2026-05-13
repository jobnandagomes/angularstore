import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { UIService } from './ui.service';
import { LocalStorageService } from './local-storage.service';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type NetworkStatus = 'online' | 'offline' | 'slow';
export type RenderStrategy = 'standard' | 'virtual-scroll' | 'skeleton';
export type DataFetchingPolicy = 'eager' | 'lazy' | 'progressive';
export type PerformanceProfile = 'high' | 'medium' | 'low';

export interface UserContext {
  deviceType: DeviceType;
  networkStatus: NetworkStatus;
  renderStrategy: RenderStrategy;
  dataFetching: DataFetchingPolicy;
  performance: PerformanceProfile;
}

@Injectable({
  providedIn: 'root'
})
export class ContextAwareService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly networkStatus = new BehaviorSubject<NetworkStatus>('online');

  constructor(
    private uiService: UIService,
    private localStorage: LocalStorageService
  ) {
    this.initializeNetworkListener();
    this.initializePerformanceMonitoring();
  }

  private initializeNetworkListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(
      map(() => this.getNetworkStatus()),
      distinctUntilChanged()
    ).subscribe(status => {
      this.networkStatus.next(status);
    });
  }

  private initializePerformanceMonitoring(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Monitorar métricas de performance web vitals
    if ('performance' in window && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.handlePerformanceEntry(entry);
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        // Ajustar estratégia de renderização baseado no LCP
        break;
      case 'first-input':
        // Ajustar otimizações de input baseado no FID
        break;
      case 'layout-shift':
        // Monitorar e otimizar estabilidade visual
        break;
    }
  }

  getDeviceType(): DeviceType {
    if (!isPlatformBrowser(this.platformId)) return 'desktop';

    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getNetworkStatus(): NetworkStatus {
    if (!isPlatformBrowser(this.platformId) || !navigator.onLine) return 'offline';
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
        return 'slow';
      }
    }
    return 'online';
  }

  getRenderStrategy(device: DeviceType, network: NetworkStatus): RenderStrategy {
    if (network === 'slow' || network === 'offline') return 'skeleton';
    if (device === 'mobile') return 'virtual-scroll';
    return 'standard';
  }

  getDataFetchingPolicy(network: NetworkStatus): DataFetchingPolicy {
    if (network === 'offline') return 'lazy';
    if (network === 'slow') return 'progressive';
    return 'eager';
  }

  getPerformanceProfile(): PerformanceProfile {
    if (!isPlatformBrowser(this.platformId)) return 'medium';

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.jsHeapSizeLimit - memory.usedJSHeapSize < 50 * 1024 * 1024) {
        return 'low';
      }
    }

    return this.networkStatus.value === 'slow' ? 'medium' : 'high';
  }

  getUserContext(): Observable<UserContext> {
    return this.networkStatus.pipe(
      map(networkStatus => {
        const deviceType = this.getDeviceType();
        return {
          deviceType,
          networkStatus,
          renderStrategy: this.getRenderStrategy(deviceType, networkStatus),
          dataFetching: this.getDataFetchingPolicy(networkStatus),
          performance: this.getPerformanceProfile()
        };
      })
    );
  }
}