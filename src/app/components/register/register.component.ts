import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {FormsModule} from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  newUser: User = {username: '', password: ''};
  errorMessage: string = '';
  isLoading: boolean = false;
  registerForm: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Check if newUser.password is defined before passing it to isValidPassword
    if (this.newUser.password && !this.isValidPassword(this.newUser.password)) {
      this.errorMessage = 'Password must meet the requirements.';
      this.isLoading = false;
      return;
    }

    this.authService.register(this.newUser)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // You might want to automatically log the user in here
          // or redirect them to the login page with a success message.
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.error.message || 'Registration failed.';
          this.isLoading = false;
        }
      });
  }

  isValidPassword(password: string): boolean {
    // Implement your password validation logic here
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return passwordRegex.test(password);
  }

  isValidEmail(email: string): boolean {
    // You can use a simple regex or a dedicated email validation library
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
