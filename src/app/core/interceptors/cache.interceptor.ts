import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Apenas cache para requisições GET
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    const now = Date.now();

    // Se temos uma resposta em cache e ela ainda é válida
    if (cachedResponse && (now - cachedResponse.timestamp) < this.TTL) {
      return of(new HttpResponse({ body: cachedResponse.data }));
    }

    // Se não temos cache ou ele expirou, fazemos a requisição
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.url, {
            data: event.body,
            timestamp: Date.now()
          });
        }
      })
    );
  }
}