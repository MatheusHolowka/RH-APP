import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent implements OnInit {
  // O 'isDarkMode' agora controla o ESTADO, não a classe CSS
  isDarkMode: boolean = true; 
  private renderer = inject(Renderer2);

  ngOnInit() {
    // 1. Verifique o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // 2. Se não tiver, verifique a preferência do sistema
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // 3. Aplique o tema inicial
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme() {
    // 4. Pegue o elemento <html> (document.documentElement)
    const htmlElement = document.documentElement;
    const theme = this.isDarkMode ? 'dark' : 'light';

    // 5. Use o atributo que o CoreUI entende: data-coreui-theme
    this.renderer.setAttribute(htmlElement, 'data-coreui-theme', theme);
    
    // 6. Salve a escolha
    localStorage.setItem('theme', theme);
  }
}