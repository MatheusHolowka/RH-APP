import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ProcessoService } from '../../../processo/services/processo.service'; // 1. Importe

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Injeta os serviços
  private authService = inject(AuthService);
  private router = inject(Router);
  private processoService = inject(ProcessoService); // 2. Injete

  // 3. Cria Signals para controlar o estado da tela
  public isLoading = signal(true); // Começa carregando
  public processos = signal<any[]>([]); // Lista de processos

  ngOnInit(): void {
    // 4. Assim que o componente carregar, busque os processos
    this.loadProcessos();
  }

  loadProcessos(): void {
    this.isLoading.set(true); // Ativa o "Carregando"
    
    this.processoService.getProcessos().subscribe({
      next: (data) => {
        // 5. Sucesso! Salva os dados no signal
        this.processos.set(data);
        this.isLoading.set(false); // Desativa o "Carregando"
      },
      error: (err) => {
        // 6. Erro! (Ex: token expirou)
        console.error('Erro ao buscar processos', err);
        this.isLoading.set(false);
        // (Opcional: se o erro for 401, deslogue o usuário)
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}