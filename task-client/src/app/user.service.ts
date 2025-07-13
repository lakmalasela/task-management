import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Observable with the created user data
   */
  register(userData: UserRegistrationData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/register`, userData).pipe(
      catchError((err: any) => {
        console.error('User registration error:', err);
        
        if (err.status === 400) {
          return throwError(() => new Error(err.error?.message || 'Invalid registration data'));
        } else if (err.status === 409) {
          return throwError(() => new Error('Username or email already exists'));
        } else if (err.status === 500) {
          return throwError(() => new Error('Server error. Please try again later.'));
        } else if (err.status === 0 || err.status === 404) {
          return throwError(() => new Error('Cannot connect to server. Please check your connection.'));
        } else {
          return throwError(() => new Error('Registration failed. Please try again.'));
        }
      })
    );
  }

  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns Observable with user data
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((err: any) => {
        console.error('Get user error:', err);
        return throwError(() => new Error('Failed to fetch user data'));
      })
    );
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param userData - Updated user data
   * @returns Observable with updated user data
   */
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${userId}`, userData).pipe(
      catchError((err: any) => {
        console.error('Update user error:', err);
        return throwError(() => new Error('Failed to update user data'));
      })
    );
  }

  /**
   * Delete user account
   * @param userId - User ID
   * @returns Observable with deletion confirmation
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((err: any) => {
        console.error('Delete user error:', err);
        return throwError(() => new Error('Failed to delete user account'));
      })
    );
  }
} 