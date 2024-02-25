import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated().then(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/admin']);
      this.isAuthenticated = false; // Update isAuthenticated on logout
    });
  }
}
