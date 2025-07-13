import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((res: any) => {
        if (res && res.access_token) {
          localStorage.setItem('auth_token', res.access_token);
          if (res.username) {
            localStorage.setItem('username', res.username);
          }
        }
      }),
      catchError((err: any) => {
        console.error('Login error:', err);
        
        
        if (err.status === 401 || err.status === 403) {
          return throwError(() => new Error('Invalid username or password'));
        } else if (err.status === 500) {
          // Check if the error message "Invalid credentials"
          if (err.error && err.error.message && err.error.message.includes('Invalid credentials')) {
            return throwError(() => new Error('Invalid username or password'));
          }
          return throwError(() => new Error('Server error. Please try again later.'));
        } else if (err.status === 0 || err.status === 404) {
          return throwError(() => new Error('Cannot connect to server. Please check your connection.'));
        } else {
          return throwError(() => new Error('Login failed. Please try again.'));
        }
      })
    );
  }

  signup(signupData: SignupData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/register`, signupData).pipe(
      catchError((err: any) => {
        console.error('Signup error:', err);
        
        if (err.status === 400) {
          return throwError(() => new Error(err.error?.message || 'Invalid signup data'));
        } else if (err.status === 409) {
          return throwError(() => new Error('Username or email already exists'));
        } else if (err.status === 500) {
          return throwError(() => new Error('Server error. Please try again later.'));
        } else if (err.status === 0 || err.status === 404) {
          return throwError(() => new Error('Cannot connect to server. Please check your connection.'));
        } else {
          return throwError(() => new Error('Signup failed. Please try again.'));
        }
      })
    );
  }
}
