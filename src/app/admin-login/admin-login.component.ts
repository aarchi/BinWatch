import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html'
})
export class AdminLoginComponent implements OnInit {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated().then((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/admin-panel']);
      }
    });
  }

  login() {
    this.authService.login(this.username, this.password)
      .then(() => {
        this.router.navigate(['/admin-panel']);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'User not found.';
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = 'Incorrect password.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      });
  }
}
