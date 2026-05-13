import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não mostrar loading para alguns endpoints específicos
    if (request.url.includes('/refresh-token') || request.url.includes('/health-check')) {
      return next.handle(request);
    }

    this.loadingService.setLoading(true, request.url);

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.setLoading(false, request.url);
      })
    );
  }
}