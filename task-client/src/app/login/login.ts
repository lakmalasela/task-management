import { Component } from '@angular/core';
import { Auth } from '../auth';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;
  private loginSub?: Subscription;

  constructor(private auth: Auth, private router: Router, private toastr: ToastrService) {}

  onSubmit() {
    this.error = null;
    this.loading = true;
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    this.loginSub = this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Login successful!', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.error = e.message || 'Login failed';
        this.loading = false;
        this.toastr.error(this.error || 'Login failed', 'Login Failed');
      }
    });
  }

  onInputChange() {
    // Clear error when user starts typing
    if (this.error) {
      this.error = null;
    }
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
}
