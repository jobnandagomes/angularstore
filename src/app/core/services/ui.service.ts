import { Injectable, signal, computed, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeName = 'light' | 'dark' | 'custom';
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface UITheme {
  name: ThemeName;
  isDark: boolean;
  primary: string;
  accent: string;
  warn: string;
}

export interface UIBreakpoint {
  name: ScreenSize;
  minWidth: number;
}

export interface UIState {
  theme: UITheme;
  currentBreakpoint: ScreenSize;
  isWideScreen: boolean;
  isSidenavOpen: boolean;
  scrollPosition: number;
  isLoading: boolean;
  performanceMode: 'high' | 'balanced' | 'low';
}

const DEFAULT_BREAKPOINTS: UIBreakpoint[] = [
  { name: 'xs', minWidth: 0 },
  { name: 'sm', minWidth: 600 },
  { name: 'md', minWidth: 960 },
  { name: 'lg', minWidth: 1280 },
  { name: 'xl', minWidth: 1920 }
];

const DEFAULT_THEME: UITheme = {
  name: 'light',
  isDark: false,
  primary: '#1976d2',
  accent: '#ff4081',
  warn: '#f44336'
};

const INITIAL_STATE: UIState = {
  theme: DEFAULT_THEME,
  currentBreakpoint: 'md',
  isWideScreen: typeof window !== 'undefined' ? window.innerWidth >= 960 : false,
  isSidenavOpen: false,
  scrollPosition: 0,
  isLoading: false,
  performanceMode: 'high'
};

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localStorage = inject(LocalStorageService);

  private breakpoints = DEFAULT_BREAKPOINTS;
  private state = signal<UIState>({
    ...INITIAL_STATE,
    theme: {
      ...DEFAULT_THEME,
      isDark: this.loadThemePreference()
    }
  });

  // Computed values
  readonly theme = computed(() => this.state().theme);
  readonly currentBreakpoint = computed(() => this.state().currentBreakpoint);
  readonly isWideScreen = computed(() => this.state().isWideScreen);
  readonly isSidenavOpen = computed(() => this.state().isSidenavOpen);
  readonly scrollPosition = computed(() => this.state().scrollPosition);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly showScrollTop = computed(() => this.state().scrollPosition > 500);
  readonly performanceMode = computed(() => this.state().performanceMode);

  // Observables para componentes que precisam reagir às mudanças
  private themeChange = new BehaviorSubject<UITheme>(this.state().theme);
  themeChange$ = this.themeChange.asObservable();

  private breakpointChange = new BehaviorSubject<ScreenSize>(this.state().currentBreakpoint);
  breakpointChange$ = this.breakpointChange.asObservable();

  isDarkTheme(): boolean {
    return this.state().theme.isDark;
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.initializeBreakpointDetection();
      this.initializePerformanceMonitoring();
    }
  }

  private initializeTheme(): void {
    const theme = this.state().theme;
    this.applyTheme(theme);
    this.setupSystemThemeListener();
  }

  private initializeBreakpointDetection(): void {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const breakpoint = this.breakpoints
        .slice()
        .reverse()
        .find(bp => width >= bp.minWidth);

      if (breakpoint && breakpoint.name !== this.state().currentBreakpoint) {
        this.updateBreakpoint(breakpoint.name);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
  }

  private initializePerformanceMonitoring(): void {
    if ('performance' in window) {
      let lastFrameTime = performance.now();

      const checkPerformance = () => {
        const now = performance.now();
        const frameTime = now - lastFrameTime;
        lastFrameTime = now;

        // Ajusta o modo de performance com base no tempo de frame
        let performanceMode: 'high' | 'balanced' | 'low';
        if (frameTime > 32) { // menos que 30fps
          performanceMode = 'low';
        } else if (frameTime > 16) { // entre 30 e 60fps
          performanceMode = 'balanced';
        } else {
          performanceMode = 'high';
        }

        if (performanceMode !== this.state().performanceMode) {
          this.updatePerformanceMode(performanceMode);
        }

        requestAnimationFrame(checkPerformance);
      };

      requestAnimationFrame(checkPerformance);
    }
  }

  private setupSystemThemeListener(): void {
    if (window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMediaQuery.addEventListener('change', e => {
        if (this.state().theme.name !== 'custom') {
          this.toggleTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  toggleTheme(themeName: ThemeName = this.state().theme.isDark ? 'light' : 'dark'): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const newTheme: UITheme = {
      ...this.state().theme,
      name: themeName,
      isDark: themeName === 'dark'
    };

    this.state.update(state => ({
      ...state,
      theme: newTheme
    }));

    this.applyTheme(newTheme);
    this.themeChange.next(newTheme);
  }

  setCustomTheme(theme: Partial<UITheme>): void {
    const newTheme: UITheme = {
      ...this.state().theme,
      ...theme,
      name: 'custom'
    };

    this.state.update(state => ({
      ...state,
      theme: newTheme
    }));

    this.applyTheme(newTheme);
    this.themeChange.next(newTheme);
  }

  setLoading(isLoading: boolean): void {
    this.state.update(state => ({
      ...state,
      isLoading
    }));
  }

  updateScrollPosition(position: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.state.update(state => ({
      ...state,
      scrollPosition: position
    }));

    // Otimização: reduz atualizações de UI em rolagem rápida
    if (this.state().performanceMode === 'low') {
      this.debounceScrollUpdates();
    }
  }

  toggleSidenav(): void {
    this.state.update(state => ({
      ...state,
      isSidenavOpen: !state.isSidenavOpen
    }));
  }

  updateBreakpoint(breakpoint: ScreenSize): void {
    const breakpointWidth = this.breakpoints.find(bp => bp.name === breakpoint)?.minWidth || 0;
    const isWide = breakpointWidth >= 960;

    this.state.update(state => ({
      ...state,
      currentBreakpoint: breakpoint,
      isWideScreen: isWide
    }));

    this.breakpointChange.next(breakpoint);
  }

  updatePerformanceMode(mode: 'high' | 'balanced' | 'low'): void {
    this.state.update(state => ({
      ...state,
      performanceMode: mode
    }));
  }

  private loadThemePreference(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const savedTheme = this.localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(theme: UITheme): void {
    if (!isPlatformBrowser(this.platformId)) return;

    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme.name}-theme`);

    // Aplica cores customizadas se o tema for personalizado
    if (theme.name === 'custom') {
      document.documentElement.style.setProperty('--primary-color', theme.primary);
      document.documentElement.style.setProperty('--accent-color', theme.accent);
      document.documentElement.style.setProperty('--warn-color', theme.warn);
    } else {
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--warn-color');
    }

    this.localStorage.setItem('theme', theme.name);
  }

  updateScreenSize(isWide: boolean): void {
    this.state.update(state => ({
      ...state,
      isWideScreen: isWide
    }));
  }

  private debounceScrollUpdates = (() => {
    let timeout: number;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        // Atualiza elementos que dependem da posição de rolagem
        if (this.state().scrollPosition > 500) {
          document.body.classList.add('show-scroll-top');
        } else {
          document.body.classList.remove('show-scroll-top');
        }
      }, 150);
    };
  })();
} 