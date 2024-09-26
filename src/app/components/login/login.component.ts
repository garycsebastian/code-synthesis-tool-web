import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router'; // For navigation after login
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Notice styleUrls (plural)
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = {}; // Initialize an empty login request object
  errorMessage: string = ''; // To store error messages
  isLoading: boolean = false; // Add loading state

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    // You can add any initialization logic here if needed
  }

  onSubmit(): void {
    this.isLoading = true; // Show loading indicator
    this.errorMessage = ''; // Clear previous errors

    this.authService.login(this.loginRequest)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.cookieService.set('accessToken', response.accessToken);
          this.cookieService.set('refreshToken', response.refreshToken);
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error.message || 'Invalid credentials';
          this.isLoading = false; // Hide loading indicator on error
        },
        complete: () => {
          this.isLoading = false; // Hide loading indicator on completion
        }
      });
  }

  isValidEmail(email: string): boolean {
    // You can use a simple regex or a dedicated email validation library
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
