import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('auth_token', res.token);
        }
      }),
      catchError((err) => {
        return throwError(() => new Error(err?.error?.message || 'Invalid username or password'));
      })
    );
  }
}
