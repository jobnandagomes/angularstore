// Monitoramento avançado de performance
export class AnalyticsService {
  private perfMetrics$ = new Subject<PerfMetric>();

  constructor() {
    this.initCoreWebVitals();
    this.initCustomMetrics();
  }

  private initCoreWebVitals() {
    onCLS(metric => this.reportMetric('CLS', metric));
    onFID(metric => this.reportMetric('FID', metric));
    onLCP(metric => this.reportMetric('LCP', metric));
  }

  private initCustomMetrics() {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        this.trackCustomMetric(entry);
      }
    });
    
    observer.observe({ entryTypes: ['measure', 'resource'] });
  }
} 