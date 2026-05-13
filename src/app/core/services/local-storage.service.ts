import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Get an item from localStorage
   * @param key The key to retrieve
   * @returns The value or null if not found
   */
  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Set an item in localStorage
   * @param key The key to set
   * @param value The value to store
   * @returns true if successful, false otherwise
   */
  setItem(key: string, value: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Remove an item from localStorage
   * @param key The key to remove
   * @returns true if successful, false otherwise
   */
  removeItem(key: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Clear all items from localStorage
   * @returns true if successful, false otherwise
   */
  clear(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Get an item from localStorage and parse it as JSON
   * @param key The key to retrieve
   * @returns The parsed value or null if not found or invalid JSON
   */
  getObject<T>(key: string): T | null {
    const item = this.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.error('Error parsing localStorage item:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Set an object in localStorage by stringifying it
   * @param key The key to set
   * @param value The object to store
   * @returns true if successful, false otherwise
   */
  setObject<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized);
    } catch (error) {
      console.error('Error stringifying object for localStorage:', error);
      return false;
    }
  }
} 