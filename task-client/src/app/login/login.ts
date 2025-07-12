import { Component } from '@angular/core';
import { Auth } from '../auth';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;
  private loginSub?: Subscription;

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    this.error = null;
    this.loading = true;
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    this.loginSub = this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.error = e.message || 'Login failed';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
}
