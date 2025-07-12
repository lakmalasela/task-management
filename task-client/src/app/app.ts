import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('task-client');

  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getUsername(): string {
    // Placeholder: in a real app, decode token or fetch user info
    return localStorage.getItem('username') || 'User';
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
