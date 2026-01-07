import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router'; // 1. Importe RouterLink
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,       // Para o <router-outlet>
    RouterLink,         // Para o [routerLink]
    ThemeToggleComponent, // Nosso botão de tema
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss', // Vamos criar este CSS
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Controla se a sidebar está visível
  sidebarVisible = true;

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}