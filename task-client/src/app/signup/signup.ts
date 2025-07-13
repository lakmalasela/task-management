import { Component } from '@angular/core';
import { UserService, UserRegistrationData } from '../user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  username = '';
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  address = '';
  error: string | null = null;
  loading = false;
  private signupSub?: Subscription;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.error = null;
    this.loading = true;
    
    if (this.signupSub) {
      this.signupSub.unsubscribe();
    }

    const signupData: UserRegistrationData = {
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address
    };

    this.signupSub = this.userService.register(signupData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (e: any) => {
        this.error = e.message || 'Signup failed';
        this.loading = false;
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
    if (this.signupSub) {
      this.signupSub.unsubscribe();
    }
  }
} 