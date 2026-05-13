import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap = new Map<string, boolean>();

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setLoading(loading: boolean, url: string): void {
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSubject.next(true);
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }

    if (this.loadingMap.size === 0) {
      this.loadingSubject.next(false);
    }
  }

  getLoading(): boolean {
    return this.loadingSubject.value;
  }
}