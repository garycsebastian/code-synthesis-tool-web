import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authService: AuthService) { } // Make authService public
  onLogout() {
    this.authService.logout().subscribe(
      () => {
        // Optional: Handle success (e.g., display a message)
      },
      (error) => {
        // Handle logout errors if needed
        console.error('Logout error:', error);
      }
    );
  }
}
