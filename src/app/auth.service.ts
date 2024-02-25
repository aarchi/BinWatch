import { Injectable } from '@angular/core';
import { BehaviorSubject, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    // Initialize the authentication state based on localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      this.authenticated.next(true);
    }
  }

  login(username: string, password: string): Promise<boolean> {
    // For demonstration purposes, checking if username and password match 'admin' and 'password'
    const isAdmin = username === 'admin' && password === 'password';
    if (isAdmin) {
      this.authenticated.next(true);
      localStorage.setItem('isAuthenticated', 'true');
      return Promise.resolve(true);
    } else {
      this.authenticated.next(false);
      localStorage.removeItem('isAuthenticated');
      return Promise.reject(new Error('Invalid username or password'));
    }
  }

  logout(): Promise<void> {
    this.authenticated.next(false);
    localStorage.removeItem('isAuthenticated');
    return Promise.resolve();
  }

  isAuthenticated(): Promise<boolean> {
    return this.authenticated.pipe(first()).toPromise();
  }
}
